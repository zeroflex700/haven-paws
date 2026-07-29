"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitInquiry(puppyId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("inquiries").insert({
    puppy_id: puppyId,
    customer_name: formData.get("name") as string,
    customer_email: formData.get("email") as string,
    customer_phone: formData.get("phone") as string,
    message: formData.get("message") as string,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/inquiries");
  return { success: true };
}