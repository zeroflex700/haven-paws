"use server";

import { SCORECARD_FIELDS } from "@/lib/breedGuideFields";
import { createClient } from "@/lib/supabase/server";

export type ParsedBreedGuideData = {
  overviewQuote: string | null;
  overviewSupport: string | null;
  whyPeopleLove: string | null;
  appearanceText: string | null;
  groomingText: string | null;
  temperamentText: string | null;
  exerciseText: string | null;
  trainingText: string | null;
  dietText: string | null;
  healthIntroText: string | null;
  historyText: string | null;
  scorecard: Record<string, string>;
  relatedBreedIds: string[];
};

export type ParseResult =
  | { success: true; data: ParsedBreedGuideData }
  | { success: false; error: string };

export async function parseBreedGuideText(
  rawText: string,
  breedId: string,
  breedName: string
): Promise<ParseResult> {
  const apiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter((key): key is string => Boolean(key));

  if (apiKeys.length === 0) {
    return {
      success: false,
      error: "No Gemini API keys are configured on the server.",
    };
  }

  if (!rawText || rawText.trim().length < 10) {
    return {
      success: false,
      error: "Please paste some breed information first.",
    };
  }

  const supabase = await createClient();

  const { data: guideRows } = await supabase
    .from("breed_guides")
    .select("breed_id, breeds ( id, name )")
    .neq("breed_id", breedId);

  const candidateBreeds = (guideRows ?? [])
    .map((r) => r.breeds as unknown as { id: string; name: string } | null)
    .filter((b): b is { id: string; name: string } => Boolean(b));

  const candidateList = candidateBreeds
    .map((b) => `- id: "${b.id}", name: "${b.name}"`)
    .join("\n");

  const scoreFieldsList = SCORECARD_FIELDS.filter((f) => f.type === "score")
    .map((f) => `- key: "${f.key}", label: "${f.label}" (rate 1-5)`)
    .join("\n");

  const textFieldsList = SCORECARD_FIELDS.filter((f) => f.type === "text")
    .map((f) => `- key: "${f.key}", label: "${f.label}" (short text)`)
    .join("\n");

  const prompt = `You are helping populate a breed guide page for the "${breedName}" breed on a dog breeder website. You will be given pasted text (often copied from an article, breed encyclopedia entry, or club/AKC-style page) about this breed. You have two jobs on this text: (1) EXTRACT the article-style fields strictly from what's stated, and (2) FILL the scorecard and related breeds using your own general knowledge of the breed, informed by (but not limited to) the pasted text.

PART 1 — ARTICLE FIELDS (STRICT EXTRACTION ONLY):
For each of these fields, only fill it in if the pasted text actually contains relevant content for it. Lightly clean up wording/grammar but do not invent facts not present in the text. If the text doesn't cover a section at all, return null for it.
- overviewQuote: a short, punchy 1-2 sentence pull-quote capturing the breed's essence, drawn from the text.
- overviewSupport: one supporting sentence that expands on the quote.
- whyPeopleLove: a paragraph on why people love this breed.
- appearanceText: a paragraph on physical appearance.
- groomingText: a paragraph on grooming needs/routine.
- temperamentText: a paragraph on temperament and characteristics.
- exerciseText: a paragraph on exercise needs.
- trainingText: a paragraph on trainability/training approach.
- dietText: a paragraph on diet and nutrition.
- healthIntroText: an intro paragraph on health issues (general, not a list of individual conditions).
- historyText: a paragraph on the breed's history/origin.

PART 2 — SCORECARD (USE YOUR OWN KNOWLEDGE OF THE BREED):
Unlike Part 1, these do not need to be explicitly stated in the pasted text. Use the pasted text as context/confirmation where relevant, but otherwise rely on your general knowledge of the "${breedName}" breed to fill these in as a knowledgeable breed expert would. Only return null/omit a key if you genuinely have no reasonable basis to judge it.

Score fields (return a string of "1" through "5"):
${scoreFieldsList}

Short-text fields (return a short factual string, e.g. "13-15 in", "10-14 years"):
${textFieldsList}

Return these as a flat "scorecard" object mapping key -> string value. Omit a key entirely rather than guessing wildly.

PART 3 — RELATED BREEDS (USE YOUR OWN KNOWLEDGE):
From this list of breeds that already have guides on the site, pick 2-5 that are genuinely similar to "${breedName}" (by size, temperament, grouping, or purpose) to feature as "Related Breeds". Only return ids from this exact list — never invent an id or suggest a breed not on it. If none are a good fit, return an empty array.

CANDIDATE BREEDS:
${candidateList || "(none available)"}

Return ONLY valid JSON matching this exact shape, nothing else, no markdown code fences:

{
  "overviewQuote": string | null,
  "overviewSupport": string | null,
  "whyPeopleLove": string | null,
  "appearanceText": string | null,
  "groomingText": string | null,
  "temperamentText": string | null,
  "exerciseText": string | null,
  "trainingText": string | null,
  "dietText": string | null,
  "healthIntroText": string | null,
  "historyText": string | null,
  "scorecard": { [key: string]: string },
  "relatedBreedIds": string[]
}

PASTED TEXT:
"""
${rawText}
"""`;

  let lastErrorText = "";

  for (const apiKey of apiKeys) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        }
      );

      if (!response.ok) {
        lastErrorText = await response.text();

        if (response.status === 429 || response.status === 503) {
          continue;
        }

        return {
          success: false,
          error: `Gemini API error: ${lastErrorText.slice(0, 200)}`,
        };
      }

      const result = await parseGeminiResponse(response);
      return result;
    } catch (err) {
      lastErrorText =
        err instanceof Error ? err.message : "Unknown fetch error";
      continue;
    }
  }

  return {
    success: false,
    error: `All Gemini API keys failed or are rate-limited. Last error: ${lastErrorText.slice(0, 200)}`,
  };
}

async function parseGeminiResponse(response: Response): Promise<ParseResult> {
  try {
    const result = await response.json();
    const text: string | undefined =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return { success: false, error: "No response returned from Gemini." };
    }

    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "");

    const parsed = JSON.parse(cleaned) as ParsedBreedGuideData;

    return { success: true, data: parsed };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? `Failed to parse response: ${err.message}`
          : "Failed to parse response.",
    };
  }
}