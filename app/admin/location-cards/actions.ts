"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { invalidateHomepageCollections } from "@/lib/cache-invalidate";

export async function createLocationCard(cityName: string, imageUrl: string | null) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("location_cards").insert({ city_name: cityName, image_url: imageUrl });
  if (error) throw new Error(error.message);
  await invalidateHomepageCollections();
  revalidatePath("/");
  revalidatePath("/admin/location-cards");
  redirect("/admin/location-cards");
}

export async function deleteLocationCard(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("location_cards").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await invalidateHomepageCollections();
  revalidatePath("/");
  revalidatePath("/admin/location-cards");
}