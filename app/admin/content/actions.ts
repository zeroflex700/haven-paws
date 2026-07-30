"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePageHeroImage(slug: string, url: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("page_content")
    .upsert({ slug, hero_image_url: url });

  if (error) throw new Error(error.message);

  revalidatePath(`/${slug}`);
  revalidatePath(`/admin/content/${slug}`);
}