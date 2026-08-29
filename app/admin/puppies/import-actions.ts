"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ImportResult = {
  id: string;
  name: string;
};

export type PuppyImportDraft = {
  sourceUrl: string;
  name: string;
  breedName: string;
  sex: string;
  price: string;
  depositAmount: string;
  description: string;
  status: string;
  color: string;
  weightEstimate: string;
  markings: string;
  size: string;
  generation: string;
  ageWeeks: string;
  litterId: string;
  readyDate: string;

  breederName: string;

  momName: string;
  momBreed: string;
  momWeight: string;
  momRegistration: string;

  dadName: string;
  dadBreed: string;
  dadWeight: string;
  dadRegistration: string;

  vetChecked: boolean;
  vaccinated: boolean;
  isPublished: boolean;
};

function textValue(
  formData: FormData,
  field: string
): string | null {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  return cleaned || null;
}

function numberValue(
  formData: FormData,
  field: string
): number | null {
  const value = textValue(formData, field);

  if (!value) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

function cleanText(value: string): string {
  return value
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function firstMatch(
  text: string,
  patterns: RegExp[]
): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return cleanText(match[1]);
    }
  }

  return "";
}

function normalizeBreedName(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .trim();
}

function parseMoney(value: string): string {
  const match = value.match(
    /\$?\s*([\d,]+(?:\.\d{1,2})?)/
  );

  if (!match?.[1]) {
    return "";
  }

  return match[1].replace(/,/g, "");
}

function parseReadyDate(
  value: string
): string {
  if (!value || /go home/i.test(value)) {
    return "";
  }

  const currentYear = new Date().getFullYear();

  const parsed = new Date(
    `${value} ${currentYear}`
  );

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const month = String(
    parsed.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    parsed.getDate()
  ).padStart(2, "0");

  return `${currentYear}-${month}-${day}`;
}

function extractDescription(
  markdown: string,
  name: string
): string {
  const escapedName =
    name.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  const pattern = new RegExp(
    `###\\s+Hi,?\\s+I'm\\s+${escapedName}\\s*\\n+([\\s\\S]*?)(?=\\n#{2,4}\\s|$)`,
    "i"
  );

  const match = markdown.match(pattern);

  if (match?.[1]) {
    const description = cleanText(
      match[1]
    );

    return description
      .replace(
        /^Hi,?\s+I'm\s+[^!]+!\s*/i,
        ""
      )
      .trim();
  }

  const genericPattern =
    /###\s+Hi,\s*I'm[^\n]*\n+([\s\S]*?)(?=\n#{2,4}\s|$)/i;

  const genericMatch =
    markdown.match(genericPattern);

  if (genericMatch?.[1]) {
    return cleanText(
      genericMatch[1]
    )
      .replace(
        /^Hi,?\s+I'm\s+[^!]+!\s*/i,
        ""
      )
      .trim();
  }

  return "";
}

function extractParent(
  markdown: string,
  parent: "mom" | "dad"
) {
  const sectionMatch =
    markdown.match(
      /###\s+[^\n]*'s parents\s*([\s\S]*?)(?=\n#{2,4}\s|$)/i
    );

  const section =
    sectionMatch?.[1] ?? markdown;

  const label =
    parent === "mom"
      ? "mom"
      : "dad";

  const name = firstMatch(
    section,
    [
      new RegExp(
        `${label}:\\s*([^\\n]+)`,
        "i"
      ),
    ]
  );

  const parentBlockMatch =
    section.match(
      new RegExp(
        `${label}:\\s*([^\\n]+)([\\s\\S]{0,250})`,
        "i"
      )
    );

  const block =
    parentBlockMatch
      ? `${parentBlockMatch[1]}\n${parentBlockMatch[2]}`
      : "";

  const breed = firstMatch(
    block,
    [
      /Breed\s+([^\n]+)/i,
    ]
  );

  const weight = firstMatch(
    block,
    [
      /Weight\s+([^\n]+)/i,
    ]
  );

  const registration = firstMatch(
    block,
    [
      /Registration(?:\s*&\s*certifications)?\s*[:\-]?\s*([^\n]+)/i,
    ]
  );

  return {
    name,
    breed,
    weight,
    registration,
  };
}

function parsePuppySpotPage(
  markdown: string,
  sourceUrl: string
): PuppyImportDraft {
  const text = cleanText(markdown);

  const name = firstMatch(
    text,
    [
      /^#\s+([^\n]+)/m,
      /^Title:\s*(.+)$/im,
    ]
  ).replace(
    /\s*[|–-]\s*PuppySpot.*$/i,
    ""
  ).trim();

  if (!name) {
    throw new Error(
      "I could not find the puppy name on the source page."
    );
  }

  const priceText = firstMatch(
    text,
    [
      /It is\s+\$?([\d,]+(?:\.\d{1,2})?)\s+to bring home/i,
      /bring home fee[\s\S]{0,120}?\$?([\d,]+(?:\.\d{1,2})?)/i,
      /bring home[\s\S]{0,120}?\$?([\d,]+(?:\.\d{1,2})?)/i,
    ]
  );

  const price =
    parseMoney(priceText);

  const detailsMatch =
    text.match(
      /(?:^|\n)([A-Za-z][A-Za-z .'-]+?)\s+(Male|Female)\s+•\s+(\d+)\s+weeks?\s+old\s+•\s+Ready(?:\s+by)?\s+([A-Z][a-z]+\s+\d{1,2}|to go home)/i
    );

  let breedName = "";
  let sex = "";
  let ageWeeks = "";
  let readyDate = "";

  if (detailsMatch) {
    breedName =
      normalizeBreedName(
        detailsMatch[1]
      );

    sex =
      detailsMatch[2].toLowerCase();

    ageWeeks =
      detailsMatch[3];

    readyDate =
      parseReadyDate(
        detailsMatch[4]
      );
  }

  if (!breedName) {
    const breedFromHeading =
      firstMatch(
        text,
        [
          /Quick facts about\s+([^\n]+)/i,
        ]
      );

    breedName =
      normalizeBreedName(
        breedFromHeading
      );
  }

  const color =
    firstMatch(
      text,
      [
        /####\s*Color\s*\n+([^\n]+)/i,
        /###\s*Color\s*\n+([^\n]+)/i,
      ]
    );

  const markings =
    firstMatch(
      text,
      [
        /####\s*Markings\s*\n+([^\n]+)/i,
        /###\s*Markings\s*\n+([^\n]+)/i,
      ]
    );

  const size =
    firstMatch(
      text,
      [
        /####\s*Size\s*\n+([^\n]+)/i,
        /###\s*Size\s*\n+([^\n]+)/i,
      ]
    );

  const generation =
    firstMatch(
      text,
      [
        /####\s*Generation\s*\n+([^\n]+)/i,
        /###\s*Generation\s*\n+([^\n]+)/i,
      ]
    );

  const description =
    extractDescription(
      text,
      name
    );

  const mom =
    extractParent(
      text,
      "mom"
    );

  const dad =
    extractParent(
      text,
      "dad"
    );

  const breederName =
    firstMatch(
      text,
      [
        /About [^\n]*breeder[\s\S]{0,250}?Raised by\s+([^\n]+)/i,
        /Raised by\s+([^\n]+)/i,
      ]
    );

  const vetChecked =
    /nose-to-tail veterinarian health check/i.test(
      text
    );

  const vaccinated =
    /vaccinations?\s*(?:&|and)\s*deworming/i.test(
      text
    );

  const status =
    /•\s*Available/i.test(text)
      ? "available"
      : "available";

  return {
    sourceUrl,

    name,

    breedName,

    sex,

    price,

    depositAmount: "",

    description,

    status,

    color,

    weightEstimate: "",

    markings,

    size,

    generation,

    ageWeeks,

    litterId: "",

    readyDate,

    breederName,

    momName: mom.name,
    momBreed: mom.breed,
    momWeight: mom.weight,
    momRegistration:
      mom.registration,

    dadName: dad.name,
    dadBreed: dad.breed,
    dadWeight: dad.weight,
    dadRegistration:
      dad.registration,

    vetChecked,

    vaccinated,

    isPublished: false,
  };
}

async function fetchWithJina(
  sourceUrl: string
): Promise<string> {
  const jinaUrl =
    `https://r.jina.ai/${sourceUrl}`;

  const headers: HeadersInit = {
    Accept: "text/markdown",
    "X-Engine": "browser",
    "X-Timeout": "30",
  };

  const jinaKey =
    process.env.JINA_API_KEY;

  if (jinaKey) {
    headers.Authorization =
      `Bearer ${jinaKey}`;
  }

  const response = await fetch(
    jinaUrl,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `The page reader returned HTTP ${response.status}.`
    );
  }

  const content =
    await response.text();

  if (!content.trim()) {
    throw new Error(
      "The page reader returned an empty page."
    );
  }

  return content;
}

function validateSourceUrl(
  sourceUrl: string
): URL {
  try {
    const parsed =
      new URL(sourceUrl);

    if (
      parsed.protocol !== "http:" &&
      parsed.protocol !== "https:"
    ) {
      throw new Error();
    }

    return parsed;
  } catch {
    throw new Error(
      "Please enter a valid HTTP or HTTPS puppy listing URL."
    );
  }
}

/**
 * Called automatically when the admin pastes a URL.
 *
 * IMPORTANT:
 * This does NOT create the puppy.
 * It only retrieves the listing and returns
 * the information needed to fill the form.
 */
export async function lookupPuppyFromUrl(
  sourceUrl: string
): Promise<PuppyImportDraft> {
  const parsed =
    validateSourceUrl(
      sourceUrl.trim()
    );

  const hostname =
    parsed.hostname
      .toLowerCase()
      .replace(/^www\./, "");

  if (
    hostname !== "puppyspot.com" &&
    !hostname.endsWith(".puppyspot.com")
  ) {
    throw new Error(
      "Automatic import is currently configured for PuppySpot URLs."
    );
  }

  const markdown =
    await fetchWithJina(
      parsed.toString()
    );

  return parsePuppySpotPage(
    markdown,
    parsed.toString()
  );
}

async function validateBreederForBreed(
  supabase: Awaited<
    ReturnType<typeof createClient>
  >,
  breederId: string | null,
  breedId: string
) {
  if (!breederId) {
    return;
  }

  const {
    data: breeder,
    error,
  } = await supabase
    .from("breeders")
    .select("id, breed_id")
    .eq("id", breederId)
    .single();

  if (error || !breeder) {
    throw new Error(
      "The selected breeder was not found."
    );
  }

  if (
    breeder.breed_id !==
    breedId
  ) {
    throw new Error(
      "The selected breeder does not belong to the selected breed."
    );
  }
}

export async function createPuppyFromImport(
  formData: FormData
): Promise<ImportResult> {
  const supabase =
    await createClient();

  const sourceUrl =
    textValue(
      formData,
      "source_url"
    );

  const name =
    textValue(
      formData,
      "name"
    );

  const breedId =
    textValue(
      formData,
      "breed_id"
    );

  const breederId =
    textValue(
      formData,
      "breeder_id"
    );

  if (!sourceUrl) {
    throw new Error(
      "A source website URL is required."
    );
  }

  validateSourceUrl(
    sourceUrl
  );

  if (!name) {
    throw new Error(
      "A puppy name is required."
    );
  }

  if (!breedId) {
    throw new Error(
      "A breed is required."
    );
  }

  const price =
    numberValue(
      formData,
      "price"
    );

  if (price === null) {
    throw new Error(
      "A valid puppy price is required."
    );
  }

  await validateBreederForBreed(
    supabase,
    breederId,
    breedId
  );

  const description =
    textValue(
      formData,
      "description"
    ) ?? "";

  const finalDescription =
    description
      ? `${description}\n\nSource listing:\n${sourceUrl}`
      : `Source listing:\n${sourceUrl}`;

  const puppyData = {
    name,

    breed_id: breedId,

    breeder_id:
      breederId,

    sex:
      textValue(
        formData,
        "sex"
      ),

    price,

    deposit_amount:
      numberValue(
        formData,
        "deposit_amount"
      ) ?? 0,

    description:
      finalDescription,

    status:
      textValue(
        formData,
        "status"
      ) ?? "available",

    color:
      textValue(
        formData,
        "color"
      ),

    weight_estimate:
      numberValue(
        formData,
        "weight_estimate"
      ),

    markings:
      textValue(
        formData,
        "markings"
      ),

    size:
      textValue(
        formData,
        "size"
      ),

    generation:
      textValue(
        formData,
        "generation"
      ),

    age_weeks:
      numberValue(
        formData,
        "age_weeks"
      ) !== null
        ? Math.round(
            numberValue(
              formData,
              "age_weeks"
            ) as number
          )
        : null,

    litter_id:
      textValue(
        formData,
        "litter_id"
      ),

    ready_date:
      textValue(
        formData,
        "ready_date"
      ),

    vet_checked:
      formData.get(
        "vet_checked"
      ) === "on",

    vaccinated:
      formData.get(
        "vaccinated"
      ) === "on",

    is_published:
      formData.get(
        "is_published"
      ) === "on",

    mom_name:
      textValue(
        formData,
        "mom_name"
      ),

    mom_breed:
      textValue(
        formData,
        "mom_breed"
      ),

    mom_weight:
      textValue(
        formData,
        "mom_weight"
      ),

    mom_registration:
      textValue(
        formData,
        "mom_registration"
      ),

    dad_name:
      textValue(
        formData,
        "dad_name"
      ),

    dad_breed:
      textValue(
        formData,
        "dad_breed"
      ),

    dad_weight:
      textValue(
        formData,
        "dad_weight"
      ),

    dad_registration:
      textValue(
        formData,
        "dad_registration"
      ),
  };

  const {
    data: puppy,
    error,
  } = await supabase
    .from("puppies")
    .insert(
      puppyData
    )
    .select("id, name")
    .single();

  if (
    error ||
    !puppy
  ) {
    throw new Error(
      error?.message ??
        "Failed to create the puppy."
    );
  }

  revalidatePath("/");
  revalidatePath(
    "/puppies"
  );
  revalidatePath(
    "/admin"
  );
  revalidatePath(
    "/admin/puppies"
  );

  return {
    id: puppy.id,
    name: puppy.name,
  };
}