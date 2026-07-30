import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export type PageContentImages = {
  heroImage: string | null;
  extraImages: Record<string, string>;
};

export async function getPageImages(slug: string): Promise<PageContentImages> {
  const { data } = await supabase
    .from("page_content")
    .select("hero_image_url, extra_images")
    .eq("slug", slug)
    .single();

  return {
    heroImage: data?.hero_image_url ?? null,
    extraImages: (data?.extra_images as Record<string, string>) ?? {},
  };
}

export async function getPageImagesAdmin(slug: string): Promise<PageContentImages> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content")
    .select("hero_image_url, extra_images")
    .eq("slug", slug)
    .single();

  return {
    heroImage: data?.hero_image_url ?? null,
    extraImages: (data?.extra_images as Record<string, string>) ?? {},
  };
}