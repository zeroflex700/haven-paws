import { supabase } from "@/lib/supabase/client";

export async function getBreedImageMap(): Promise<Record<string, string>> {
  const { data } = await supabase.from("breeds").select("name, image_url");

  const map: Record<string, string> = {};
  (data ?? []).forEach((b) => {
    if (b.image_url) map[b.name] = b.image_url;
  });
  return map;
}