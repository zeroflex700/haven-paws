"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  invalidatePublishedPuppies,
  invalidatePuppyDetail,
  invalidateRelatedPuppiesForBreed,
  invalidateSiblingsForLitter,
} from "@/lib/cache-invalidate";

function revalidateAll(id?: string) {
revalidatePath("/");
revalidatePath("/puppies");
revalidatePath("/admin");
revalidatePath("/admin/puppies");
if (id) revalidatePath(`/admin/puppies/${id}`);
}

async function invalidatePuppyCaches(
  supabase: Awaited<ReturnType<typeof createClient>>,
  id: string
) {
  const { data } = await supabase
    .from("puppies")
    .select("breed_id, litter_id")
    .eq("id", id)
    .maybeSingle();

  await invalidatePublishedPuppies();
  await invalidatePuppyDetail(id);

  if (data?.breed_id) {
    await invalidateRelatedPuppiesForBreed(data.breed_id);
  }
  if (data?.litter_id) {
    await invalidateSiblingsForLitter(data.litter_id);
  }
}

export async function togglePublished(id: string, current: boolean) {
const supabase = await createClient();

await invalidatePuppyCaches(supabase, id);

const { error } = await supabase
.from("puppies")
.update({ is_published: !current })
.eq("id", id);

if (error) throw new Error(error.message);
revalidateAll(id);
}

export async function deletePuppy(id: string) {
const supabase = await createClient();

// Must fetch breed_id/litter_id BEFORE deleting — the row won't exist
// to query afterward.
await invalidatePuppyCaches(supabase, id);

const { error } = await supabase.from("puppies").delete().eq("id", id);
if (error) throw new Error(error.message);
revalidateAll();
}