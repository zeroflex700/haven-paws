import { createClient } from "@/lib/supabase/server";

export type MediaItem = {
  id: string;
  media_type: "image" | "video";
  url: string;
  sort_order: number;
  is_cover: boolean;
};

export async function getPuppyMedia(puppyId: string): Promise<MediaItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("puppy_media")
    .select("id, media_type, url, sort_order, is_cover")
    .eq("puppy_id", puppyId)
    .order("sort_order");

  return data ?? [];
}