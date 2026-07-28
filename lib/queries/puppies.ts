import { supabase } from "@/lib/supabase/client";

export type PuppyRecord = {
  id: string;
  name: string;
  breed: string;
  sex: "male" | "female";
  price: number;
  status: "available" | "reserved" | "sold";
  coverImage: string | null;
};

export async function getPuppies(): Promise<PuppyRecord[]> {
  const { data, error } = await supabase
    .from("puppies")
    .select(
      `id, name, sex, price, status,
       breeds ( name ),
       puppy_media ( url, is_cover )`
    )
    .eq("is_published", true);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    breed: p.breeds?.name ?? "Unknown",
    sex: p.sex,
    price: Number(p.price),
    status: p.status,
    coverImage:
      p.puppy_media?.find((m: any) => m.is_cover)?.url ??
      p.puppy_media?.[0]?.url ??
      null,
  }));
}