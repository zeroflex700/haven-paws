import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export type PageContentImages = {
  heroImage: string | null;
  heroVideo: string | null;
  extraImages: Record<string, string>;
  extraVideos: Record<string, string>;
  extraText: Record<string, string>;
};

async function mapPageContent(row: {
  hero_image_url: string | null;
  hero_video_url: string | null;
  extra_images: Record<string, string> | null;
  extra_videos: Record<string, string> | null;
  extra_text: Record<string, string> | null;
} | null): Promise<PageContentImages> {
  return {
    heroImage: row?.hero_image_url ?? null,
    heroVideo: row?.hero_video_url ?? null,
    extraImages: row?.extra_images ?? {},
    extraVideos: row?.extra_videos ?? {},
    extraText: row?.extra_text ?? {},
  };
}

export async function getPageImages(slug: string): Promise<PageContentImages> {
  const { data } = await supabase
    .from("page_content")
    .select("hero_image_url, hero_video_url, extra_images, extra_videos, extra_text")
    .eq("slug", slug)
    .single();

  return mapPageContent(data);
}

export async function getPageImagesAdmin(slug: string): Promise<PageContentImages> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content")
    .select("hero_image_url, hero_video_url, extra_images, extra_videos, extra_text")
    .eq("slug", slug)
    .single();

  return mapPageContent(data);
}