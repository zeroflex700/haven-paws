import { supabase } from "@/lib/supabase/client";
import { cldOptimized } from "@/lib/cloudinary";

export type RelatedPuppy = {
  id: string;
  name: string;
  breed: string;
  price: number;
  status: "available" | "reserved" | "sold";
  image: string | null;
};

export async function getRelatedPuppies(
  breedId: string,
  excludeId: string
): Promise<RelatedPuppy[]> {
  const { data } = await supabase
    .from("puppies")
    .select(
      `id, name, price, status, breeds ( name ), puppy_media ( url, is_cover )`
    )
    .eq("breed_id", breedId)
    .eq("is_published", true)
    .neq("id", excludeId)
    .limit(4);

  const rows = (data ?? []) as unknown as {
    id: string;
    name: string;
    price: number;
    status: "available" | "reserved" | "sold";
    breeds: { name: string } | null;
    puppy_media: { url: string; is_cover: boolean }[] | null;
  }[];

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    breed: p.breeds?.name ?? "Unknown",
    price: Number(p.price),
    status: p.status,
    image:
      p.puppy_media?.find((m) => m.is_cover)?.url ??
      p.puppy_media?.[0]?.url ??
      null,
  }));
}

export { cldOptimized };