"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("app_settings")
    .update({
      breeder_name: formData.get("breeder_name") as string,
      years_experience: formData.get("years_experience") as string,
      specialties: formData.get("specialties") as string,
      bio: formData.get("bio") as string,
      badge_text: formData.get("badge_text") as string,
      delivery_fee: Number(formData.get("delivery_fee") || 0),
      starter_kit_price: Number(formData.get("starter_kit_price") || 0),
      health_guarantee_price: Number(formData.get("health_guarantee_price") || 0),
      support_phone: formData.get("support_phone") as string,
      support_hours: formData.get("support_hours") as string,
      tagline: formData.get("tagline") as string,
      promise_text: formData.get("promise_text") as string,
      facebook_url: formData.get("facebook_url") as string,
      instagram_url: formData.get("instagram_url") as string,
      youtube_url: formData.get("youtube_url") as string,
      twitter_url: formData.get("twitter_url") as string,
      breeder_email: formData.get("breeder_email") as string,
      breeder_hours: formData.get("breeder_hours") as string,
    })
    .eq("id", "main");

  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}