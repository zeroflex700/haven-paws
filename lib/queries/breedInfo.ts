import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export type BreedInfo = {
  id: string;
  name: string;
  temperament: string | null;
  energyLevel: string | null;
  breedGroup: string | null;
  blurb: string | null;
  imageUrl: string | null;
};

export async function getBreedInfo(breedId: string): Promise<BreedInfo | null> {
  const { data } = await supabase
    .from("breeds")
    .select("id, name, temperament, energy_level, breed_group, blurb, image_url")
    .eq("id", breedId)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    temperament: data.temperament,
    energyLevel: data.energy_level,
    breedGroup: data.breed_group,
    blurb: data.blurb,
    imageUrl: data.image_url,
  };
}

export async function getBreedInfoAdmin(breedId: string): Promise<BreedInfo | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("breeds")
    .select("id, name, temperament, energy_level, breed_group, blurb, image_url")
    .eq("id", breedId)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    temperament: data.temperament,
    energyLevel: data.energy_level,
    breedGroup: data.breed_group,
    blurb: data.blurb,
    imageUrl: data.image_url,
  };
}