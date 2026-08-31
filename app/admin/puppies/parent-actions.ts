"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getLitterSiblingIds(
  supabase: Awaited<ReturnType<typeof createClient>>,
  puppyId: string
): Promise<string[]> {
  const { data: puppy, error: puppyError } = await supabase
    .from("puppies")
    .select("litter_id")
    .eq("id", puppyId)
    .single();

  if (puppyError) {
    throw new Error(puppyError.message);
  }

  const litterId = puppy?.litter_id as string | null;

  if (!litterId) {
    return [puppyId];
  }

  const { data: siblings, error: siblingsError } = await supabase
    .from("puppies")
    .select("id")
    .eq("litter_id", litterId);

  if (siblingsError) {
    throw new Error(siblingsError.message);
  }

  const ids = (siblings ?? []).map((row) => row.id as string);

  // Always include the puppy itself, even if the litter query
  // somehow misses it.
  if (!ids.includes(puppyId)) {
    ids.push(puppyId);
  }

  return ids;
}

export async function updateParentInfo(
  puppyId: string,
  role: "mom" | "dad",
  data: {
    name: string;
    breed: string;
    weight: string;
    registration: string;
  }
) {
  const supabase = await createClient();

  const siblingIds = await getLitterSiblingIds(supabase, puppyId);

  const { error } = await supabase
    .from("puppies")
    .update({
      [`${role}_name`]: data.name,
      [`${role}_breed`]: data.breed,
      [`${role}_weight`]: data.weight,
      [`${role}_registration`]: data.registration,
    })
    .in("id", siblingIds);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/puppies/${puppyId}/parents`);
  revalidatePath(`/puppies/${puppyId}`);

  for (const id of siblingIds) {
    if (id !== puppyId) {
      revalidatePath(`/puppies/${id}`);
    }
  }
}

export async function updateParentPhoto(
  puppyId: string,
  role: "mom" | "dad",
  url: string
) {
  const supabase = await createClient();

  const siblingIds = await getLitterSiblingIds(supabase, puppyId);

  const { error } = await supabase
    .from("puppies")
    .update({
      [`${role}_photo_url`]: url,
    })
    .in("id", siblingIds);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/puppies/${puppyId}/parents`);
  revalidatePath(`/puppies/${puppyId}`);

  for (const id of siblingIds) {
    if (id !== puppyId) {
      revalidatePath(`/puppies/${id}`);
    }
  }
}