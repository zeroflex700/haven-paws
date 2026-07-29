import { supabase } from "@/lib/supabase/client";

export type PuppyDetail = {
  id: string;
  name: string;
  breed: string;
  sex: "male" | "female";
  price: number;
  status: "available" | "reserved" | "sold";
  description: string | null;
  color: string | null;
  weightEstimate: number | null;
  vetChecked: boolean;
  vaccinated: boolean;
  media: { url: string; mediaType: "image" | "video"; isCover: boolean }[];
};

export async function getPuppyDetail(id: string): Promise<PuppyDetail | null> {
  const { data, error } = await supabase
    .from("puppies")
    .select(
      `id, name, sex, price, status, description, color, weight_estimate,
       vet_checked, vaccinated,
       breeds ( name ),
       puppy_media ( url, media_type, is_cover, sort_order )`
    )
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;

  const raw = data as unknown as {
    id: string;
    name: string;
    sex: "male" | "female";
    price: number;
    status: "available" | "reserved" | "sold";
    description: string | null;
    color: string | null;
    weight_estimate: number | null;
    vet_checked: boolean;
    vaccinated: boolean;
    breeds: { name: string } | null;
    puppy_media: { url: string; media_type: "image" | "video"; is_cover: boolean; sort_order: number }[] | null;
  };

  return {
    id: raw.id,
    name: raw.name,
    breed: raw.breeds?.name ?? "Unknown",
    sex: raw.sex,
    price: Number(raw.price),
    status: raw.status,
    description: raw.description,
    color: raw.color,
    weightEstimate: raw.weight_estimate,
    vetChecked: raw.vet_checked,
    vaccinated: raw.vaccinated,
    media: (raw.puppy_media ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((m) => ({ url: m.url, mediaType: m.media_type, isCover: m.is_cover })),
  };
}