import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export type AppSettings = {
  breederName: string;
  breederPhotoUrl: string | null;
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
  breederEmail: string;
  breederHours: string;
  deliveryHomePrice: number;
  deliveryMeetPrice: number;
  deliveryExpressPrice: number;
  deliveryPickupPriceLabel: string;
};

const defaults: AppSettings = {
  breederName: "Haven Paws",
  breederPhotoUrl: null,
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
  breederEmail: "breederhelp@havenpaws.com",
  breederHours: "Monday – Friday: 9:00 AM – 7:00 PM (ET)\nSaturday: 9:00 AM – 6:00 PM (ET)",
  deliveryHomePrice: 300,
  deliveryMeetPrice: 150,
  deliveryExpressPrice: 420,
  deliveryPickupPriceLabel: "$0–$60",
};

type RawSettingsRow = {
  breeder_name: string | null;
  breeder_photo_url: string | null;
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
  breeder_email: string | null;
  breeder_hours: string | null;
  delivery_home_price: number | null;
  delivery_meet_price: number | null;
  delivery_express_price: number | null;
  delivery_pickup_price_label: string | null;
};

function mapRow(data: RawSettingsRow): AppSettings {
  return {
    breederName: data.breeder_name ?? defaults.breederName,
    breederPhotoUrl: data.breeder_photo_url ?? null,
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
    breederEmail: data.breeder_email ?? defaults.breederEmail,
    breederHours: data.breeder_hours ?? defaults.breederHours,
    deliveryHomePrice: data.delivery_home_price ?? defaults.deliveryHomePrice,
    deliveryMeetPrice: data.delivery_meet_price ?? defaults.deliveryMeetPrice,
    deliveryExpressPrice: data.delivery_express_price ?? defaults.deliveryExpressPrice,
    deliveryPickupPriceLabel: data.delivery_pickup_price_label ?? defaults.deliveryPickupPriceLabel,
  };
}

const SELECT_FIELDS =
  "breeder_name, breeder_photo_url, years_experience, specialties, bio, badge_text, delivery_fee, starter_kit_price, health_guarantee_price, support_phone, support_hours, tagline, promise_text, facebook_url, instagram_url, youtube_url, twitter_url, breeder_email, breeder_hours, delivery_home_price, delivery_meet_price, delivery_express_price, delivery_pickup_price_label";

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