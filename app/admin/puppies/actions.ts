"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function revalidateAll(id?: string) {
  revalidatePath("/");
  revalidatePath("/puppies");
  revalidatePath("/admin");
  revalidatePath("/admin/puppies");
  if (id) revalidatePath(`/admin/puppies/${id}`);
}

export async function createPuppy(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("puppies").insert({
    name: formData.get("name") as string,
    breed_id: formData.get("breed_id") as string,
    sex: formData.get("sex") as string,
    price: Number(formData.get("price")),
    deposit_amount: Number(formData.get("deposit_amount") || 0),
    description: formData.get("description") as string,
    status: formData.get("status") as string,
    color: formData.get("color") as string,
    weight_estimate: formData.get("weight_estimate")
      ? Number(formData.get("weight_estimate"))
      : null,
    vet_checked: formData.get("vet_checked") === "on",
    vaccinated: formData.get("vaccinated") === "on",
    is_published: formData.get("is_published") === "on",
  });

  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/puppies");
}

export async function updatePuppy(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("puppies")
    .update({
      name: formData.get("name") as string,
      breed_id: formData.get("breed_id") as string,
      sex: formData.get("sex") as string,
      price: Number(formData.get("price")),
      deposit_amount: Number(formData.get("deposit_amount") || 0),
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      color: formData.get("color") as string,
      weight_estimate: formData.get("weight_estimate")
        ? Number(formData.get("weight_estimate"))
        : null,
      vet_checked: formData.get("vet_checked") === "on",
      vaccinated: formData.get("vaccinated") === "on",
      is_published: formData.get("is_published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidateAll(id);
  redirect("/admin/puppies");
}