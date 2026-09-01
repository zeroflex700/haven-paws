"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addGlobalIncludedItem(formData: FormData) {
  const supabase = await createClient();

  const category = formData.get("category") as string;
  const label = formData.get("label") as string;

  if (!category || !label) {
    throw new Error("Category and item are both required.");
  }

  const { data: existing } = await supabase
    .from("global_included_items")
    .select("sort_order")
    .eq("category", category)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder = (existing?.sort_order ?? -1) + 1;

  const { error } = await supabase
    .from("global_included_items")
    .insert({
      category,
      label,
      sort_order: nextSortOrder,
    });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/included-items");
}

export async function deleteGlobalIncludedItem(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("global_included_items")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/included-items");
}
