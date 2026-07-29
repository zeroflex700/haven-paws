import { supabase } from "@/lib/supabase/client";

export type RelatedPuppy = {
  id: string;
  name: string;
  breed: string;
  sex: "male" | "female";
  ageWeeks: number | null;
  price: number;
  status: "available" | "reserved" | "sold";
  image: string | null;
};

function calcAgeWeeks(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const diffMs = Date.now() - new Date(birthDate).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)));
}

export async function getRelatedPuppies(
  breedId: string,
  excludeId: string
): Promise<RelatedPuppy[]> {
  const { data } = await supabase
    .from("puppies")
    .select(
      `id, name, sex, price, status, birth_date, breeds ( name ), puppy_media ( url, is_cover )`
    )
    .eq("breed_id", breedId)
    .eq("is_published", true)
    .neq("id", excludeId)
    .limit(6);

  const rows = (data ?? []) as unknown as {
    id: string;
    name: string;
    sex: "male" | "female";
    price: number;
    status: "available" | "reserved" | "sold";
    birth_date: string | null;
    breeds: { name: string } | null;
    puppy_media: { url: string; is_cover: boolean }[] | null;
  }[];

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    breed: p.breeds?.name ?? "Unknown",
    sex: p.sex,
    ageWeeks: calcAgeWeeks(p.birth_date),
    price: Number(p.price),
    status: p.status,
    image:
      p.puppy_media?.find((m) => m.is_cover)?.url ??
      p.puppy_media?.[0]?.url ??
      null,
  }));
}