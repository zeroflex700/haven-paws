"use server";

import { ALL_INCLUDED_ITEMS } from "@/lib/includedItems";
import { createClient } from "@/lib/supabase/server";

export type ParsedPuppyData = {
  name: string | null;
  sex: "male" | "female" | null;
  breed_name: string | null;
  color: string | null;
  markings: string | null;
  size: string | null;
  generation: string | null;
  age_weeks: number | null;
  price: number | null;
  deposit_amount: number | null;
  description: string | null;
  included_items: string[];
  mom_name: string | null;
  mom_breed: string | null;
  mom_weight: string | null;
  mom_registration: string | null;
  dad_name: string | null;
  dad_breed: string | null;
  dad_weight: string | null;
  dad_registration: string | null;
};

export type ParseResult =
  | { success: true; data: ParsedPuppyData }
  | { success: false; error: string };

export async function parsePuppyText(
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
      error: "Please paste some puppy information first.",
    };
  }

  const supabase = await createClient();

  const { data: breeds } = await supabase
    .from("breeds")
    .select("name")
    .order("name");

  const breedNames = (breeds ?? []).map((b) => b.name);

  const includedItemsList = ALL_INCLUDED_ITEMS.map(
    (item) => `- key: "${item.key}", label: "${item.label}"`
  ).join("\n");

  const prompt = `You are extracting structured puppy listing data from messy, unstructured text (often copy-pasted from WhatsApp messages, emails, or other puppy marketplace sites). The text may contain irrelevant marketing fluff, repeated content, or unrelated sections.

STRICT RULES:
1. Only extract a value if it is EXPLICITLY stated or very clearly implied in the text. NEVER invent, guess, or estimate a value that is not present.
2. If a field is not mentioned anywhere in the text, return null for it (or an empty array for included_items if none match).
3. For "breed_name", only match it to one of these existing breeds if there is a clear match (case-insensitive, allow for minor spelling variation): ${JSON.stringify(breedNames)}. If there is no reasonable match, return null.
4. For "included_items", match mentioned perks to this exact list of keys based on their label meaning (the wording in the text may differ slightly from the label, e.g. "10-Year Limited Health Warranty" matches "health_commitment"):
${includedItemsList}
Only include a key if something in the text clearly corresponds to it. Return an array of matching keys, or an empty array.
5. For "description", extract or lightly clean up the puppy's own first-person introduction paragraph (e.g. "Hi, I'm X! I'm a ... " style text), if present. Keep its warm tone. Do not fabricate one if no such intro exists — return null instead.
6. For "price" and "deposit_amount", only extract if an explicit dollar amount is stated for that specific purpose. Do not confuse a deposit amount with the full price or vice versa.
7. For mom/dad fields, carefully disambiguate scrambled parent sections. A parent's "name" is a proper name (e.g. "Rocky"), not the breed. If a parent's name is not stated (e.g. only "mom" with no proper name), return null for that name field specifically, while still extracting their breed/weight/registration if present.
8. Weight should be returned as the exact string given (e.g. "10 - 12 lbs"), not converted or estimated.
9. age_weeks, price, and deposit_amount must be numbers (no currency symbols, no "lbs", no "weeks" suffix) or null.
10. sex must be exactly "male", "female", or null.

Return ONLY valid JSON matching this exact shape, nothing else, no markdown code fences:

{
  "name": string | null,
  "sex": "male" | "female" | null,
  "breed_name": string | null,
  "color": string | null,
  "markings": string | null,
  "size": string | null,
  "generation": string | null,
  "age_weeks": number | null,
  "price": number | null,
  "deposit_amount": number | null,
  "description": string | null,
  "included_items": string[],
  "mom_name": string | null,
  "mom_breed": string | null,
  "mom_weight": string | null,
  "mom_registration": string | null,
  "dad_name": string | null,
  "dad_breed": string | null,
  "dad_weight": string | null,
  "dad_registration": string | null
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

        // Rate-limited or overloaded — try the next key instead of failing.
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

    const parsed = JSON.parse(cleaned) as ParsedPuppyData;

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