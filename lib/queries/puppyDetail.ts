import { supabase } from "@/lib/supabase/client";

export type PuppyDetail = {
  id: string;
  name: string;
  breed: string;
  breedId: string;
  sex: "male" | "female";
  price: number;
  status: "available" | "reserved" | "sold";
  description: string | null;
  color: string | null;
  weightEstimate: number | null;
  vetChecked: boolean;
  vaccinated: boolean;
  microchipId: string | null;
  birthDate: string | null;
  ageWeeks: number | null;
  media: { url: string; mediaType: "image" | "video"; isCover: boolean }[];
};

function calcAgeWeeks(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const diffMs = Date.now() - new Date(birthDate).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)));
}

export async function getPuppyDetail(id: string): Promise<PuppyDetail | null> {
  const { data, error } = await supabase
    .from("puppies")
    .select(
      `id, name, sex, price, status, description, color, weight_estimate,
       vet_checked, vaccinated, microchip_id, birth_date, breed_id,
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
    microchip_id: string | null;
    birth_date: string | null;
    breed_id: string;
    breeds: { name: string } | null;
    puppy_media: { url: string; media_type: "image" | "video"; is_cover: boolean; sort_order: number }[] | null;
  };

  return {
    id: raw.id,
    name: raw.name,
    breed: raw.breeds?.name ?? "Unknown",
    breedId: raw.breed_id,
    sex: raw.sex,
    price: Number(raw.price),
    status: raw.status,
    description: raw.description,
    color: raw.color,
    weightEstimate: raw.weight_estimate,
    vetChecked: raw.vet_checked,
    vaccinated: raw.vaccinated,
    microchipId: raw.microchip_id,
    birthDate: raw.birth_date,
    ageWeeks: calcAgeWeeks(raw.birth_date),
    media: (raw.puppy_media ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((m) => ({ url: m.url, mediaType: m.media_type, isCover: m.is_cover })),
  };
}