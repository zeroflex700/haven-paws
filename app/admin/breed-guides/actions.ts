"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type BreedGuideInput = {
  heroImageUrl: string | null;
  photoCredit: string;
  authorName: string;
  authorCredential: string;
  authorPhotoUrl: string | null;
  authorBio: string;
  overviewQuote: string;
  overviewSupport: string;
  whyPeopleLove: string;
  appearanceText: string;
  appearanceImageUrl: string | null;
  appearanceCredit: string;
  groomingText: string;
  groomingImageUrl: string | null;
  groomingCredit: string;
  temperamentText: string;
  exerciseText: string;
  exerciseImageUrl: string | null;
  exerciseCredit: string;
  trainingText: string;
  dietText: string;
  healthIntroText: string;
  historyText: string;
  historyImageUrl: string | null;
  historyImage2Url: string | null;
  historyCredit: string;
  scorecard: Record<string, string>;
  relatedBreedIds: string[];
};

export async function upsertBreedGuide(breedId: string, breedSlug: string, input: BreedGuideInput) {
  const supabase = await createClient();

  const { error } = await supabase.from("breed_guides").upsert(
    {
      breed_id: breedId,
      hero_image_url: input.heroImageUrl,
      photo_credit: input.photoCredit,
      author_name: input.authorName,
      author_credential: input.authorCredential,
      author_photo_url: input.authorPhotoUrl,
      author_bio: input.authorBio,
      overview_quote: input.overviewQuote,
      overview_support: input.overviewSupport,
      why_people_love: input.whyPeopleLove,
      appearance_text: input.appearanceText,
      appearance_image_url: input.appearanceImageUrl,
      appearance_credit: input.appearanceCredit,
      grooming_text: input.groomingText,
      grooming_image_url: input.groomingImageUrl,
      grooming_credit: input.groomingCredit,
      temperament_text: input.temperamentText,
      exercise_text: input.exerciseText,
      exercise_image_url: input.exerciseImageUrl,
      exercise_credit: input.exerciseCredit,
      training_text: input.trainingText,
      diet_text: input.dietText,
      health_intro_text: input.healthIntroText,
      history_text: input.historyText,
      history_image_url: input.historyImageUrl,
      history_image2_url: input.historyImage2Url,
      history_credit: input.historyCredit,
      scorecard: input.scorecard,
      related_breed_ids: input.relatedBreedIds,
    },
    { onConflict: "breed_id" }
  );

  if (error) throw new Error(error.message);

  revalidatePath(`/breed-guides/${breedSlug}`);
  revalidatePath("/breed-guides");
  revalidatePath(`/admin/breed-guides/${breedId}`);
}