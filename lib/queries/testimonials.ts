import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export type Review = {
  id: string;
  customerName: string;
  location: string | null;
  rating: number | null;
  reviewText: string;
  photoUrl: string | null;
  videoUrl: string | null;
  verified: boolean;
  isSpotlight: boolean;
};

type RawReview = {
  id: string;
  customer_name: string;
  location: string | null;
  rating: number | null;
  review_text: string;
  photo_url: string | null;
  video_url: string | null;
  verified: boolean | null;
  is_spotlight: boolean | null;
};

function mapReview(r: RawReview): Review {
  return {
    id: r.id,
    customerName: r.customer_name,
    location: r.location,
    rating: r.rating,
    reviewText: r.review_text,
    photoUrl: r.photo_url,
    videoUrl: r.video_url,
    verified: r.verified ?? true,
    isSpotlight: r.is_spotlight ?? false,
  };
}

const FIELDS =
  "id, customer_name, location, rating, review_text, photo_url, video_url, verified, is_spotlight";

export async function getReviews(limit: number = 4): Promise<Review[]> {
  const { data } = await supabase
    .from("reviews")
    .select(FIELDS)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((r) => mapReview(r as unknown as RawReview));
}

export async function getAllReviews(): Promise<Review[]> {
  const { data } = await supabase
    .from("reviews")
    .select(FIELDS)
    .eq("is_spotlight", false)
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => mapReview(r as unknown as RawReview));
}

export async function getSpotlightReview(): Promise<Review | null> {
  const { data } = await supabase
    .from("reviews")
    .select(FIELDS)
    .eq("is_spotlight", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data ? mapReview(data as unknown as RawReview) : null;
}

export async function getReviewsCount(): Promise<number> {
  const { count } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true });

  return count ?? 0;
}

export async function getReviewStats(): Promise<{ count: number; avgRating: number | null }> {
  const { data } = await supabase.from("reviews").select("rating");
  const rows = data ?? [];
  const rated = rows.filter((r) => r.rating != null);
  if (rated.length === 0) return { count: rows.length, avgRating: null };
  const avg = rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length;
  return { count: rows.length, avgRating: Math.round(avg * 10) / 10 };
}

export async function getAllReviewsAdmin(): Promise<Review[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select(FIELDS)
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => mapReview(r as unknown as RawReview));
}

export async function getReviewAdmin(id: string): Promise<Review | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("reviews").select(FIELDS).eq("id", id).single();
  return data ? mapReview(data as unknown as RawReview) : null;
}
export async function getPuppyTrainingTestimonial(): Promise<Review | null> {
  const { data } = await supabase
    .from("reviews")
    .select(FIELDS)
    .eq("category", "puppy_training")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data ? mapReview(data as unknown as RawReview) : null;
}