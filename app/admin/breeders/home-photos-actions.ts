"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addHomePhoto(breederId: string, breederSlug: string, imageUrl: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("breeder_home_photos")
    .select("id", { count: "exact", head: true })
    .eq("breeder_id", breederId);

  const { error } = await supabase
    .from("breeder_home_photos")
    .insert({ breeder_id: breederId, image_url: imageUrl, sort_order: count ?? 0 });

  if (error) throw new Error(error.message);
  revalidatePath(`/breeders/${breederSlug}`);
}

export async function deleteHomePhoto(id: string, breederSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_home_photos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/breeders/${breederSlug}`);
}