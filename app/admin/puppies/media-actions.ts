"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function revalidatePublicPages(puppyId: string) {
revalidatePath("/");
revalidatePath("/puppies");
revalidatePath(`/admin/puppies/${puppyId}/media`);
}

export async function addMedia(
puppyId: string,
url: string,
publicId: string,
mediaType: "image" | "video"
) {
const supabase = await createClient();

const { count } = await supabase
.from("puppy_media")
.select("id", { count: "exact", head: true })
.eq("puppy_id", puppyId);

const isFirst = (count ?? 0) === 0;

const { error } = await supabase.from("puppy_media").insert({
puppy_id: puppyId,
media_type: mediaType,
url,
cloudinary_public_id: publicId,
sort_order: count ?? 0,
is_cover: isFirst,
});

if (error) throw new Error(error.message);
revalidatePublicPages(puppyId);
}

export async function deleteMedia(puppyId: string, mediaId: string) {
const supabase = await createClient();
const { error } = await supabase.from("puppy_media").delete().eq("id", mediaId);
if (error) throw new Error(error.message);
revalidatePublicPages(puppyId);
}

export async function setCover(puppyId: string, mediaId: string) {
const supabase = await createClient();

await supabase.from("puppy_media").update({ is_cover: false }).eq("puppy_id", puppyId);
const { error } = await supabase
.from("puppy_media")
.update({ is_cover: true })
.eq("id", mediaId);

if (error) throw new Error(error.message);
.eq("puppy_id", puppyId)
.eq("sort_order", targetOrder)
.single();

if (!swapTarget) return;

await supabase.from("puppy_media").update({ sort_order: currentOrder }).eq("id", swapTarget.id);
await supabase.from("puppy_media").update({ sort_order: targetOrder }).eq("id", mediaId);
}