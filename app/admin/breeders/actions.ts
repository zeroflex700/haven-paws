"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { invalidateBreeder } from "@/lib/cache-invalidate";

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
  // Staged sub-content — only used at creation time (see createBreeder).
  // updateBreeder ignores these; each section is managed on its own on
  // the edit page instead.
  homePhotos?: string[];
  photos?: string[];
  qaItems?: { question: string; answer: string }[];
  moreAboutItems?: { iconKey: string; heading: string; body: string }[];
  healthTestingItems?: { iconKey: string; heading: string; body: string }[];
};

export async function createBreeder(input: BreederInput) {
  const supabase = await createClient();
  const slug = slugify(input.name);

  const { data: inserted, error } = await supabase
    .from("breeders")
    .insert({
      name: input.name,
      slug,
      breed_id: input.breedId,
      photo_url: input.photoUrl,
      meet_breeder_text: input.meetBreederText,
      meet_breeder_image_url: input.meetBreederImageUrl,
      home_gallery_title: input.homeGalleryTitle,
      getting_a_puppy_text: input.gettingAPuppyText,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const breederId = inserted.id as string;

  if (input.homePhotos && input.homePhotos.length > 0) {
    const { error: homePhotosError } = await supabase
      .from("breeder_home_photos")
      .insert(
        input.homePhotos.map((url, i) => ({
          breeder_id: breederId,
          image_url: url,
          sort_order: i,
        }))
      );
    if (homePhotosError) throw new Error(homePhotosError.message);
  }

  if (input.photos && input.photos.length > 0) {
    const { error: photosError } = await supabase
      .from("breeder_photos")
      .insert(
        input.photos.map((url, i) => ({
          breeder_id: breederId,
          image_url: url,
          sort_order: i,
        }))
      );
    if (photosError) throw new Error(photosError.message);
  }

  if (input.qaItems && input.qaItems.length > 0) {
    const validQA = input.qaItems.filter(
      (item) => item.question.trim() && item.answer.trim()
    );

    if (validQA.length > 0) {
      const { error: qaError } = await supabase.from("breeder_qa").insert(
        validQA.map((item) => ({
          breeder_id: breederId,
          question: item.question,
          answer: item.answer,
        }))
      );
      if (qaError) throw new Error(qaError.message);
    }
  }

  if (input.moreAboutItems && input.moreAboutItems.length > 0) {
    const validMoreAbout = input.moreAboutItems.filter(
      (item) => item.heading.trim() && item.body.trim()
    );

    if (validMoreAbout.length > 0) {
      const { error: moreAboutError } = await supabase
        .from("breeder_more_about")
        .insert(
          validMoreAbout.map((item) => ({
            breeder_id: breederId,
            icon_key: item.iconKey,
            heading: item.heading,
            body: item.body,
          }))
        );
      if (moreAboutError) throw new Error(moreAboutError.message);
    }
  }

  if (input.healthTestingItems && input.healthTestingItems.length > 0) {
    const validHealthTesting = input.healthTestingItems.filter(
      (item) => item.heading.trim() && item.body.trim()
    );

    if (validHealthTesting.length > 0) {
      const { error: healthTestingError } = await supabase
        .from("breeder_health_testing")
        .insert(
          validHealthTesting.map((item) => ({
            breeder_id: breederId,
            icon_key: item.iconKey,
            heading: item.heading,
            body: item.body,
          }))
        );
      if (healthTestingError) throw new Error(healthTestingError.message);
    }
  }

  await invalidateBreeder(null, slug);

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

  await invalidateBreeder(id, slug);

  revalidatePath("/admin/breeders");
  revalidatePath(`/breeders/${slug}`);
  redirect("/admin/breeders");
}