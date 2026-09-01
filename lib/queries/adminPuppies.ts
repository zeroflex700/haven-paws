import { createClient } from "@/lib/supabase/server";

export type AdminPuppyRecord = {
  id: string;
  name: string;
  price: number;
  status: "available" | "reserved" | "sold" | "hidden";
  is_published: boolean;
  litter_id: string | null;
  breeds: { name: string } | null;
};

type AdminPuppyQueryRow = {
  id: string;
  name: string;
  price: number;
  status: "available" | "reserved" | "sold" | "hidden";
  is_published: boolean;
  litter_id: string | null;
  breeds:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

function getSingleRelation<T>(
  relation: T | T[] | null
): T | null {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}

/**
 * Admin-facing puppy list.
 *
 * Unlike getPublishedPuppies(), this intentionally does NOT filter by
 * is_published — the admin list needs to show hidden/unpublished puppies
 * too, since PuppyListView displays and filters on that exact field.
 */
export async function getAllPuppiesAdmin(): Promise<
  AdminPuppyRecord[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("puppies")
    .select(
      `
        id,
        name,
        price,
        status,
        is_published,
        litter_id,
        breeds (
          name
        )
      `
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load admin puppies:",
      error
    );

    return [];
  }

  const rows =
    (data ?? []) as unknown as AdminPuppyQueryRow[];

  return rows.map((puppy) => ({
    id: puppy.id,
    name: puppy.name,
    price: Number(puppy.price),
    status: puppy.status,
    is_published: puppy.is_published,
    litter_id: puppy.litter_id,
    breeds: getSingleRelation(puppy.breeds),
  }));
}
