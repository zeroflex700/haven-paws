"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

export async function updateBreedNameAndSlug(
  breedId: string,
  oldSlug: string | null,
  formData: FormData
) {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const manualSlug = (formData.get("slug") as string)?.trim();

  if (!name) throw new Error("Breed name cannot be empty");

  const slug = manualSlug ? slugify(manualSlug) : slugify(name);

  const { error } = await supabase
    .from("breeds")
    .update({ name, slug })
    .eq("id", breedId);

  if (error) {
    if (error.code === "23505") {
      throw new Error("That slug is already used by another breed — choose a different one.");
    }
    throw new Error(error.message);
  }

  revalidatePath(`/admin/breeds/${breedId}`);
  revalidatePath("/admin/breeds");
  revalidatePath("/breeds");
  revalidatePath("/breed-guides");
  if (oldSlug) revalidatePath(`/breed-guides/${oldSlug}`);
  if (slug) revalidatePath(`/breed-guides/${slug}`);
  revalidatePath("/puppies", "layout");
}