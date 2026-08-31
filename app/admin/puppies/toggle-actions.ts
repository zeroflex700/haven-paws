"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function revalidateAll(id?: string) {
revalidatePath("/");
revalidatePath("/puppies");
revalidatePath("/admin");
revalidatePath("/admin/puppies");
if (id) revalidatePath(/admin/puppies/${id});
}

export async function togglePublished(id: string, current: boolean) {
const supabase = await createClient();
const { error } = await supabase
.from("puppies")
.update({ is_published: !current })
.eq("id", id);

if (error) throw new Error(error.message);
revalidateAll(id);
}

export async function deletePuppy(id: string) {
const supabase = await createClient();
const { error } = await supabase.from("puppies").delete().eq("id", id);
if (error) throw new Error(error.message);
revalidateAll();
}