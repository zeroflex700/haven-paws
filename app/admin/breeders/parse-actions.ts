"use server";

import { createClient } from "@/lib/supabase/server";

export type ParsedBreederData = {
  name: string | null;
  breed_name: string | null;
  meet_breeder_text: string | null;
  getting_a_puppy_text: string | null;
  qa: { question: string; answer: string }[];
  more_about: { iconKey: string; heading: string; body: string }[];
  health_testing: { iconKey: string; heading: string; body: string }[];
};

export type BreederParseResult =
  | { success: true; data: ParsedBreederData }
  | { success: false; error: string };

const ALLOWED_ICONS = [
  "award",
  "badge_check",
  "calendar_check",
  "bone",
  "eye",
  "activity",
  "heart_pulse",
  "paw_print",
];

function cleanString(value: unknown): string | null {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : null;
}

function normalizeData(value: unknown): ParsedBreederData {
  const data = value as Record<string, unknown>;

  const qa = Array.isArray(data.qa)
    ? data.qa
        .filter((item): item is Record<string, unknown> =>
          Boolean(item && typeof item === "object")
        )
        .map((item) => ({
          question: cleanString(item.question) ?? "",
          answer: cleanString(item.answer) ?? "",
        }))
        .filter((item) => item.question && item.answer)
    : [];

  function normalizeEntries(value: unknown) {
    if (!Array.isArray(value)) return [];

    return value
      .filter((item): item is Record<string, unknown> =>
        Boolean(item && typeof item === "object")
      )
      .map((item) => ({
        iconKey:
          typeof item.iconKey === "string" &&
          ALLOWED_ICONS.includes(item.iconKey)
            ? item.iconKey
            : "award",
        heading: cleanString(item.heading) ?? "",
        body: cleanString(item.body) ?? "",
      }))
      .filter((item) => item.heading && item.body);
  }

  return {
    name: cleanString(data.name),
    breed_name: cleanString(data.breed_name),
    meet_breeder_text: cleanString(data.meet_breeder_text),
    getting_a_puppy_text: cleanString(data.getting_a_puppy_text),
    qa,
    more_about: normalizeEntries(data.more_about),
    health_testing: normalizeEntries(data.health_testing),
  };
}

export async function parseBreederText(
  rawText: string
): Promise<BreederParseResult> {
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
      error: "Please paste the breeder information first.",
    };
  }

  if (rawText.length > 50000) {
    return {
      success: false,
      error: "The pasted information is too long. Please use a shorter text.",
    };
  }

  const supabase = await createClient();

  const { data: breeds, error: breedsError } = await supabase
    .from("breeds")
    .select("name")
    .order("name");

  if (breedsError) {
    return {
      success: false,
      error: "Could not load the existing breed list.",
    };
  }

  const breedNames = (breeds ?? []).map((breed) => breed.name);

  const prompt = `
You are a precise information extraction assistant for a professional dog breeder website.

Extract structured breeder profile information from the supplied text. The text may be copied from WhatsApp, websites, emails, documents, or social media and may contain messy formatting.

STRICT EXTRACTION RULES:
1. Extract only information explicitly present in the source. NEVER invent facts, claims, achievements, health tests, policies, guarantees, or contact details.
2. Return null for missing single-value fields and empty arrays for missing lists.
3. Do not write new marketing copy or expand the source into claims the breeder did not make.
4. Preserve the original meaning and important details. You may correct obvious spelling, punctuation, and formatting.
5. Keep the breeder's original tone where possible.
6. "name" means the breeder's actual name or business name, not the dog's name or breed.
7. "breed_name" must match an existing breed from this list when there is a clear match: ${JSON.stringify(breedNames)}. Otherwise return null.
8. "meet_breeder_text" is the breeder introduction, background, philosophy, experience, family story, or information about the breeder. Extract the relevant continuous text. Do not include unrelated puppy purchasing instructions.
9. "getting_a_puppy_text" is the actual process of enquiring, reserving, paying, collecting, shipping, or bringing a puppy home. Preserve stated requirements and instructions. Do not invent steps.
10. "qa" must contain separate question-and-answer objects. Extract actual questions and their corresponding answers. Do not invent questions or answers.
11. "more_about" must contain separate entries with heading and body. Use information about the breeder, breeding philosophy, environment, experience, socialization, facilities, practices, and other general profile information. Do not duplicate the same content across entries.
12. "health_testing" must contain separate entries about parent health testing, screenings, examinations, certifications, and health clearances. Only include tests or results explicitly mentioned. Do not claim that a parent passed a test unless the source says so.
13. Each more_about and health_testing entry must have an iconKey selected from this exact list:
${JSON.stringify(ALLOWED_ICONS)}
14. Choose the most relevant icon based on the heading and content. Use "award" when no more specific icon fits.
15. Do not put health testing information into more_about if it belongs in health_testing.
16. Do not create entries from generic claims without useful supporting details.
17. Do not confuse the breeder's own health testing with puppy vaccinations or puppy care.

Return ONLY valid JSON with this exact structure:

{
  "name": "string or null",
  "breed_name": "string or null",
  "meet_breeder_text": "string or null",
  "getting_a_puppy_text": "string or null",
  "qa": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "more_about": [
    {
      "iconKey": "one allowed icon key",
      "heading": "string",
      "body": "string"
    }
  ],
  "health_testing": [
    {
      "iconKey": "one allowed icon key",
      "heading": "string",
      "body": "string"
    }
  ]
}

SOURCE TEXT:
"""
${rawText}
"""
`;

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

      const result = await response.json();
      const responseText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        lastErrorText = "Gemini returned an empty response.";
        continue;
      }

      const cleaned = responseText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "");

      const parsed = JSON.parse(cleaned);

      return {
        success: true,
        data: normalizeData(parsed),
      };
    } catch (err) {
      lastErrorText =
        err instanceof Error ? err.message : "Unknown parsing error";
    }
  }

  return {
    success: false,
    error: `Gemini parsing failed. ${lastErrorText.slice(0, 200)}`,
  };
}
