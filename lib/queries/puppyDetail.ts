import { supabase } from "@/lib/supabase/client";

export type ParentInfo = {
  name: string | null;
  breed: string | null;
  weight: string | null;
  registration: string | null;
  photoUrl: string | null;
};

export type PuppyDetail = {
  id: string;
  name: string;
  breed: string;
  breedId: string;
  litterId: string | null;
  sex: "male" | "female";
  price: number;
  depositAmount: number;
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
  mom: ParentInfo;
  dad: ParentInfo;
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
      `id, name, sex, price, deposit_amount, status, description, color, weight_estimate,
       vet_checked, vaccinated, microchip_id, birth_date, breed_id, litter_id,
       mom_name, mom_breed, mom_weight, mom_registration, mom_photo_url,
       dad_name, dad_breed, dad_weight, dad_registration, dad_photo_url,
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
    deposit_amount: number | null;
    status: "available" | "reserved" | "sold";
    description: string | null;
    color: string | null;
    weight_estimate: number | null;
    vet_checked: boolean;
    vaccinated: boolean;
    microchip_id: string | null;
    birth_date: string | null;
    breed_id: string;
    litter_id: string | null;
    mom_name: string | null;
    mom_breed: string | null;
    mom_weight: string | null;
    mom_registration: string | null;
    mom_photo_url: string | null;
    dad_name: string | null;
    dad_breed: string | null;
    dad_weight: string | null;
    dad_registration: string | null;
    dad_photo_url: string | null;
    breeds: { name: string } | null;
    puppy_media: { url: string; media_type: "image" | "video"; is_cover: boolean; sort_order: number }[] | null;
  };

  return {
    id: raw.id,
    name: raw.name,
    breed: raw.breeds?.name ?? "Unknown",
    breedId: raw.breed_id,
    litterId: raw.litter_id,
    sex: raw.sex,
    price: Number(raw.price),
    depositAmount: Number(raw.deposit_amount ?? 0),
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
    mom: {
      name: raw.mom_name,
      breed: raw.mom_breed,
      weight: raw.mom_weight,
      registration: raw.mom_registration,
      photoUrl: raw.mom_photo_url,
    },
    dad: {
      name: raw.dad_name,
      breed: raw.dad_breed,
      weight: raw.dad_weight,
      registration: raw.dad_registration,
      photoUrl: raw.dad_photo_url,
    },
  };
}