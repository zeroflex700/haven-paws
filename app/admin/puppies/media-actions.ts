"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  importMediaFromPage,
} from "@/lib/media-importer";

function revalidatePublicPages(
  puppyId: string
) {
  revalidatePath("/");
  revalidatePath("/puppies");
  revalidatePath(
    `/admin/puppies/${puppyId}/media`
  );
  revalidatePath(
    `/admin/puppies/${puppyId}`
  );
  revalidatePath(
    `/puppies/${puppyId}`
  );
}

export async function addMedia(
  puppyId: string,
  url: string,
  publicId: string,
  mediaType: "image" | "video"
) {
  const supabase =
    await createClient();

  const { count } = await supabase
    .from("puppy_media")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("puppy_id", puppyId);

  const isFirst =
    (count ?? 0) === 0;

  const { error } =
    await supabase
      .from("puppy_media")
      .insert({
        puppy_id: puppyId,
        media_type: mediaType,
        url,
        cloudinary_public_id:
          publicId,
        sort_order: count ?? 0,
        is_cover: isFirst,
      });

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePublicPages(
    puppyId
  );
}

export async function importMediaFromUrl(
  puppyId: string,
  pageUrl: string
): Promise<{
  imported: number;
  skipped: number;
  message?: string;
}> {
  const supabase =
    await createClient();

  // Make sure the puppy exists.
  const { data: puppy, error: puppyError } =
    await supabase
      .from("puppies")
      .select("id")
      .eq("id", puppyId)
      .single();

  if (
    puppyError ||
    !puppy
  ) {
    throw new Error(
      "Puppy was not found."
    );
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(
      pageUrl
    );
  } catch {
    throw new Error(
      "Please enter a valid website URL."
    );
  }

  if (
    parsedUrl.protocol !==
      "http:" &&
    parsedUrl.protocol !==
      "https:"
  ) {
    throw new Error(
      "Only HTTP and HTTPS URLs are supported."
    );
  }

  const discovered =
    await importMediaFromPage(
      pageUrl
    );

  if (
    discovered.length === 0
  ) {
    return {
      imported: 0,
      skipped: 0,
      message:
        "No usable images or videos were found on that page. The website may load its media dynamically or block automated requests.",
    };
  }

  const {
    data: existingMedia,
    error: existingError,
  } = await supabase
    .from("puppy_media")
    .select(
      "url"
    )
    .eq(
      "puppy_id",
      puppyId
    );

  if (existingError) {
    throw new Error(
      existingError.message
    );
  }

  const existingUrls =
    new Set(
      (existingMedia ?? []).map(
        (item) => item.url
      )
    );

  const newMedia =
    discovered.filter(
      (item) =>
        !existingUrls.has(
          item.url
        )
    );

  const skipped =
    discovered.length -
    newMedia.length;

  if (
    newMedia.length === 0
  ) {
    return {
      imported: 0,
      skipped,
      message:
        "All media found on that page is already in this puppy's gallery.",
    };
  }

  const currentCount =
    (existingMedia ?? [])
      .length;

  const rows =
    newMedia.map(
      (item, index) => ({
        puppy_id:
          puppyId,
        media_type:
          item.mediaType,
        url: item.url,

        // External website media does not
        // have a Cloudinary public ID.
        cloudinary_public_id:
          null,

        sort_order:
          currentCount +
          index,

        // If this puppy has no existing
        // media, the first imported image/video
        // becomes the cover.
        is_cover:
          currentCount ===
            0 &&
          index === 0,
      })
    );

  const { error } =
    await supabase
      .from("puppy_media")
      .insert(rows);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePublicPages(
    puppyId
  );

  return {
    imported:
      newMedia.length,
    skipped,
  };
}

export async function deleteMedia(
  puppyId: string,
  mediaId: string
) {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("puppy_media")
      .delete()
      .eq(
        "id",
        mediaId
      );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePublicPages(
    puppyId
  );
}

export async function setCover(
  puppyId: string,
  mediaId: string
) {
  const supabase =
    await createClient();

  await supabase
    .from("puppy_media")
    .update({
      is_cover: false,
    })
    .eq(
      "puppy_id",
      puppyId
    );

  const { error } =
    await supabase
      .from("puppy_media")
      .update({
        is_cover: true,
      })
      .eq(
        "id",
        mediaId
      )
      .eq(
        "puppy_id",
        puppyId
      );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePublicPages(
    puppyId
  );
}

export async function moveMedia(
  puppyId: string,
  mediaId: string,
  currentOrder: number,
  direction:
    | "up"
    | "down"
) {
  const supabase =
    await createClient();

  const targetOrder =
    direction === "up"
      ? currentOrder - 1
      : currentOrder + 1;

  if (targetOrder < 0) {
    return;
  }

  const {
    data: swapTarget,
  } = await supabase
    .from("puppy_media")
    .select("id")
    .eq(
      "puppy_id",
      puppyId
    )
    .eq(
      "sort_order",
      targetOrder
    )
    .single();

  if (!swapTarget) {
    return;
  }

  await supabase
    .from("puppy_media")
    .update({
      sort_order:
        currentOrder,
    })
    .eq(
      "id",
      swapTarget.id
    )
    .eq(
      "puppy_id",
      puppyId
    );

  await supabase
    .from("puppy_media")
    .update({
      sort_order:
        targetOrder,
    })
    .eq(
      "id",
      mediaId
    )
    .eq(
      "puppy_id",
      puppyId
    );

  revalidatePublicPages(
    puppyId
  );
}