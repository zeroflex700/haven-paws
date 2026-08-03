"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLocationCard(cityName: string, imageUrl: string | null) {
  const supabase = await createClient();
  const { error } = await supabase.from("location_cards").insert({ city_name: cityName, image_url: imageUrl });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/location-cards");
  redirect("/admin/location-cards");
}

export async function deleteLocationCard(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("location_cards").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/location-cards");
}