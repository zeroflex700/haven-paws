"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createVideoStory(
  personName: string,
  description: string,
  thumbnailUrl: string | null,
  videoUrl: string | null
) {
  const supabase = await createClient();
  const { error } = await supabase.from("video_stories").insert({
    person_name: personName,
    description,
    thumbnail_url: thumbnailUrl,
    video_url: videoUrl,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/video-stories");
  redirect("/admin/video-stories");
}

export async function deleteVideoStory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("video_stories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/video-stories");
}