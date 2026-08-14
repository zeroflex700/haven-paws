import { supabase } from "@/lib/supabase/client";
import type { PuppyRecord } from "./puppies";
import type { RelatedPuppy } from "./relatedPuppies";

type RawPuppyRow = {
  id: string;
  name: string;
  sex: "male" | "female";
  price: number;
  birth_date: string | null;
  ready_date: string | null;
  status: "available" | "reserved" | "sold";
  breeds: { name: string } | null;
  puppy_media: {
    url: string;
    is_cover: boolean;
    media_type: string;
  }[] | null;
};

type RelatedRawPuppyRow = {
  id: string;
  name: string;
  sex: "male" | "female";
  price: number;
  status: "available" | "reserved" | "sold";
  birth_date: string | null;
  breeds: { name: string } | null;
  puppy_media: {
    url: string;
    is_cover: boolean;
  }[] | null;
};

function calculateAgeWeeks(birthDate: string | null): number | null {
  if (!birthDate) return null;

  const diffMs = Date.now() - new Date(birthDate).getTime();

  return Math.max(
    0,
    Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))
  );
}

function mapPuppyRow(p: RawPuppyRow): PuppyRecord {
  const media = p.puppy_media ?? [];
  const cover =
    media.find((m) => m.is_cover)?.url ??
    media[0]?.url ??
    null;

  return {
    id: p.id,
    name: p.name,
    breed: p.breeds?.name ?? "Unknown",
    sex: p.sex,
    ageWeeks: p.birth_date
      ? Math.max(
          0,
          Math.floor(
            (Date.now() - new Date(p.birth_date).getTime()) /
              (1000 * 60 * 60 * 24 * 7)
          )
        )
      : null,
    readyLabel: p.ready_date
      ? "Ready to go home"
      : "Coming soon",
    status: p.status,
    price: Number(p.price),
    coverImage: cover,
    hasVideo: media.some(
      (m) => m.media_type === "video"
    ),
  };
}

function mapToRelatedPuppy(
  p: RelatedRawPuppyRow
): RelatedPuppy {
  const media = p.puppy_media ?? [];

  return {
    id: p.id,
    name: p.name,
    breed: p.breeds?.name ?? "Unknown",
    sex: p.sex,
    ageWeeks: calculateAgeWeeks(p.birth_date),
    price: Number(p.price),
    status: p.status,
    image:
      media.find((m) => m.is_cover)?.url ??
      media[0]?.url ??
      null,
  };
}

const SELECT_FIELDS = `id, name, sex, price, birth_date, ready_date, status,
  breeds!inner ( name ), puppy_media ( url, is_cover, media_type )`;

const RELATED_SELECT_FIELDS = `
  id,
  name,
  sex,
  price,
  birth_date,
  status,
  breeds ( name ),
  puppy_media ( url, is_cover )
`;

export async function getTrendingBreeds(
  limit = 6
): Promise<{ breed: string; count: number }[]> {
  const { data } = await supabase
    .from("puppies")
    .select("breeds ( name )")
    .eq("is_published", true)
    .eq("status", "available");

  const counts = new Map<string, number>();

  (data ?? []).forEach((row) => {
    const breed = (
      row.breeds as unknown as { name: string } | null
    )?.name;

    if (!breed) return;

    counts.set(
      breed,
      (counts.get(breed) ?? 0) + 1
    );
  });

  return Array.from(counts.entries())
    .map(([breed, count]) => ({
      breed,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getRecommendedPuppies(
  viewedBreedNames: string[],
  excludeIds: string[],
  limit = 8
): Promise<PuppyRecord[]> {
  if (viewedBreedNames.length === 0) return [];

  const { data } = await supabase
    .from("puppies")
    .select(SELECT_FIELDS)
    .eq("is_published", true)
    .eq("status", "available")
    .in("breeds.name", viewedBreedNames)
    .limit(limit + excludeIds.length);

  return (data ?? [])
    .filter((p) => !excludeIds.includes(p.id))
    .slice(0, limit)
    .map((p) =>
      mapPuppyRow(p as unknown as RawPuppyRow)
    );
}

// Deterministic "puppies in your price range".
// Uses a real ±20% price range around the current puppy.
export async function getPuppiesInPriceRange(
  currentPrice: number,
  excludeIds: string[],
  limit = 8
): Promise<RelatedPuppy[]> {
  const low = currentPrice * 0.8;
  const high = currentPrice * 1.2;

  const { data } = await supabase
    .from("puppies")
    .select(RELATED_SELECT_FIELDS)
    .eq("is_published", true)
    .eq("status", "available")
    .gte("price", low)
    .lte("price", high)
    .limit(limit + excludeIds.length);

  return (data ?? [])
    .filter((p) => !excludeIds.includes(p.id))
    .slice(0, limit)
    .map((p) =>
      mapToRelatedPuppy(
        p as unknown as RelatedRawPuppyRow
      )
    );
}

// Related breeds via the existing breeds.breed_group column.
export async function getRelatedBreedsByGroup(
  breedGroup: string | null,
  excludeBreedId: string,
  limit = 6
): Promise<
  {
    id: string;
    name: string;
    image_url: string | null;
  }[]
> {
  if (!breedGroup) return [];

  const { data } = await supabase
    .from("breeds")
    .select("id, name, image_url")
    .eq("breed_group", breedGroup)
    .neq("id", excludeBreedId)
    .limit(limit);

  return data ?? [];
}