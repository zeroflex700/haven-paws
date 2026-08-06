"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type BreederInput = {
  name: string;
  breedId: string | null;
  photoUrl: string | null;
  meetBreederText: string;
  meetBreederImageUrl: string | null;
  homeGalleryTitle: string;
  gettingAPuppyText: string;
};

export async function createBreeder(input: BreederInput) {
  const supabase = await createClient();
  const slug = slugify(input.name);

  const { error } = await supabase.from("breeders").insert({
    name: input.name,
    slug,
    breed_id: input.breedId,
    photo_url: input.photoUrl,
    meet_breeder_text: input.meetBreederText,
    meet_breeder_image_url: input.meetBreederImageUrl,
    home_gallery_title: input.homeGalleryTitle,
    getting_a_puppy_text: input.gettingAPuppyText,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/breeders");
  revalidatePath(`/breeders/${slug}`);
  redirect("/admin/breeders");
}

export async function updateBreeder(id: string, slug: string, input: BreederInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("breeders")
    .update({
      name: input.name,
      breed_id: input.breedId,
      photo_url: input.photoUrl,
      meet_breeder_text: input.meetBreederText,
      meet_breeder_image_url: input.meetBreederImageUrl,
      home_gallery_title: input.homeGalleryTitle,
      getting_a_puppy_text: input.gettingAPuppyText,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/breeders");
  revalidatePath(`/breeders/${slug}`);
  redirect("/admin/breeders");
}