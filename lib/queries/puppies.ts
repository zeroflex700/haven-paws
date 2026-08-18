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

type PuppyQueryRow = {
  id: string;
  name: string;
  sex: "male" | "female";
  price: number;
  status: "available" | "reserved" | "sold";
  birth_date: string | null;
  ready_date: string | null;
  breeds:
    | {
        name: string;
      }
    | null;
  puppy_media:
    | {
        url: string;
        is_cover: boolean;
        media_type: "image" | "video";
      }[]
    | null;
};

function calcAgeWeeks(
  birthDate: string | null
): number | null {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(birthDate).getTime();

  if (Number.isNaN(birth)) {
    return null;
  }

  const diffMs = Date.now() - birth;
  const weekMs =
    1000 * 60 * 60 * 24 * 7;

  return Math.max(
    0,
    Math.floor(diffMs / weekMs)
  );
}

function calcReadyLabel(
  readyDate: string | null
): string {
  if (!readyDate) {
    return "Ready to go home";
  }

  const ready = new Date(readyDate);

  if (Number.isNaN(ready.getTime())) {
    return "Ready to go home";
  }

  if (ready.getTime() <= Date.now()) {
    return "Ready to go home";
  }

  return `Ready by ${ready.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  )}`;
}

export async function getPuppies(): Promise<
  PuppyRecord[]
> {
  const { data, error } = await supabase
    .from("puppies")
    .select(
      `
        id,
        name,
        sex,
        price,
        status,
        birth_date,
        ready_date,
        breeds (
          name
        ),
        puppy_media (
          url,
          is_cover,
          media_type
        )
      `
    )
    .eq("is_published", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load puppies:",
      error
    );

    return [];
  }

  const rows =
    (data ?? []) as unknown as PuppyQueryRow[];

  return rows.map((puppy) => {
    const media =
      puppy.puppy_media ?? [];

    const cover =
      media.find(
        (item) => item.is_cover
      ) ??
      media.find(
        (item) =>
          item.media_type === "image"
      ) ??
      null;

    const hasVideo = media.some(
      (item) =>
        item.media_type === "video"
    );

    return {
      id: puppy.id,
      name: puppy.name,
      breed:
        puppy.breeds?.name ??
        "Unknown",
      sex: puppy.sex,
      price: Number(puppy.price),
      status: puppy.status,
      coverImage:
        cover?.url ?? null,
      ageWeeks: calcAgeWeeks(
        puppy.birth_date
      ),
      readyLabel:
        calcReadyLabel(
          puppy.ready_date
        ),
      hasVideo,
    };
  });
}