"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateParentInfo(
  puppyId: string,
  role: "mom" | "dad",
  data: { name: string; breed: string; weight: string; registration: string }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("puppies")
    .update({
      [`${role}_name`]: data.name,
      [`${role}_breed`]: data.breed,
      [`${role}_weight`]: data.weight,
      [`${role}_registration`]: data.registration,
    })
    .eq("id", puppyId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/puppies/${puppyId}/parents`);
  revalidatePath(`/puppies/${puppyId}`);
}

export async function updateParentPhoto(
  puppyId: string,
  role: "mom" | "dad",
  url: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("puppies")
    .update({ [`${role}_photo_url`]: url })
    .eq("id", puppyId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/puppies/${puppyId}/parents`);
  revalidatePath(`/puppies/${puppyId}`);
}