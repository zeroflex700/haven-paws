"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ImportedPuppyDetails = {
  sourceUrl: string;
  name: string;
  breedName: string | null;
  sex: string | null;
  price: number | null;
  depositAmount: number | null;
  description: string | null;
  status: string | null;
  color: string | null;
  weightEstimate: number | null;
  markings: string | null;
  size: string | null;
  generation: string | null;
  ageWeeks: number | null;
  litterId: string | null;
  readyDate: string | null;
  momName: string | null;
  momBreed: string | null;
  momWeight: string | null;
  momRegistration: string | null;
  dadName: string | null;
  dadBreed: string | null;
  dadWeight: string | null;
  dadRegistration: string | null;
  includedItems: string[];
};

type ImportResult = {
  id: string;
  name: string;
};

function cleanText(
  value: string | null | undefined
): string | null {
  if (!value) return null;

  const cleaned = value
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || null;
}

function textValue(
  formData: FormData,
  field: string
): string | null {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  return cleanText(value);
}

function numberValue(
  formData: FormData,
  field: string
): number | null {
  const value = textValue(formData, field);

  if (!value) return null;

  const number = Number(
    value.replace(/[$,]/g, "")
  );

  return Number.isFinite(number)
    ? number
    : null;
}

function firstNumber(
  values: unknown[]
): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const match = value.match(
        /(?:[$£€]\s*)?([\d,]+(?:\.\d+)?)/ 
      );

      if (match) {
        const number = Number(
          match[1].replace(/,/g, "")
        );

        if (Number.isFinite(number)) {
          return number;
        }
      }
    }
  }

  return null;
}

function absoluteUrl(
  value: string,
  sourceUrl: string
): string | null {
  try {
    return new URL(value, sourceUrl).toString();
  } catch {
    return null;
  }
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/");
}

function extractMeta(
  html: string,
  property: string
): string | null {
  const escaped = property.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escaped}["'][^>]*>`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return cleanText(
        decodeHtml(match[1])
      );
    }
  }

  return null;
}

function extractTitle(
  html: string
): string | null {
  const match = html.match(
    /<title[^>]*>([\s\S]*?)<\/title>/i
  );

  return match?.[1]
    ? cleanText(
        decodeHtml(match[1])
      )
    : null;
}

function extractJsonLdObjects(
  html: string
): unknown[] {
  const objects: unknown[] = [];

  const matches = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );

  for (const match of matches) {
    try {
      const parsed = JSON.parse(
        match[1]
      );

      if (Array.isArray(parsed)) {
        objects.push(...parsed);
      } else {
        objects.push(parsed);
      }
    } catch {
      // Ignore invalid JSON-LD.
    }
  }

  return objects;
}

function flattenJsonLd(
  objects: unknown[]
): Record<string, unknown>[] {
  const records: Record<string, unknown>[] = [];

  function visit(value: unknown) {
    if (!value) return;

    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item);
      }

      return;
    }

    if (
      typeof value !== "object"
    ) {
      return;
    }

    const record =
      value as Record<string, unknown>;

    records.push(record);

    for (const child of Object.values(record)) {
      visit(child);
    }
  }

  for (const object of objects) {
    visit(object);
  }

  return records;
}

function findJsonValue(
  records: Record<string, unknown>[],
  keys: string[]
): unknown {
  const wanted = keys.map((key) =>
    key.toLowerCase()
  );

  for (const record of records) {
    for (const [key, value] of Object.entries(
      record
    )) {
      if (
        wanted.includes(
          key.toLowerCase()
        )
      ) {
        if (
          value !== null &&
          value !== undefined &&
          value !== ""
        ) {
          return value;
        }
      }
    }
  }

  return null;
}

function valueToText(
  value: unknown
): string | null {
  if (typeof value === "string") {
    return cleanText(value);
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    if (
      typeof record.name === "string"
    ) {
      return cleanText(
        record.name
      );
    }

    if (
      typeof record.value === "string"
    ) {
      return cleanText(
        record.value
      );
    }
  }

  return null;
}

function getPuppyName(
  html: string,
  records: Record<string, unknown>[],
  sourceUrl: string
): string {
  const jsonName =
    valueToText(
      findJsonValue(
        records,
        ["name"]
      )
    );

  if (jsonName) {
    return jsonName;
  }

  const metaName =
    extractMeta(
      html,
      "og:title"
    ) ??
    extractMeta(
      html,
      "twitter:title"
    );

  if (metaName) {
    return metaName
      .replace(
        /\s*[|–—-]\s*(PuppySpot|Haven Paws).*$/i,
        ""
      )
      .trim();
  }

  const title =
    extractTitle(html);

  if (title) {
    return title
      .replace(
        /\s*[|–—-]\s*(PuppySpot|Haven Paws).*$/i,
        ""
      )
      .trim();
  }

  try {
    const pathname =
      new URL(sourceUrl).pathname;

    const match =
      pathname.match(
        /\/puppy\/([^/]+)/i
      );

    if (match?.[1]) {
      return decodeURIComponent(
        match[1]
      ).replace(
        /[-_]+/g,
        " "
      );
    }
  } catch {
    // Ignore.
  }

  return "Imported Puppy";
}

function getBreedName(
  records: Record<string, unknown>[]
): string | null {
  const value =
    findJsonValue(
      records,
      ["breed", "breedName"]
    );

  return valueToText(value);
}

function getSex(
  html: string,
  records: Record<string, unknown>[]
): string | null {
  const value =
    valueToText(
      findJsonValue(
        records,
        [
          "gender",
          "sex",
        ]
      )
    );

  if (value) {
    const lower =
      value.toLowerCase();

    if (
      lower.includes("female") ||
      lower === "girl"
    ) {
      return "female";
    }

    if (
      lower.includes("male") ||
      lower === "boy"
    ) {
      return "male";
    }
  }

  const text =
    stripHtml(html);

  if (
    /\b(female|girl)\b/i.test(
      text
    )
  ) {
    return "female";
  }

  if (
    /\b(male|boy)\b/i.test(
      text
    )
  ) {
    return "male";
  }

  return null;
}

function getAgeWeeks(
  html: string,
  records: Record<string, unknown>[]
): number | null {
  const value =
    firstNumber([
      findJsonValue(
        records,
        [
          "age_weeks",
          "ageWeeks",
          "ageInWeeks",
        ]
      ),
    ]);

  if (
    value !== null &&
    value >= 0 &&
    value <= 200
  ) {
    return Math.round(value);
  }

  const text =
    stripHtml(html);

  const patterns = [
    /(\d+)\s*(?:week|weeks)\s*old/i,
    /age\s*[:\-]?\s*(\d+)\s*(?:week|weeks)/i,
    /(\d+)\s*weeks/i,
  ];

  for (const pattern of patterns) {
    const match =
      text.match(pattern);

    if (match?.[1]) {
      const age =
        Number(match[1]);

      if (
        Number.isFinite(age) &&
        age >= 0 &&
        age <= 200
      ) {
        return age;
      }
    }
  }

  return null;
}

function getPrice(
  html: string,
  records: Record<string, unknown>[]
): number | null {
  const value =
    firstNumber([
      findJsonValue(
        records,
        [
          "price",
          "priceAmount",
          "lowPrice",
        ]
      ),
      extractMeta(
        html,
        "product:price:amount"
      ),
    ]);

  return value;
}

function getDescription(
  html: string,
  records: Record<string, unknown>[]
): string | null {
  const jsonDescription =
    valueToText(
      findJsonValue(
        records,
        [
          "description",
        ]
      )
    );

  if (jsonDescription) {
    return jsonDescription;
  }

  return extractMeta(
    html,
    "og:description"
  );
}

function findParentObject(
  records: Record<string, unknown>[],
  names: string[]
): Record<string, unknown> | null {
  const wanted =
    names.map((name) =>
      name.toLowerCase()
    );

  for (const record of records) {
    for (const [
      key,
      value,
    ] of Object.entries(record)) {
      if (
        !wanted.includes(
          key.toLowerCase()
        )
      ) {
        continue;
      }

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        return value as Record<
          string,
          unknown
        >;
      }
    }
  }

  return null;
}

function extractParent(
  html: string,
  records: Record<string, unknown>[],
  parent: "mom" | "dad"
) {
  const object =
    parent === "mom"
      ? findParentObject(
          records,
          [
            "mother",
            "motherAnimal",
            "dam",
            "mom",
          ]
        )
      : findParentObject(
          records,
          [
            "father",
            "fatherAnimal",
            "sire",
            "dad",
          ]
        );

  const prefix =
    parent === "mom"
      ? "mom"
      : "dad";

  const name =
    valueToText(
      object?.name ??
        findJsonValue(
          records,
          [
            `${prefix}_name`,
            `${prefix}Name`,
          ]
        )
    );

  const breed =
    valueToText(
      object?.breed ??
        findJsonValue(
          records,
          [
            `${prefix}_breed`,
            `${prefix}Breed`,
          ]
        )
    );

  const weight =
    valueToText(
      object?.weight ??
        object?.weightValue ??
        findJsonValue(
          records,
          [
            `${prefix}_weight`,
            `${prefix}Weight`,
          ]
        )
    );

  const registration =
    valueToText(
      object?.registration ??
        object?.registrationNumber ??
        findJsonValue(
          records,
          [
            `${prefix}_registration`,
            `${prefix}Registration`,
          ]
        )
    );

  const text =
    stripHtml(html);

  const fallbackName =
    extractLabeledValue(
      text,
      parent === "mom"
        ? [
            "Mother",
            "Mom",
            "Dam",
          ]
        : [
            "Father",
            "Dad",
            "Sire",
          ]
    );

  return {
    name:
      name ??
      fallbackName,
    breed,
    weight,
    registration,
  };
}

function extractLabeledValue(
  text: string,
  labels: string[]
): string | null {
  for (const label of labels) {
    const regex =
      new RegExp(
        `${label}\\s*[:\\-]?\\s*([^\\n|]{2,100})`,
        "i"
      );

    const match =
      text.match(regex);

    if (match?.[1]) {
      const value =
        cleanText(
          match[1]
        );

      if (
        value &&
        !/^(name|breed|weight|registration)$/i.test(
          value
        )
      ) {
        return value;
      }
    }
  }

  return null;
}

function stripHtml(
  html: string
): string {
  return decodeHtml(
    html
      .replace(
        /<script[\s\S]*?<\/script>/gi,
        " "
      )
      .replace(
        /<style[\s\S]*?<\/style>/gi,
        " "
      )
      .replace(
        /<[^>]+>/g,
        "\n"
      )
      .replace(
        /\r/g,
        ""
      )
  )
    .replace(
      /[ \t]+/g,
      " "
    )
    .replace(
      /\n\s*\n+/g,
      "\n"
    )
    .trim();
}

/**
 * These are the internal values used by Haven Paws.
 *
 * Keep these values aligned with lib/includedItems.ts.
 */
const INCLUDED_ITEM_PATTERNS: Array<{
  key: string;
  patterns: RegExp[];
}> = [
  {
    key: "health_commitment",
    patterns: [
      /10[- ]year health commitment/i,
    ],
  },
  {
    key: "microchip",
    patterns: [
      /\bmicrochip\b/i,
    ],
  },
  {
    key: "fully_vetted_breeder",
    patterns: [
      /fully vetted breeder/i,
    ],
  },
  {
    key: "nose_to_tail_vet_check",
    patterns: [
      /nose[- ]to[- ]tail veterinarian health check/i,
      /nose[- ]to[- ]tail.*health check/i,
    ],
  },
  {
    key: "vaccinations_deworming",
    patterns: [
      /vaccinations?\s*&?\s*deworming/i,
      /vaccinations?.*deworming/i,
    ],
  },
  {
    key: "vet_records",
    patterns: [
      /\bvet records?\b/i,
      /\bveterinary records?\b/i,
    ],
  },
  {
    key: "white_glove_delivery",
    patterns: [
      /white glove delivery options?/i,
    ],
  },
  {
    key: "pet_insurance_discount",
    patterns: [
      /10% discounted rate for pet insurance/i,
      /discounted rate for pet insurance/i,
    ],
  },
  {
    key: "registration",
    patterns: [
      /\bregistration\b/i,
    ],
  },
  {
    key: "haven_paws_breeder_screening",
    patterns: [
      /haven paws breeder screening/i,
    ],
  },
  {
    key: "secure_traceable_payments",
    patterns: [
      /secure,?\s*traceable payments/i,
      /secure.*traceable payments/i,
    ],
  },
];

function extractIncludedItems(
  html: string,
  records: Record<string, unknown>[]
): string[] {
  const text =
    stripHtml(html);

  const includedValues: string[] = [];

  const jsonIncluded =
    findJsonValue(
      records,
      [
        "included_items",
        "includedItems",
        "features",
        "benefits",
        "whatsIncluded",
        "whatIsIncluded",
      ]
    );

  if (
    Array.isArray(
      jsonIncluded
    )
  ) {
    for (
      const item of jsonIncluded
    ) {
      const value =
        valueToText(item);

      if (value) {
        includedValues.push(
          value
        );
      }
    }
  }

  const combined =
    [
      text,
      ...includedValues,
    ].join("\n");

  const found: string[] = [];

  for (
    const item of INCLUDED_ITEM_PATTERNS
  ) {
    if (
      item.patterns.some(
        (pattern) =>
          pattern.test(combined)
      )
    ) {
      found.push(item.key);
    }
  }

  return Array.from(
    new Set(found)
  );
}

function getWeight(
  html: string,
  records: Record<string, unknown>[]
): number | null {
  return firstNumber([
    findJsonValue(
      records,
      [
        "weight_estimate",
        "weightEstimate",
        "weight",
      ]
    ),
  ]);
}

function getColor(
  records: Record<string, unknown>[]
): string | null {
  return valueToText(
    findJsonValue(
      records,
      [
        "color",
        "colour",
      ]
    )
  );
}

function getMarkings(
  records: Record<string, unknown>[]
): string | null {
  return valueToText(
    findJsonValue(
      records,
      [
        "markings",
        "marking",
      ]
    )
  );
}

function getSize(
  records: Record<string, unknown>[]
): string | null {
  return valueToText(
    findJsonValue(
      records,
      [
        "size",
      ]
    )
  );
}

function getGeneration(
  records: Record<string, unknown>[]
): string | null {
  return valueToText(
    findJsonValue(
      records,
      [
        "generation",
      ]
    )
  );
}

function getLitterId(
  records: Record<string, unknown>[]
): string | null {
  return valueToText(
    findJsonValue(
      records,
      [
        "litter_id",
        "litterId",
      ]
    )
  );
}

function getReadyDate(
  records: Record<string, unknown>[]
): string | null {
  const value =
    valueToText(
      findJsonValue(
        records,
        [
          "ready_date",
          "readyDate",
          "availableDate",
        ]
      )
    );

  if (!value) return null;

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date
    .toISOString()
    .slice(0, 10);
}

function getStatus(
  records: Record<string, unknown>[]
): string | null {
  const value =
    valueToText(
      findJsonValue(
        records,
        [
          "availability",
          "availabilityStatus",
          "status",
        ]
      )
    );

  if (!value) return null;

  const lower =
    value.toLowerCase();

  if (
    lower.includes("sold")
  ) {
    return "sold";
  }

  if (
    lower.includes("reserved")
  ) {
    return "reserved";
  }

  if (
    lower.includes("available")
  ) {
    return "available";
  }

  return null;
}

async function fetchSourcePage(
  url: string
): Promise<string> {
  const token =
    process.env.BROWSERLESS_TOKEN;

  if (!token) {
    throw new Error(
      "BROWSERLESS_TOKEN is not configured."
    );
  }

  const endpoint =
    "https://production-sfo.browserless.io/content" +
    `?token=${encodeURIComponent(token)}` +
    "&proxy=residential" +
    "&proxyCountry=us";

  const response =
    await fetch(endpoint, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        url,
      }),

      cache: "no-store",
    });

  if (!response.ok) {
    const body =
      await response.text();

    console.error(
      "BROWSERLESS ERROR:",
      response.status,
      body
    );

    throw new Error(
      `Unable to fetch the source website through the importer (HTTP ${response.status}).`
    );
  }

  const html =
    await response.text();

  if (!html.trim()) {
    throw new Error(
      "The source website returned an empty page."
    );
  }

  return html;
}

      /*
       * Cache the source page.
       *
       * This makes the second operation extremely quick and
       * prevents us from downloading the same listing twice.
       */
      next: {
        revalidate: 300,
      },
    });

  if (!response.ok) {
    throw new Error(
      `The source website returned HTTP ${response.status}.`
    );
  }

  const html =
    await response.text();

  if (!html.trim()) {
    throw new Error(
      "The source website returned an empty page."
    );
  }

  return html;
}

async function scrapePuppy(
  sourceUrl: string
): Promise<ImportedPuppyDetails> {
  const html =
    await fetchSourcePage(
      sourceUrl
    );

  const records =
    flattenJsonLd(
      extractJsonLdObjects(html)
    );

  const mom =
    extractParent(
      html,
      records,
      "mom"
    );

  const dad =
    extractParent(
      html,
      records,
      "dad"
    );

  return {
    sourceUrl,

    name:
      getPuppyName(
        html,
        records,
        sourceUrl
      ),

    breedName:
      getBreedName(
        records
      ),

    sex:
      getSex(
        html,
        records
      ),

    price:
      getPrice(
        html,
        records
      ),

    depositAmount:
      firstNumber([
        findJsonValue(
          records,
          [
            "deposit_amount",
            "depositAmount",
            "deposit",
          ]
        ),
      ]),

    description:
      getDescription(
        html,
        records
      ),

    status:
      getStatus(
        records
      ),

    color:
      getColor(
        records
      ),

    weightEstimate:
      getWeight(
        html,
        records
      ),

    markings:
      getMarkings(
        records
      ),

    size:
      getSize(
        records
      ),

    generation:
      getGeneration(
        records
      ),

    ageWeeks:
      getAgeWeeks(
        html,
        records
      ),

    litterId:
      getLitterId(
        records
      ),

    readyDate:
      getReadyDate(
        records
      ),

    momName:
      mom.name,

    momBreed:
      mom.breed,

    momWeight:
      mom.weight,

    momRegistration:
      mom.registration,

    dadName:
      dad.name,

    dadBreed:
      dad.breed,

    dadWeight:
      dad.weight,

    dadRegistration:
      dad.registration,

    includedItems:
      extractIncludedItems(
        html,
        records
      ),
  };
}

/**
 * Called automatically when the URL is pasted.
 */
export async function previewPuppyFromUrl(
  sourceUrl: string
): Promise<ImportedPuppyDetails> {
  const trimmed =
    sourceUrl.trim();

  if (!trimmed) {
    throw new Error(
      "Please enter a puppy listing URL."
    );
  }

  let parsedUrl: URL;

  try {
    parsedUrl =
      new URL(trimmed);
  } catch {
    throw new Error(
      "Please enter a valid puppy listing URL."
    );
  }

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new Error(
      "Only HTTP and HTTPS URLs are supported."
    );
  }

  return scrapePuppy(
    parsedUrl.toString()
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
    .select(
      "id, breed_id"
    )
    .eq(
      "id",
      breederId
    )
    .single();

  if (
    error ||
    !breeder
  ) {
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

function parseIncludedItems(
  formData: FormData
): string[] {
  const raw =
    formData.get(
      "included_items"
    );

  if (
    typeof raw !== "string" ||
    !raw.trim()
  ) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(raw);

    if (
      Array.isArray(
        parsed
      )
    ) {
      return Array.from(
        new Set(
          parsed.filter(
            (item): item is string =>
              typeof item === "string"
          )
        )
      );
    }
  } catch {
    // Ignore invalid JSON.
  }

  return [];
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

  try {
    const parsed =
      new URL(sourceUrl);

    if (
      parsed.protocol !==
        "http:" &&
      parsed.protocol !==
        "https:"
    ) {
      throw new Error();
    }
  } catch {
    throw new Error(
      "Please enter a valid HTTP or HTTPS source URL."
    );
  }

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

  const ageRaw =
    numberValue(
      formData,
      "age_weeks"
    );

  const puppyData = {
    name,

    breed_id:
      breedId,

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
      ageRaw === null
        ? null
        : Math.round(
            ageRaw
          ),

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

    included_items:
      parseIncludedItems(
        formData
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
    .select(
      "id, name"
    )
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