import { createClient } from "@/lib/supabase/server";

export async function getAllPuppiesAdmin() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("puppies")
    .select(`id, name, sex, price, status, is_published, breeds ( name )`)
    .order("created_at", { ascending: false });

  return data ?? [];
}