import { createClient } from "@/lib/supabase/server";

export type AdminPuppyRow = {
  id: string;
  name: string;
  sex: "male" | "female";
  price: number;
  status: "available" | "reserved" | "sold" | "hidden";
  is_published: boolean;
  litter_id: string | null;
  breeds: { name: string } | null;
};

export async function getAllPuppiesAdmin(): Promise<AdminPuppyRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("puppies")
    .select(`id, name, sex, price, status, is_published, litter_id, breeds ( name )`)
    .order("created_at", { ascending: false });

  return (data ?? []) as unknown as AdminPuppyRow[];
}