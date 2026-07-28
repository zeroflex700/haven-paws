import { createClient } from "@/lib/supabase/server";

export async function getBreeds() {
  const supabase = await createClient();
  const { data } = await supabase.from("breeds").select("id, name").order("name");
  return data ?? [];
}