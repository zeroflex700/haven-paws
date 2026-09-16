"use server";

import { createClient } from "@/lib/supabase/server";
import { ICON_OPTIONS } from "@/lib/breederIcons";

export type ParsedBreederData = {
  name: string | null;
  breed_name: string | null;
  meet_breeder_text: string | null;
  getting_a_puppy_text: string | null;
  qa_items: { question: string; answer: string }[];
  more_about_items: { icon_key: string; heading: string; body: string }[];
  health_testing_items: {
    icon_key: string;
    heading: string;
    body: string;
  }[];
};

export type ParseResult =
  | { success: true; data: ParsedBreederData }
  | { success: false; error: string };

export async function parseBreederText(
  rawText: string
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
      error: "Please paste some breeder information first.",
    };
  }

  const supabase = await createClient();

  const { data: breeds } = await supabase
    .from("breeds")
    .select("name")
    .order("name");

  const breedNames = (breeds ?? []).map((b) => b.name);

  const iconKeysList = ICON_OPTIONS.map(
    (opt) => `- key: "${opt.key}", meaning: "${opt.label}"`
  ).join("\n");

  const prompt = `You are extracting structured dog breeder profile data from messy, unstructured text (often copy-pasted from WhatsApp messages, emails, an existing website, or marketing copy). The text may contain irrelevant fluff, repeated content, or unrelated sections.

STRICT RULES:
1. Only extract a value if it is EXPLICITLY stated or very clearly implied in the text. NEVER invent, guess, or estimate a value that is not present.
2. If a field is not mentioned anywhere in the text, return null for it (or an empty array for list fields if none match).
3. For "breed_name", only match it to one of these existing breeds if there is a clear match (case-insensitive, allow for minor spelling variation): ${JSON.stringify(breedNames)}. If there is no reasonable match, return null.
4. For "meet_breeder_text", extract or lightly clean up the breeder's own introduction/bio paragraph — first-person or about-the-breeder text. Keep its warm, personal tone. Do not fabricate one if no such intro exists — return null instead.
5. For "getting_a_puppy_text", extract any section describing the breeder's process for getting a puppy from them (application steps, waitlist, pickup/delivery process, etc.). Return null if not present.
6. For "qa_items", extract any explicit question-and-answer pairs present in the text (e.g. an FAQ section, or "Q: ... A: ..." style content). Each item needs both a question and an answer actually present in the text — do not invent questions. Return an empty array if none found.
7. For "more_about_items" and "health_testing_items", extract distinct short facts/highlights about the breeder (more_about_items) versus specifically health/veterinary-testing related facts about their breeding dogs (health_testing_items) — e.g. "OFA hip certified", "genetic panel testing on all parents". Each item needs a short heading (a few words) and a body (one or two sentences), both drawn from the text, not invented. For each item's "icon_key", choose the single best-matching key from this list based on meaning:
${iconKeysList}
Return empty arrays for either list if the text doesn't contain that kind of content.

Return ONLY valid JSON matching this exact shape, nothing else, no markdown code fences:

{
  "name": string | null,
  "breed_name": string | null,
  "meet_breeder_text": string | null,
  "getting_a_puppy_text": string | null,
  "qa_items": [{ "question": string, "answer": string }],
  "more_about_items": [{ "icon_key": string, "heading": string, "body": string }],
  "health_testing_items": [{ "icon_key": string, "heading": string, "body": string }]
}

TEXT TO EXTRACT FROM:
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
              temperature: 0.1,
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

      return await parseGeminiResponse(response);
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

async function parseGeminiResponse(
  response: Response
): Promise<ParseResult> {
  try {
    const result = await response.json();
    const text: string | undefined =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        success: false,
        error: "No response returned from Gemini.",
      };
    }

    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "");

    const parsed = JSON.parse(cleaned) as ParsedBreederData;

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