import { supabase } from "@/lib/supabase/client";

export type Review = {
  id: string;
  customerName: string;
  location: string | null;
  rating: number | null;
  reviewText: string;
};

export async function getReviews(limit: number = 4): Promise<Review[]> {
  const { data } = await supabase
    .from("reviews")
    .select("id, customer_name, location, rating, review_text")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((r) => ({
    id: r.id,
    customerName: r.customer_name,
    location: r.location,
    rating: r.rating,
    reviewText: r.review_text,
  }));
}