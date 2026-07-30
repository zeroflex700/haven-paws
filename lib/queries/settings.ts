import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export type AppSettings = {
  breederName: string;
  yearsExperience: string;
  specialties: string;
  bio: string;
  badgeText: string;
  deliveryFee: number;
  starterKitPrice: number;
  healthGuaranteePrice: number;
  supportPhone: string;
  supportHours: string;
  tagline: string;
  promiseText: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
};

const defaults: AppSettings = {
  breederName: "Haven Paws",
  yearsExperience: "",
  specialties: "",
  bio: "",
  badgeText: "",
  deliveryFee: 150,
  starterKitPrice: 89,
  healthGuaranteePrice: 149,
  supportPhone: "",
  supportHours: "Everyday, 8AM–8PM",
  tagline: "The Trusted Path Home",
  promiseText:
    "We promise to help you find your perfect puppy, and to make sure the entire experience leaves you with a full heart.",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  twitterUrl: "",
};

type RawSettingsRow = {
  breeder_name: string | null;
  years_experience: string | null;
  specialties: string | null;
  bio: string | null;
  badge_text: string | null;
  delivery_fee: number | null;
  starter_kit_price: number | null;
  health_guarantee_price: number | null;
  support_phone: string | null;
  support_hours: string | null;
  tagline: string | null;
  promise_text: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  twitter_url: string | null;
};

function mapRow(data: RawSettingsRow): AppSettings {
  return {
    breederName: data.breeder_name ?? defaults.breederName,
    yearsExperience: data.years_experience ?? "",
    specialties: data.specialties ?? "",
    bio: data.bio ?? "",
    badgeText: data.badge_text ?? "",
    deliveryFee: data.delivery_fee ?? defaults.deliveryFee,
    starterKitPrice: data.starter_kit_price ?? defaults.starterKitPrice,
    healthGuaranteePrice: data.health_guarantee_price ?? defaults.healthGuaranteePrice,
    supportPhone: data.support_phone ?? "",
    supportHours: data.support_hours ?? defaults.supportHours,
    tagline: data.tagline ?? defaults.tagline,
    promiseText: data.promise_text ?? defaults.promiseText,
    facebookUrl: data.facebook_url ?? "",
    instagramUrl: data.instagram_url ?? "",
    youtubeUrl: data.youtube_url ?? "",
    twitterUrl: data.twitter_url ?? "",
  };
}

const SELECT_FIELDS =
  "breeder_name, years_experience, specialties, bio, badge_text, delivery_fee, starter_kit_price, health_guarantee_price, support_phone, support_hours, tagline, promise_text, facebook_url, instagram_url, youtube_url, twitter_url";

export async function getSettings(): Promise<AppSettings> {
  const { data } = await supabase.from("app_settings").select(SELECT_FIELDS).eq("id", "main").single();
  if (!data) return defaults;
  return mapRow(data as unknown as RawSettingsRow);
}

export async function getSettingsAdmin(): Promise<AppSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("app_settings").select(SELECT_FIELDS).eq("id", "main").single();
  if (!data) return defaults;
  return mapRow(data as unknown as RawSettingsRow);
}