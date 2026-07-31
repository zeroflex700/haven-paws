"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitBreederApplication(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("breeder_applications").insert({
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    location: formData.get("location") as string,
    breeds: formData.get("breeds") as string,
    years_breeding: formData.get("years_breeding") as string,
    message: formData.get("message") as string,
  });

  if (error) throw new Error(error.message);

  return { success: true };
}