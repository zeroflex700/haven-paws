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
};

function mapRow(data: {
  breeder_name: string | null;
  years_experience: string | null;
  specialties: string | null;
  bio: string | null;
  badge_text: string | null;
  delivery_fee: number | null;
  starter_kit_price: number | null;
  health_guarantee_price: number | null;
}): AppSettings {
  return {
    breederName: data.breeder_name ?? defaults.breederName,
    yearsExperience: data.years_experience ?? "",
    specialties: data.specialties ?? "",
    bio: data.bio ?? "",
    badgeText: data.badge_text ?? "",
    deliveryFee: data.delivery_fee ?? defaults.deliveryFee,
    starterKitPrice: data.starter_kit_price ?? defaults.starterKitPrice,
    healthGuaranteePrice: data.health_guarantee_price ?? defaults.healthGuaranteePrice,
  };
}

export async function getSettings(): Promise<AppSettings> {
  const { data } = await supabase
    .from("app_settings")
    .select(
      "breeder_name, years_experience, specialties, bio, badge_text, delivery_fee, starter_kit_price, health_guarantee_price"
    )
    .eq("id", "main")
    .single();

  if (!data) return defaults;
  return mapRow(data);
}

export async function getSettingsAdmin(): Promise<AppSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("app_settings")
    .select(
      "breeder_name, years_experience, specialties, bio, badge_text, delivery_fee, starter_kit_price, health_guarantee_price"
    )
    .eq("id", "main")
    .single();

  if (!data) return defaults;
  return mapRow(data);
}