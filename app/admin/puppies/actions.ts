"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function validateBreederForBreed(
  supabase: Awaited<ReturnType<typeof createClient>>,
  breederId: string | null,
  breedId: string
) {
  if (!breederId) return;

  const { data: breeder, error } = await supabase
    .from("breeders")
    .select("id, breed_id")
    .eq("id", breederId)
    .single();

  if (error || !breeder) {
    throw new Error("Selected breeder was not found.");
  }

  if (breeder.breed_id !== breedId) {
    throw new Error(
      "The selected breeder does not belong to the selected breed."
    );
  }
}

async function getSiblingParentFields(
  supabase: Awaited<ReturnType<typeof createClient>>,
  litterId: string | null
) {
  if (!litterId) return {};

  const { data: sibling } = await supabase
    .from("puppies")
    .select(
      `mom_name, mom_breed, mom_weight, mom_registration, mom_photo_url,
       dad_name, dad_breed, dad_weight, dad_registration, dad_photo_url`
    )
    .eq("litter_id", litterId)
    .limit(1)
    .maybeSingle();

  return sibling ?? {};
}

export async function createPuppy(formData: FormData) {
  const supabase = await createClient();

  const breedId = formData.get("breed_id") as string;
  const breederId =
    (formData.get("breeder_id") as string) || null;
  const litterId = (formData.get("litter_id") as string) || null;

  if (!breedId) {
    throw new Error("A breed is required.");
  }

  await validateBreederForBreed(
    supabase,
    breederId,
    breedId
  );

  // If this litter already has a puppy, inherit its parent info and
  // photos automatically — no need to visit "Manage Parents" for
  // every sibling.
  const parentFields = await getSiblingParentFields(
    supabase,
    litterId
  );

  const { error } = await supabase.from("puppies").insert({
    name: formData.get("name") as string,
    breed_id: breedId,
    breeder_id: breederId,
    sex: formData.get("sex") as string,
    price: Number(formData.get("price")),
    deposit_amount: Number(formData.get("deposit_amount") || 0),
    description: formData.get("description") as string,
    status: formData.get("status") as string,
    color: formData.get("color") as string,
    weight_estimate: formData.get("weight_estimate")
      ? Number(formData.get("weight_estimate"))
      : null,
    markings: (formData.get("markings") as string) || null,
    size: (formData.get("size") as string) || null,
    generation: (formData.get("generation") as string) || null,
    age_weeks: formData.get("age_weeks")
      ? Number(formData.get("age_weeks"))
      : null,
    litter_id: litterId,
    ready_date: (formData.get("ready_date") as string) || null,
    included_items: formData.getAll("included_items"),
    vet_checked: formData.get("vet_checked") === "on",
    vaccinated: formData.get("vaccinated") === "on",
    is_published: formData.get("is_published") === "on",
    ...parentFields,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/puppies");

  redirect("/admin/puppies");
}

export async function updatePuppy(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();

  const breedId = formData.get("breed_id") as string;
  const breederId =
    (formData.get("breeder_id") as string) || null;

  if (!breedId) {
    throw new Error("A breed is required.");
  }

  await validateBreederForBreed(
    supabase,
    breederId,
    breedId
  );

  const { error } = await supabase
    .from("puppies")
    .update({
      name: formData.get("name") as string,
      breed_id: breedId,
      breeder_id: breederId,
      sex: formData.get("sex") as string,
      price: Number(formData.get("price")),
      deposit_amount: Number(
        formData.get("deposit_amount") || 0
      ),
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      color: formData.get("color") as string,
      weight_estimate: formData.get("weight_estimate")
        ? Number(formData.get("weight_estimate"))
        : null,
      markings: (formData.get("markings") as string) || null,
      size: (formData.get("size") as string) || null,
      generation: (formData.get("generation") as string) || null,
      age_weeks: formData.get("age_weeks")
        ? Number(formData.get("age_weeks"))
        : null,
      litter_id:
        (formData.get("litter_id") as string) || null,
      ready_date:
        (formData.get("ready_date") as string) || null,
      included_items: formData.getAll("included_items"),
      vet_checked: formData.get("vet_checked") === "on",
      vaccinated: formData.get("vaccinated") === "on",
      is_published: formData.get("is_published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/puppies");
  revalidatePath(`/admin/puppies/${id}`);
  revalidatePath(`/puppies/${id}`);

  redirect("/admin/puppies");
}