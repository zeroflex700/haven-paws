import { createClient } from "@/lib/supabase/server";
import type { IncludedItemKey } from "@/lib/includedItems";

export type LitterAutofillData = {
  breed_id: string | null;
  price: number | null;
  deposit_amount: number | null;
  age_weeks: number | null;
  size: string | null;
  status: string | null;
  vet_checked: boolean;
  vaccinated: boolean;
  is_published: boolean;
  included_items: IncludedItemKey[];
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
};

export async function getLitterAutofillMap(): Promise<
  Record<string, LitterAutofillData>
> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("puppies")
    .select(
      `litter_id, breed_id, price, deposit_amount, age_weeks, size, status,
       vet_checked, vaccinated, is_published, included_items,
       mom_name, mom_breed, mom_weight, mom_registration, mom_photo_url,
       dad_name, dad_breed, dad_weight, dad_registration, dad_photo_url,
       created_at`
    )
    .not("litter_id", "is", null)
    .order("created_at", { ascending: true });

  const map: Record<string, LitterAutofillData> = {};

  for (const row of data ?? []) {
    const litterId = row.litter_id as string;

    // First (oldest) puppy entered for this litter is the source of truth.
    if (map[litterId]) continue;

    map[litterId] = {
      breed_id: row.breed_id,
      price: row.price,
      deposit_amount: row.deposit_amount,
      age_weeks: row.age_weeks,
      size: row.size,
      status: row.status,
      vet_checked: row.vet_checked,
      vaccinated: row.vaccinated,
      is_published: row.is_published,
      included_items: (row.included_items ?? []) as IncludedItemKey[],
      mom_name: row.mom_name,
      mom_breed: row.mom_breed,
      mom_weight: row.mom_weight,
      mom_registration: row.mom_registration,
      mom_photo_url: row.mom_photo_url,
      dad_name: row.dad_name,
      dad_breed: row.dad_breed,
      dad_weight: row.dad_weight,
      dad_registration: row.dad_registration,
      dad_photo_url: row.dad_photo_url,
    };
  }

  return map;
}