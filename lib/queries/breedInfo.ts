import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export type BreedInfo = {
  id: string;
  name: string;
  slug: string | null;
  guideUrl: string | null;
  temperament: string | null;
  energyLevel: string | null;
  breedGroup: string | null;
  blurb: string | null;
  imageUrl: string | null;
};

function mapBreedInfo(data: {
  id: string;
  name: string;
  slug: string | null;
  temperament: string | null;
  energy_level: string | null;
  breed_group: string | null;
  blurb: string | null;
  image_url: string | null;
}): BreedInfo {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    guideUrl: data.slug ? `/breed-guides/${data.slug}` : null,
    temperament: data.temperament,
    energyLevel: data.energy_level,
    breedGroup: data.breed_group,
    blurb: data.blurb,
    imageUrl: data.image_url,
  };
}

export async function getBreedInfo(
  breedId: string
): Promise<BreedInfo | null> {
  const { data, error } = await supabase
    .from("breeds")
    .select(
      "id, name, slug, temperament, energy_level, breed_group, blurb, image_url"
    )
    .eq("id", breedId)
    .single();

  if (error || !data) return null;

  return mapBreedInfo(data);
}

export async function getBreedInfoAdmin(
  breedId: string
): Promise<BreedInfo | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("breeds")
    .select(
      "id, name, slug, temperament, energy_level, breed_group, blurb, image_url"
    )
    .eq("id", breedId)
    .single();

  if (error || !data) return null;

  return mapBreedInfo(data);
}