import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export type Breeder = {
  id: string;
  name: string;
  slug: string;
  breedId: string | null;
  breedName: string | null;
  breedSlug: string | null;
  photoUrl: string | null;
  meetBreederText: string | null;
  meetBreederImageUrl: string | null;
  homeGalleryTitle: string;
  gettingAPuppyText: string | null;
};

export type BreederHomePhoto = { id: string; imageUrl: string };
export type BreederPhoto = { id: string; imageUrl: string };
export type BreederQA = { id: string; question: string; answer: string };
export type BreederIncludedItem = {
  id: string;
  category: string;
  label: string;
};
export type BreederIconTextItem = {
  id: string;
  iconKey: string;
  heading: string;
  body: string;
};
export type BreederQualification = {
  id: string;
  badgeImageUrl: string | null;
  labelLine: string | null;
  titleLine: string | null;
};

function mapBreeder(row: Record<string, unknown>): Breeder {
  const breed = row.breeds as
    | {
        id: string;
        name: string;
        slug: string | null;
      }
    | null;

  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    breedId: breed?.id ?? null,
    breedName: breed?.name ?? null,
    breedSlug: breed?.slug ?? null,
    photoUrl: row.photo_url as string | null,
    meetBreederText: row.meet_breeder_text as string | null,
    meetBreederImageUrl: row.meet_breeder_image_url as string | null,
    homeGalleryTitle:
      (row.home_gallery_title as string) ?? "The Lovely Home",
    gettingAPuppyText: row.getting_a_puppy_text as string | null,
  };
}

export async function getBreederBySlug(
  slug: string
): Promise<Breeder | null> {
  const { data } = await supabase
    .from("breeders")
    .select(
      `*,
       breeds (
         id,
         name,
         slug
       )`
    )
    .eq("slug", slug)
    .single();

  return data ? mapBreeder(data) : null;
}

export async function getBreederById(
  id: string
): Promise<Breeder | null> {
  const { data } = await supabase
    .from("breeders")
    .select(
      `*,
       breeds (
         id,
         name,
         slug
       )`
    )
    .eq("id", id)
    .single();

  return data ? mapBreeder(data) : null;
}

export async function getBreederHomePhotos(
  breederId: string
): Promise<BreederHomePhoto[]> {
  const { data } = await supabase
    .from("breeder_home_photos")
    .select("id, image_url")
    .eq("breeder_id", breederId)
    .order("sort_order");

  return (data ?? []).map((r) => ({
    id: r.id,
    imageUrl: r.image_url,
  }));
}

export async function getBreederPhotos(
  breederId: string
): Promise<BreederPhoto[]> {
  const { data } = await supabase
    .from("breeder_photos")
    .select("id, image_url")
    .eq("breeder_id", breederId)
    .order("sort_order");

  return (data ?? []).map((r) => ({
    id: r.id,
    imageUrl: r.image_url,
  }));
}

export async function getBreederQA(
  breederId: string
): Promise<BreederQA[]> {
  const { data } = await supabase
    .from("breeder_qa")
    .select("id, question, answer")
    .eq("breeder_id", breederId)
    .order("sort_order");

  return data ?? [];
}

export async function getBreederIncludedItems(
  breederId: string
): Promise<BreederIncludedItem[]> {
  const { data } = await supabase
    .from("breeder_included_items")
    .select("id, category, label")
    .eq("breeder_id", breederId)
    .order("sort_order");

  return data ?? [];
}

export async function getBreederMoreAbout(
  breederId: string
): Promise<BreederIconTextItem[]> {
  const { data } = await supabase
    .from("breeder_more_about")
    .select("id, icon_key, heading, body")
    .eq("breeder_id", breederId)
    .order("sort_order");

  return (data ?? []).map((r) => ({
    id: r.id,
    iconKey: r.icon_key,
    heading: r.heading,
    body: r.body,
  }));
}

export async function getBreederQualifications(
  breederId: string
): Promise<BreederQualification[]> {
  const { data } = await supabase
    .from("breeder_qualifications")
    .select(
      "id, badge_image_url, label_line, title_line"
    )
    .eq("breeder_id", breederId)
    .order("sort_order");

  return (data ?? []).map((r) => ({
    id: r.id,
    badgeImageUrl: r.badge_image_url,
    labelLine: r.label_line,
    titleLine: r.title_line,
  }));
}

export async function getBreederHealthTesting(
  breederId: string
): Promise<BreederIconTextItem[]> {
  const { data } = await supabase
    .from("breeder_health_testing")
    .select("id, icon_key, heading, body")
    .eq("breeder_id", breederId)
    .order("sort_order");

  return (data ?? []).map((r) => ({
    id: r.id,
    iconKey: r.icon_key,
    heading: r.heading,
    body: r.body,
  }));
}

export async function getAllBreedersAdmin(): Promise<Breeder[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("breeders")
    .select(
      `*,
       breeds (
         id,
         name,
         slug
       )`
    )
    .order("name");

  return (data ?? []).map(mapBreeder);
}

export async function getBreederAdmin(
  id: string
): Promise<Breeder | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("breeders")
    .select(
      `*,
       breeds (
         id,
         name,
         slug
       )`
    )
    .eq("id", id)
    .single();

  return data ? mapBreeder(data) : null;
}