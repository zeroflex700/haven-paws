import { supabase } from "@/lib/supabase/client";

export type PuppyRecord = {
  id: string;
  name: string;
  breed: string;
  sex: "male" | "female";
  price: number;
  status: "available" | "reserved" | "sold";
  coverImage: string | null;
  ageWeeks: number | null;
  readyLabel: string;
  hasVideo: boolean;
};

function calcAgeWeeks(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const diffMs = Date.now() - new Date(birthDate).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)));
}

function calcReadyLabel(readyDate: string | null): string {
  if (!readyDate) return "Ready to go home";
  const ready = new Date(readyDate);
  if (ready.getTime() <= Date.now()) return "Ready to go home";
  return `Ready by ${ready.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export async function getPuppies(): Promise<PuppyRecord[]> {
  const { data, error } = await supabase
    .from("puppies")
    .select(
      `id, name, sex, price, status, birth_date, ready_date,
       breeds ( name ),
       puppy_media ( url, is_cover, media_type )`
    )
    .eq("is_published", true);

  if (error) {
    console.error(error);
    return [];
  }

  const rows = (data ?? []) as unknown as {
    id: string;
    name: string;
    sex: "male" | "female";
    price: number;
    status: "available" | "reserved" | "sold";
    birth_date: string | null;
    ready_date: string | null;
    breeds: { name: string } | null;
    puppy_media: { url: string; is_cover: boolean; media_type: "image" | "video" }[] | null;
  }[];

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
    ageWeeks: calcAgeWeeks(p.birth_date),
    readyLabel: calcReadyLabel(p.ready_date),
    hasVideo: p.puppy_media?.some((m) => m.media_type === "video") ?? false,
  }));
}