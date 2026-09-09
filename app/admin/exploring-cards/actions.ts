"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { invalidateHomepageCollections } from "@/lib/cache-invalidate";

export async function createExploringCard(caption: string, linkHref: string, imageUrl: string | null) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("exploring_cards")
    .insert({ caption, link_href: linkHref || "/puppies", image_url: imageUrl });
  if (error) throw new Error(error.message);
  await invalidateHomepageCollections();
  revalidatePath("/");
  revalidatePath("/admin/exploring-cards");
  redirect("/admin/exploring-cards");
}

export async function deleteExploringCard(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("exploring_cards").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await invalidateHomepageCollections();
  revalidatePath("/");
  revalidatePath("/admin/exploring-cards");
}