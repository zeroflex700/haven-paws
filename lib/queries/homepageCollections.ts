import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { getOrSetCache } from "@/lib/cache";
import { cacheKeys } from "@/lib/cache-keys";

export type VideoStory = {
  id: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  personName: string;
  description: string | null;
};

export type LocationCard = {
  id: string;
  cityName: string;
  imageUrl: string | null;
};

export type ExploringCard = {
  id: string;
  caption: string;
  linkHref: string;
  imageUrl: string | null;
};

const HOMEPAGE_COLLECTIONS_TTL_SECONDS = 600;

async function fetchVideoStories(): Promise<VideoStory[]> {
  const { data } = await supabase
    .from("video_stories")
    .select("id, thumbnail_url, video_url, person_name, description")
    .order("sort_order");
  return (data ?? []).map((r) => ({
    id: r.id,
    thumbnailUrl: r.thumbnail_url,
    videoUrl: r.video_url,
    personName: r.person_name,
    description: r.description,
  }));
}

export async function getVideoStories(): Promise<VideoStory[]> {
  return getOrSetCache(
    cacheKeys.videoStories,
    HOMEPAGE_COLLECTIONS_TTL_SECONDS,
    fetchVideoStories
  );
}

async function fetchLocationCards(): Promise<LocationCard[]> {
  const { data } = await supabase
    .from("location_cards")
    .select("id, city_name, image_url")
    .order("sort_order");
  return (data ?? []).map((r) => ({ id: r.id, cityName: r.city_name, imageUrl: r.image_url }));
}

export async function getLocationCards(): Promise<LocationCard[]> {
  return getOrSetCache(
    cacheKeys.locationCards,
    HOMEPAGE_COLLECTIONS_TTL_SECONDS,
    fetchLocationCards
  );
}

async function fetchExploringCards(): Promise<ExploringCard[]> {
  const { data } = await supabase
    .from("exploring_cards")
    .select("id, caption, link_href, image_url")
    .order("sort_order");
  return (data ?? []).map((r) => ({
    id: r.id,
    caption: r.caption,
    linkHref: r.link_href,
    imageUrl: r.image_url,
  }));
}

export async function getExploringCards(): Promise<ExploringCard[]> {
  return getOrSetCache(
    cacheKeys.exploringCards,
    HOMEPAGE_COLLECTIONS_TTL_SECONDS,
    fetchExploringCards
  );
}

// --- Admin variants (uncached — always read fresh from Supabase) ---

export async function getVideoStoriesAdmin(): Promise<VideoStory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("video_stories")
    .select("id, thumbnail_url, video_url, person_name, description")
    .order("sort_order");
  return (data ?? []).map((r) => ({
    id: r.id,
    thumbnailUrl: r.thumbnail_url,
    videoUrl: r.video_url,
    personName: r.person_name,
    description: r.description,
  }));
}

export async function getLocationCardsAdmin(): Promise<LocationCard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("location_cards")
    .select("id, city_name, image_url")
    .order("sort_order");
  return (data ?? []).map((r) => ({ id: r.id, cityName: r.city_name, imageUrl: r.image_url }));
}

export async function getExploringCardsAdmin(): Promise<ExploringCard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("exploring_cards")
    .select("id, caption, link_href, image_url")
    .order("sort_order");
  return (data ?? []).map((r) => ({
    id: r.id,
    caption: r.caption,
    linkHref: r.link_href,
    imageUrl: r.image_url,
  }));
}