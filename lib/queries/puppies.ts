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

type RawPuppyRow = {
  id: string;
  name: string;
  sex: "male" | "female";
  price: number;
  status: "available" | "reserved" | "sold";
  breeds: { name: string } | null;
  puppy_media: { url: string; is_cover: boolean }[] | null;
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

  const rows = (data ?? []) as unknown as RawPuppyRow[];

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    breed: p.breeds?.name ?? "Unknown",
    sex: p.sex,
    price: Number(p.price),
    status: p.status,
    coverImage:
      p.puppy_media?.find((m) => m.is_cover)?.url ??
      p.puppy_media?.[0]?.url ??
      null,
  }));
}