"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ImportedMedia = {
  url: string;
  mediaType: "image" | "video";
};

type ImportResult = {
  id: string;
  name: string;
  mediaCount: number;
};

function cleanText(value: string | null | undefined): string | null {
  if (!value) return null;

  const cleaned = value
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || null;
}

function absoluteUrl(value: string, sourceUrl: string): string | null {
  try {
    return new URL(value, sourceUrl).toString();
  } catch {
    return null;
  }
}

function extractMeta(
  html: string,
  property: string
): string | null {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
      return cleanText(match[1]);
    }
  }

  return null;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractTitle(html: string): string | null {
  const match = html.match(
    /<title[^>]*>([\s\S]*?)<\/title>/i
  );

  if (!match?.[1]) return null;

  return cleanText(decodeHtml(match[1]));
}

function extractJsonLdObjects(html: string): unknown[] {
  const objects: unknown[] = [];

  const matches = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );

  for (const match of matches) {
    try {
      const parsed = JSON.parse(match[1]);

      if (Array.isArray(parsed)) {
        objects.push(...parsed);
      } else {
        objects.push(parsed);
      }
    } catch {
      // Ignore malformed JSON-LD.
    }
  }

  return objects;
}

function collectImagesFromJsonLd(
  objects: unknown[],
  sourceUrl: string
): string[] {
  const urls: string[] = [];

  function visit(value: unknown) {
    if (!value || typeof value !== "object") return;

    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item);
      }

      return;
    }

    const record = value as Record<string, unknown>;

    for (const key of ["image", "contentUrl", "thumbnailUrl"]) {
      const candidate = record[key];

      if (typeof candidate === "string") {
        const url = absoluteUrl(candidate, sourceUrl);

        if (url) urls.push(url);
      }

      if (Array.isArray(candidate)) {
        for (const item of candidate) {
          if (typeof item === "string") {
            const url = absoluteUrl(item, sourceUrl);

            if (url) urls.push(url);
          }
        }
      }
    }

    for (const child of Object.values(record)) {
      visit(child);
    }
  }

  for (const object of objects) {
    visit(object);
  }

  return urls;
}

function extractHtmlImages(
  html: string,
  sourceUrl: string
): string[] {
  const urls: string[] = [];

  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/gi,
    /<img[^>]+data-src=["']([^"']+)["']/gi,
    /<img[^>]+data-original=["']([^"']+)["']/gi,
    /<source[^>]+src=["']([^"']+)["']/gi,
  ];

  for (const pattern of patterns) {
    const matches = html.matchAll(pattern);

    for (const match of matches) {
      const raw = decodeHtml(match[1]);

      const url = absoluteUrl(raw, sourceUrl);

      if (url) {
        urls.push(url);
      }
    }
  }

  return urls;
}

function extractVideos(
  html: string,
  sourceUrl: string
): string[] {
  const urls: string[] = [];

  const patterns = [
    /<video[^>]+src=["']([^"']+)["']/gi,
    /<source[^>]+src=["']([^"']+)["'][^>]*>/gi,
  ];

  for (const pattern of patterns) {
    const matches = html.matchAll(pattern);

    for (const match of matches) {
      const raw = decodeHtml(match[1]);

      const url = absoluteUrl(raw, sourceUrl);

      if (url) {
        urls.push(url);
      }
    }
  }

  return urls;
}

function uniqueUrls(urls: string[]): string[] {
  return Array.from(
    new Set(
      urls
        .map((url) => url.trim())
        .filter(Boolean)
    )
  );
}

function isProbablyImage(url: string): boolean {
  const clean = url.split("?")[0].toLowerCase();

  return /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(clean);
}

function isProbablyVideo(url: string): boolean {
  const clean = url.split("?")[0].toLowerCase();

  return /\.(mp4|webm|mov|m4v|ogg)$/i.test(clean);
}

function getPuppyName(
  html: string,
  sourceUrl: string
): string {
  const jsonLd = extractJsonLdObjects(html);

  for (const item of jsonLd) {
    if (!item || typeof item !== "object") continue;

    const record = item as Record<string, unknown>;

    if (
      typeof record.name === "string" &&
      record.name.trim()
    ) {
      return record.name.trim();
    }

    if (Array.isArray(record["@graph"])) {
      for (const graphItem of record["@graph"]) {
        if (
          graphItem &&
          typeof graphItem === "object" &&
          typeof (graphItem as Record<string, unknown>).name ===
            "string"
        ) {
          return String(
            (graphItem as Record<string, unknown>).name
          ).trim();
        }
      }
    }
  }

  const title =
    extractMeta(html, "og:title") ??
    extractTitle(html);

  if (title) {
    return title
      .replace(/\s*[|–-]\s*PuppySpot.*$/i, "")
      .trim();
  }

  try {
    const pathname = new URL(sourceUrl).pathname;

    const puppyMatch = pathname.match(
      /\/puppy\/([^/]+)$/i
    );

    if (puppyMatch?.[1]) {
      return decodeURIComponent(
        puppyMatch[1]
      ).replace(/[-_]+/g, " ");
    }
  } catch {
    // Ignore.
  }

  return "Imported Puppy";
}

function getBreedName(
  html: string
): string | null {
  const jsonLd = extractJsonLdObjects(html);

  for (const item of jsonLd) {
    if (!item || typeof item !== "object") continue;

    const record = item as Record<string, unknown>;

    const breed = record.breed;

    if (typeof breed === "string") {
      return cleanText(breed);
    }

    if (
      breed &&
      typeof breed === "object" &&
      typeof (breed as Record<string, unknown>).name ===
        "string"
    ) {
      return cleanText(
        String(
          (breed as Record<string, unknown>).name
        )
      );
    }
  }

  return null;
}

async function findBreedId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  breedName: string | null
): Promise<string | null> {
  if (!breedName) return null;

  const { data } = await supabase
    .from("breeds")
    .select("id, name");

  if (!data) return null;

  const wanted = breedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  const match = data.find((breed) => {
    const existing = String(breed.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

    return (
      existing === wanted ||
      existing.includes(wanted) ||
      wanted.includes(existing)
    );
  });

  return match?.id ?? null;
}

async function fetchSourcePage(url: string): Promise<string> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; HavenPawsImporter/1.0)",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `The source website returned HTTP ${response.status}.`
    );
  }

  const html = await response.text();

  if (!html.trim()) {
    throw new Error("The source website returned an empty page.");
  }

  return html;
}

export async function importPuppyFromUrl(
  sourceUrl: string
): Promise<ImportResult> {
  const parsedUrl = new URL(sourceUrl);

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  const html = await fetchSourcePage(sourceUrl);

  const supabase = await createClient();

  const name = getPuppyName(html, sourceUrl);

  const breedName = getBreedName(html);

  const breedId = await findBreedId(
    supabase,
    breedName
  );

  const ogImage = extractMeta(
    html,
    "og:image"
  );

  const twitterImage = extractMeta(
    html,
    "twitter:image"
  );

  const jsonLdImages =
    collectImagesFromJsonLd(
      extractJsonLdObjects(html),
      sourceUrl
    );

  const htmlImages =
    extractHtmlImages(
      html,
      sourceUrl
    );

  const imageUrls = uniqueUrls([
    ...(ogImage
      ? [absoluteUrl(ogImage, sourceUrl)].filter(
          Boolean
        ) as string[]
      : []),
    ...(twitterImage
      ? [absoluteUrl(twitterImage, sourceUrl)].filter(
          Boolean
        ) as string[]
      : []),
    ...jsonLdImages,
    ...htmlImages,
  ]).filter(isProbablyImage);

  const videoUrls = uniqueUrls(
    extractVideos(html, sourceUrl)
  ).filter(isProbablyVideo);

  const media: ImportedMedia[] = [
    ...imageUrls.map((url) => ({
      url,
      mediaType: "image" as const,
    })),
    ...videoUrls.map((url) => ({
      url,
      mediaType: "video" as const,
    })),
  ];

  const { data: puppy, error: puppyError } =
    await supabase
      .from("puppies")
      .insert({
        name,
        breed_id: breedId,
        price: 0,
        status: "available",
        is_published: false,
        description:
          `Imported from ${sourceUrl}`,
      })
      .select("id, name")
      .single();

  if (puppyError || !puppy) {
    throw new Error(
      puppyError?.message ??
        "Failed to create the puppy."
    );
  }

  if (media.length > 0) {
    const mediaRows = media.map(
      (item, index) => ({
        puppy_id: puppy.id,
        media_type: item.mediaType,
        url: item.url,
        cloudinary_public_id: null,
        sort_order: index,
        is_cover: index === 0,
      })
    );

    const { error: mediaError } =
      await supabase
        .from("puppy_media")
        .insert(mediaRows);

    if (mediaError) {
      await supabase
        .from("puppies")
        .delete()
        .eq("id", puppy.id);

      throw new Error(
        `Puppy was created but media could not be saved: ${mediaError.message}`
      );
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/puppies");
  revalidatePath(`/admin/puppies/${puppy.id}`);
  revalidatePath(`/admin/puppies/${puppy.id}/media`);

  return {
    id: puppy.id,
    name: puppy.name,
    mediaCount: media.length,
  };
}