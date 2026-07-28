import { createClient } from "@/lib/supabase/server";

export type AdminPuppyRow = {
  id: string;
  name: string;
  sex: "male" | "female";
  price: number;
  status: "available" | "reserved" | "sold";
  is_published: boolean;
  breeds: { name: string } | null;
};

export async function getAllPuppiesAdmin(): Promise<AdminPuppyRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("puppies")
    .select(`id, name, sex, price, status, is_published, breeds ( name )`)
    .order("created_at", { ascending: false });

  return (data ?? []) as unknown as AdminPuppyRow[];
}