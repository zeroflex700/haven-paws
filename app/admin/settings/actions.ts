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
    })
    .eq("id", "main");

  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings");
  revalidatePath("/puppies", "layout");
}