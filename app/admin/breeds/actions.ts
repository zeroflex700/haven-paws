"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBreedInfo(breedId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("breeds")
    .update({
      temperament: formData.get("temperament") as string,
      energy_level: formData.get("energy_level") as string,
      breed_group: formData.get("breed_group") as string,
      blurb: formData.get("blurb") as string,
    })
    .eq("id", breedId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/breeds/${breedId}`);
  revalidatePath("/puppies", "layout");
}

export async function updateBreedImage(breedId: string, url: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("breeds")
    .update({ image_url: url })
    .eq("id", breedId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/breeds/${breedId}`);
  revalidatePath("/puppies", "layout");
}