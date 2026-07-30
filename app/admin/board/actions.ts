"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBoardMember(name: string, title: string, photoUrl: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("breeder_board_members")
    .insert({ name, title, photo_url: photoUrl });

  if (error) throw new Error(error.message);
  revalidatePath("/breeder-standards");
  revalidatePath("/admin/board");
  redirect("/admin/board");
}

export async function updateBoardMember(
  id: string,
  name: string,
  title: string,
  photoUrl: string | null
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("breeder_board_members")
    .update({ name, title, photo_url: photoUrl })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/breeder-standards");
  revalidatePath("/admin/board");
  redirect("/admin/board");
}

export async function deleteBoardMember(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_board_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/breeder-standards");
  revalidatePath("/admin/board");
}