import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export type AppSettings = {
  breederName: string;
  yearsExperience: string;
  specialties: string;
  bio: string;
  badgeText: string;
};

const defaults: AppSettings = {
  breederName: "Haven Paws",
  yearsExperience: "",
  specialties: "",
  bio: "",
  badgeText: "",
};

export async function getSettings(): Promise<AppSettings> {
  const { data } = await supabase
    .from("app_settings")
    .select("breeder_name, years_experience, specialties, bio, badge_text")
    .eq("id", "main")
    .single();

  if (!data) return defaults;

  return {
    breederName: data.breeder_name ?? defaults.breederName,
    yearsExperience: data.years_experience ?? "",
    specialties: data.specialties ?? "",
    bio: data.bio ?? "",
    badgeText: data.badge_text ?? "",
  };
}

export async function getSettingsAdmin(): Promise<AppSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("app_settings")
    .select("breeder_name, years_experience, specialties, bio, badge_text")
    .eq("id", "main")
    .single();

  if (!data) return defaults;

  return {
    breederName: data.breeder_name ?? defaults.breederName,
    yearsExperience: data.years_experience ?? "",
    specialties: data.specialties ?? "",
    bio: data.bio ?? "",
    badgeText: data.badge_text ?? "",
  };
}