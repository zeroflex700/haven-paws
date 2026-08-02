"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ROUTE_MAP: Record<string, string> = {
  "akc-registration": "/akc-registration",
  "akc-benefits": "/akc-benefits",
  "fetch-insurance": "/fetch-insurance",
  "breeder-standards": "/breeder-standards",
  reviews: "/reviews",
  about: "/about",
  "delivery-programs": "/delivery",
};

function revalidateForSlug(slug: string) {
  const route = ROUTE_MAP[slug] ?? `/${slug}`;
  revalidatePath(route);
  revalidatePath(`/admin/content/${slug}`);
}

export async function updatePageHeroImage(slug: string, url: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("page_content").upsert({ slug, hero_image_url: url });
  if (error) throw new Error(error.message);
  revalidateForSlug(slug);
}

export async function updatePageHeroVideo(slug: string, url: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("page_content").upsert({ slug, hero_video_url: url });
  if (error) throw new Error(error.message);
  revalidateForSlug(slug);
}

export async function updatePageExtraImage(slug: string, key: string, url: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("page_content")
    .select("extra_images")
    .eq("slug", slug)
    .single();

  const current = (existing?.extra_images as Record<string, string>) ?? {};
  const updated = { ...current, [key]: url };

  const { error } = await supabase.from("page_content").upsert({ slug, extra_images: updated });
  if (error) throw new Error(error.message);
  revalidateForSlug(slug);
}

export async function updatePageExtraVideo(slug: string, key: string, url: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("page_content")
    .select("extra_videos")
    .eq("slug", slug)
    .single();

  const current = (existing?.extra_videos as Record<string, string>) ?? {};
  const updated = { ...current, [key]: url };

  const { error } = await supabase.from("page_content").upsert({ slug, extra_videos: updated });
  if (error) throw new Error(error.message);
  revalidateForSlug(slug);
}