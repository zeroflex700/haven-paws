import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export async function getPageHeroImage(slug: string): Promise<string | null> {
  const { data } = await supabase
    .from("page_content")
    .select("hero_image_url")
    .eq("slug", slug)
    .single();

  return data?.hero_image_url ?? null;
}

export async function getPageHeroImageAdmin(slug: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content")
    .select("hero_image_url")
    .eq("slug", slug)
    .single();

  return data?.hero_image_url ?? null;
}