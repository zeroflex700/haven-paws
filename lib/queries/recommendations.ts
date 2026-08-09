import { supabase } from "@/lib/supabase/client";
import type { PuppyRecord } from "./puppies";

// Trending = real, computed from currently-published available puppies —
// not fabricated. Groups by breed and returns the breeds with the most
// current listings.
export async function getTrendingBreeds(limit = 6): Promise<{ breed: string; count: number }[]> {
  const { data } = await supabase
    .from("puppies")
    .select("breeds ( name )")
    .eq("is_published", true)
    .eq("status", "available");

  const counts = new Map<string, number>();
  (data ?? []).forEach((row) => {
    const breed = (row.breeds as unknown as { name: string } | null)?.name;
    if (!breed) return;
    counts.set(breed, (counts.get(breed) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([breed, count]) => ({ breed, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Personalized recommendations from recently viewed breeds — pulls
// available puppies of the same breeds the visitor has actually looked at.
export async function getRecommendedPuppies(
  viewedBreedNames: string[],
  excludeIds: string[],
  limit = 8
): Promise<PuppyRecord[]> {
  if (viewedBreedNames.length === 0) return [];

  const { data } = await supabase
    .from("puppies")
    .select(
      `id, name, sex, price, birth_date, ready_date, status,
       breeds!inner ( name ),
       puppy_media ( url, is_cover, media_type )`
    )
    .eq("is_published", true)
    .eq("status", "available")
    .in("breeds.name", viewedBreedNames)
    .limit(limit + excludeIds.length);

  return (data ?? [])
    .filter((p) => !excludeIds.includes(p.id))
    .slice(0, limit)
    .map((p) => {
      const media = (p.puppy_media ?? []) as { url: string; is_cover: boolean; media_type: string }[];
      const cover = media.find((m) => m.is_cover)?.url ?? media[0]?.url ?? null;
      return {
        id: p.id,
        name: p.name,
        breed: (p.breeds as unknown as { name: string }).name,
        sex: p.sex,
        ageWeeks: p.birth_date
          ? Math.max(0, Math.floor((Date.now() - new Date(p.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 7)))
          : null,
        readyLabel: p.ready_date ? "Ready to go home" : "Coming soon",
        status: p.status,
        price: Number(p.price),
        coverImage: cover,
        hasVideo: media.some((m) => m.media_type === "video"),
      } as PuppyRecord;
    });
}