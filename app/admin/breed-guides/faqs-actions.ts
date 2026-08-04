"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addGuideFaq(breedGuideId: string, breedSlug: string, question: string, answer: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("breed_guide_faqs")
    .insert({ breed_guide_id: breedGuideId, question, answer });
  if (error) throw new Error(error.message);
  revalidatePath(`/breed-guides/${breedSlug}`);
}

export async function deleteGuideFaq(id: string, breedSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breed_guide_faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/breed-guides/${breedSlug}`);
}