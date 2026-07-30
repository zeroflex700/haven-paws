import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export type BoardMember = {
  id: string;
  name: string;
  title: string | null;
  photoUrl: string | null;
};

export async function getBoardMembers(): Promise<BoardMember[]> {
  const { data } = await supabase
    .from("breeder_board_members")
    .select("id, name, title, photo_url")
    .order("sort_order");

  return (data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    title: m.title,
    photoUrl: m.photo_url,
  }));
}

export async function getBoardMembersAdmin(): Promise<BoardMember[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("breeder_board_members")
    .select("id, name, title, photo_url")
    .order("sort_order");

  return (data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    title: m.title,
    photoUrl: m.photo_url,
  }));
}

export async function getBoardMemberAdmin(id: string): Promise<BoardMember | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("breeder_board_members")
    .select("id, name, title, photo_url")
    .eq("id", id)
    .single();

  if (!data) return null;
  return { id: data.id, name: data.name, title: data.title, photoUrl: data.photo_url };
}