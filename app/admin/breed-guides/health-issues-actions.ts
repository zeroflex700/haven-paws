"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function addHealthIssue(breedGuideId: string, breedSlug: string, subheading: string, body: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("breed_guide_health_issues")
    .insert({ breed_guide_id: breedGuideId, subheading, body });
  if (error) throw new Error(error.message);
  revalidatePath(`/breed-guides/${breedSlug}`);
}

export async function deleteHealthIssue(id: string, breedSlug: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("breed_guide_health_issues").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/breed-guides/${breedSlug}`);
}