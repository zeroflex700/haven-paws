"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitBreederApplication(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("breeder_applications").insert({
    full_name: `${formData.get("first_name")} ${formData.get("last_name")}`,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    kennel_name: formData.get("kennel_name") as string,
    street_address: formData.get("street_address") as string,
    apt_suite: formData.get("apt_suite") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zip: formData.get("zip") as string,
    country: (formData.get("country") as string) || "United States",
    usda_licensed: formData.get("usda_licensed") === "yes",
    female_dogs_count: formData.get("female_dogs_count")
      ? Number(formData.get("female_dogs_count"))
      : null,
    start_year: formData.get("start_year") as string,
    litters_bred: formData.get("litters_bred") as string,
    breeds: formData.get("breeds") as string,
    purchased_from_haven_paws: formData.get("purchased_from_haven_paws") === "yes",
    agreed_to_terms: formData.get("agreed_to_terms") === "on",
    message: formData.get("message") as string,
  });

  if (error) throw new Error(error.message);

  return { success: true };
}