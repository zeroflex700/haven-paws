"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function getString(formData: FormData, name: string): string | null {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function getNumber(formData: FormData, name: string): number | null {
  const value = getString(formData, name);

  if (value === null) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function getCheckbox(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

function getIncludedItems(formData: FormData): string[] {
  return formData
    .getAll("included_items")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

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

function buildPuppyPayload(formData: FormData) {
  const breedId = getString(formData, "breed_id");

  if (!breedId) {
    throw new Error("A breed is required.");
  }

  const sex = getString(formData, "sex");

  if (!sex) {
    throw new Error("Please select the puppy's gender.");
  }

  return {
    name: getString(formData, "name") ?? "",
    breed_id: breedId,
    breeder_id: getString(formData, "breeder_id"),

    sex,

    price: getNumber(formData, "price") ?? 0,
    deposit_amount: getNumber(formData, "deposit_amount") ?? 0,

    description: getString(formData, "description"),
    status: getString(formData, "status") ?? "available",
    color: getString(formData, "color"),

    weight_estimate: getNumber(formData, "weight_estimate"),
    age_weeks: getNumber(formData, "age_weeks"),

    markings: getString(formData, "markings"),
    size: getString(formData, "size"),
    generation: getString(formData, "generation"),

    litter_id: getString(formData, "litter_id"),
    ready_date: getString(formData, "ready_date"),

    included_items: getIncludedItems(formData),

    vet_checked: getCheckbox(formData, "vet_checked"),
    vaccinated: getCheckbox(formData, "vaccinated"),
    is_published: getCheckbox(formData, "is_published"),

    mom_name: getString(formData, "mom_name"),
    mom_breed: getString(formData, "mom_breed"),
    mom_weight: getString(formData, "mom_weight"),
    mom_registration: getString(formData, "mom_registration"),
    mom_photo_url: getString(formData, "mom_photo_url"),

    dad_name: getString(formData, "dad_name"),
    dad_breed: getString(formData, "dad_breed"),
    dad_weight: getString(formData, "dad_weight"),
    dad_registration: getString(formData, "dad_registration"),
    dad_photo_url: getString(formData, "dad_photo_url"),
  };
}

export async function createPuppy(formData: FormData) {
  const supabase = await createClient();

  const payload = buildPuppyPayload(formData);

  await validateBreederForBreed(
    supabase,
    payload.breeder_id,
    payload.breed_id
  );

  const { error } = await supabase
    .from("puppies")
    .insert(payload);

  if (error) {
    console.error("CREATE PUPPY ERROR:", error);

    throw new Error(
      `Could not save puppy: ${error.message}`
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/puppies");
  revalidatePath("/puppies");

  redirect("/admin/puppies");
}

export async function updatePuppy(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();

  const payload = buildPuppyPayload(formData);

  await validateBreederForBreed(
    supabase,
    payload.breeder_id,
    payload.breed_id
  );

  const { error } = await supabase
    .from("puppies")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("UPDATE PUPPY ERROR:", error);

    throw new Error(
      `Could not update puppy: ${error.message}`
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/puppies");
  revalidatePath(`/admin/puppies/${id}`);
  revalidatePath(`/puppies/${id}`);
  revalidatePath("/puppies");

  redirect("/admin/puppies");
}