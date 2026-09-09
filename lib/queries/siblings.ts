import { supabase } from "@/lib/supabase/client";
import { getOrSetCache } from "@/lib/cache";
import { cacheKeys } from "@/lib/cache-keys";

export type Sibling = {
  id: string;
  name: string;
  sex: "male" | "female";
  status: "available" | "reserved" | "sold";
  image: string | null;
};

const SIBLINGS_TTL_SECONDS = 300;

async function fetchSiblings(
  litterId: string,
  excludeId: string
): Promise<Sibling[]> {
  const { data } = await supabase
    .from("puppies")
    .select(`id, name, sex, status, puppy_media ( url, is_cover )`)
    .eq("litter_id", litterId)
    .eq("is_published", true)
    .neq("id", excludeId);

  const rows = (data ?? []) as unknown as {
    id: string;
    name: string;
    sex: "male" | "female";
    status: "available" | "reserved" | "sold";
    puppy_media: { url: string; is_cover: boolean }[] | null;
  }[];

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    sex: p.sex,
    status: p.status,
    image:
      p.puppy_media?.find((m) => m.is_cover)?.url ??
      p.puppy_media?.[0]?.url ??
      null,
  }));
}

export async function getSiblings(
  litterId: string | null,
  excludeId: string
): Promise<Sibling[]> {
  if (!litterId) return [];

  return getOrSetCache(
    cacheKeys.siblings(litterId, excludeId),
    SIBLINGS_TTL_SECONDS,
    () => fetchSiblings(litterId, excludeId)
  );
}