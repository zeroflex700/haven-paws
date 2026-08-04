import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export type BreedGuide = {
  id: string;
  breedId: string;
  breedName: string;
  breedSlug: string;
  heroImageUrl: string | null;
  photoCredit: string | null;
  authorName: string | null;
  authorCredential: string | null;
  authorPhotoUrl: string | null;
  authorBio: string | null;
  overviewQuote: string | null;
  overviewSupport: string | null;
  whyPeopleLove: string | null;
  appearanceText: string | null;
  appearanceImageUrl: string | null;
  appearanceCredit: string | null;
  groomingText: string | null;
  groomingImageUrl: string | null;
  groomingCredit: string | null;
  temperamentText: string | null;
  exerciseText: string | null;
  exerciseImageUrl: string | null;
  exerciseCredit: string | null;
  trainingText: string | null;
  dietText: string | null;
  healthIntroText: string | null;
  historyText: string | null;
  historyImageUrl: string | null;
  historyImage2Url: string | null;
  historyCredit: string | null;
  scorecard: Record<string, string>;
  relatedBreedIds: string[];
};

function mapGuide(row: Record<string, unknown>, breedName: string, breedSlug: string): BreedGuide {
  return {
    id: row.id as string,
    breedId: row.breed_id as string,
    breedName,
    breedSlug,
    heroImageUrl: row.hero_image_url as string | null,
    photoCredit: row.photo_credit as string | null,
    authorName: row.author_name as string | null,
    authorCredential: row.author_credential as string | null,
    authorPhotoUrl: row.author_photo_url as string | null,
    authorBio: row.author_bio as string | null,
    overviewQuote: row.overview_quote as string | null,
    overviewSupport: row.overview_support as string | null,
    whyPeopleLove: row.why_people_love as string | null,
    appearanceText: row.appearance_text as string | null,
    appearanceImageUrl: row.appearance_image_url as string | null,
    appearanceCredit: row.appearance_credit as string | null,
    groomingText: row.grooming_text as string | null,
    groomingImageUrl: row.grooming_image_url as string | null,
    groomingCredit: row.grooming_credit as string | null,
    temperamentText: row.temperament_text as string | null,
    exerciseText: row.exercise_text as string | null,
    exerciseImageUrl: row.exercise_image_url as string | null,
    exerciseCredit: row.exercise_credit as string | null,
    trainingText: row.training_text as string | null,
    dietText: row.diet_text as string | null,
    healthIntroText: row.health_intro_text as string | null,
    historyText: row.history_text as string | null,
    historyImageUrl: row.history_image_url as string | null,
    historyImage2Url: row.history_image2_url as string | null,
    historyCredit: row.history_credit as string | null,
    scorecard: (row.scorecard as Record<string, string>) ?? {},
    relatedBreedIds: (row.related_breed_ids as string[]) ?? [],
  };
}

export async function getAllGuidedBreeds(): Promise<{ id: string; name: string; slug: string; imageUrl: string | null }[]> {
  const { data } = await supabase
    .from("breed_guides")
    .select("breed_id, breeds ( id, name, slug, image_url )");

  return (data ?? [])
    .map((r) => r.breeds as unknown as { id: string; name: string; slug: string; image_url: string | null })
    .filter(Boolean)
    .map((b) => ({ id: b.id, name: b.name, slug: b.slug, imageUrl: b.image_url }));
}

export async function getBreedGuideBySlug(slug: string): Promise<BreedGuide | null> {
  const { data: breed } = await supabase.from("breeds").select("id, name, slug").eq("slug", slug).single();
  if (!breed) return null;

  const { data: guide } = await supabase.from("breed_guides").select("*").eq("breed_id", breed.id).single();
  if (!guide) return null;

  return mapGuide(guide, breed.name, breed.slug);
}

export async function getBreedGuideAdmin(breedId: string): Promise<BreedGuide | null> {
  const supabase = await createClient();
  const { data: breed } = await supabase.from("breeds").select("id, name, slug").eq("id", breedId).single();
  if (!breed) return null;

  const { data: guide } = await supabase.from("breed_guides").select("*").eq("breed_id", breedId).single();
  if (!guide) return mapGuide({ id: "", breed_id: breedId, scorecard: {}, related_breed_ids: [] }, breed.name, breed.slug ?? "");

  return mapGuide(guide, breed.name, breed.slug ?? "");
}

export async function getBreedLiveStats(breedId: string): Promise<{ count: number; avgPrice: number | null }> {
  const { data } = await supabase
    .from("puppies")
    .select("price")
    .eq("breed_id", breedId)
    .eq("is_published", true)
    .eq("status", "available");

  const rows = data ?? [];
  if (rows.length === 0) return { count: 0, avgPrice: null };
  const avg = rows.reduce((sum, r) => sum + Number(r.price), 0) / rows.length;
  return { count: rows.length, avgPrice: Math.round(avg) };
}

export async function getHealthIssues(breedGuideId: string) {
  const { data } = await supabase
    .from("breed_guide_health_issues")
    .select("id, subheading, body")
    .eq("breed_guide_id", breedGuideId)
    .order("sort_order");
  return data ?? [];
}

export async function getGuideFaqs(breedGuideId: string) {
  const { data } = await supabase
    .from("breed_guide_faqs")
    .select("id, question, answer")
    .eq("breed_guide_id", breedGuideId)
    .order("sort_order");
  return data ?? [];
}

export async function getRelatedBreeds(breedIds: string[]) {
  if (breedIds.length === 0) return [];
  const { data } = await supabase.from("breeds").select("id, name, slug, image_url").in("id", breedIds);
  return data ?? [];
}