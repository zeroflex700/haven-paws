"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function revalidatePublicPages(puppyId: string) {
  revalidatePath("/");
  revalidatePath("/puppies");
  revalidatePath(`/admin/puppies/${puppyId}/media`);
  revalidatePath(`/puppies/${puppyId}`);
}

export async function addMedia(
  puppyId: string,
  url: string,
  publicId: string,
  mediaType: "image" | "video"
) {
  const supabase = await createClient();

  const { count, error: countError } = await supabase
    .from("puppy_media")
    .select("id", { count: "exact", head: true })
    .eq("puppy_id", puppyId);

  if (countError) {
    throw new Error(countError.message);
  }

  const isFirst = (count ?? 0) === 0;

  const { error } = await supabase.from("puppy_media").insert({
    puppy_id: puppyId,
    media_type: mediaType,
    url,
    cloudinary_public_id: publicId,
    sort_order: count ?? 0,
    is_cover: isFirst,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePublicPages(puppyId);
}

export async function deleteMedia(puppyId: string, mediaId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("puppy_media")
    .delete()
    .eq("id", mediaId)
    .eq("puppy_id", puppyId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePublicPages(puppyId);
}

export async function setCover(puppyId: string, mediaId: string) {
  const supabase = await createClient();

  const { error: clearError } = await supabase
    .from("puppy_media")
    .update({ is_cover: false })
    .eq("puppy_id", puppyId);

  if (clearError) {
    throw new Error(clearError.message);
  }

  const { error } = await supabase
    .from("puppy_media")
    .update({ is_cover: true })
    .eq("id", mediaId)
    .eq("puppy_id", puppyId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePublicPages(puppyId);
}

export async function moveMedia(
  puppyId: string,
  mediaId: string,
  direction: "up" | "down"
) {
  const supabase = await createClient();

  const { data: currentMedia, error: currentError } = await supabase
    .from("puppy_media")
    .select("id, sort_order")
    .eq("id", mediaId)
    .eq("puppy_id", puppyId)
    .single();

  if (currentError || !currentMedia) {
    throw new Error(currentError?.message ?? "Media item not found");
  }

  const currentOrder = currentMedia.sort_order ?? 0;
  const targetOrder =
    direction === "up" ? currentOrder - 1 : currentOrder + 1;

  if (targetOrder < 0) {
    return;
  }

  const { data: swapTarget, error: targetError } = await supabase
    .from("puppy_media")
    .select("id, sort_order")
    .eq("puppy_id", puppyId)
    .eq("sort_order", targetOrder)
    .single();

  if (targetError || !swapTarget) {
    return;
  }

  const { error: firstUpdateError } = await supabase
    .from("puppy_media")
    .update({ sort_order: currentOrder })
    .eq("id", swapTarget.id)
    .eq("puppy_id", puppyId);

  if (firstUpdateError) {
    throw new Error(firstUpdateError.message);
  }

  const { error: secondUpdateError } = await supabase
    .from("puppy_media")
    .update({ sort_order: targetOrder })
    .eq("id", mediaId)
    .eq("puppy_id", puppyId);

  if (secondUpdateError) {
    throw new Error(secondUpdateError.message);
  }

  revalidatePublicPages(puppyId);
}