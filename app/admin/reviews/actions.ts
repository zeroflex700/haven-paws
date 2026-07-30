"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ReviewInput = {
  customerName: string;
  location: string;
  rating: number;
  reviewText: string;
  photoUrl: string | null;
  videoUrl: string | null;
  verified: boolean;
  isSpotlight: boolean;
};

export async function createReview(input: ReviewInput) {
  const supabase = await createClient();

  const { error } = await supabase.from("reviews").insert({
    customer_name: input.customerName,
    location: input.location || null,
    rating: input.rating,
    review_text: input.reviewText,
    photo_url: input.photoUrl,
    video_url: input.videoUrl,
    verified: input.verified,
    is_spotlight: input.isSpotlight,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/reviews");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function updateReview(id: string, input: ReviewInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reviews")
    .update({
      customer_name: input.customerName,
      location: input.location || null,
      rating: input.rating,
      review_text: input.reviewText,
      photo_url: input.photoUrl,
      video_url: input.videoUrl,
      verified: input.verified,
      is_spotlight: input.isSpotlight,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/reviews");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/reviews");
  revalidatePath("/admin/reviews");
}