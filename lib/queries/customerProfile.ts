import { supabase } from "@/lib/supabase/client";

export type CustomerProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  phoneType: string;
  avatarUrl: string | null;
  email: string;
};

export type NotificationPrefs = {
  newsTips: boolean;
  favoritesUpdates: boolean;
  personalizedMatches: boolean;
  surveysFeedback: boolean;
  ownerGuide: boolean;
  puppySearchSms: boolean;
  breedUpdates: string[];
  genderUpdates: string;
  location: string;
};

export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data } = await supabase
    .from("customer_profiles")
    .select("first_name, last_name, phone, phone_type, avatar_url")
    .eq("id", userData.user.id)
    .single();

  return {
    firstName: data?.first_name ?? "",
    lastName: data?.last_name ?? "",
    phone: data?.phone ?? "",
    phoneType: data?.phone_type ?? "Mobile",
    avatarUrl: data?.avatar_url ?? null,
    email: userData.user.email ?? "",
  };
}

export async function updateCustomerProfile(fields: Partial<CustomerProfile>) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not logged in");

  const { error } = await supabase.from("customer_profiles").upsert({
    id: userData.user.id,
    first_name: fields.firstName,
    last_name: fields.lastName,
    phone: fields.phone,
    phone_type: fields.phoneType,
    avatar_url: fields.avatarUrl,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}

export async function getNotificationPrefs(): Promise<NotificationPrefs> {
  const { data: userData } = await supabase.auth.getUser();
  const defaults: NotificationPrefs = {
    newsTips: true,
    favoritesUpdates: true,
    personalizedMatches: true,
    surveysFeedback: false,
    ownerGuide: true,
    puppySearchSms: false,
    breedUpdates: [],
    genderUpdates: "any",
    location: "",
  };
  if (!userData.user) return defaults;

  const { data } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!data) return defaults;

  return {
    newsTips: data.news_tips,
    favoritesUpdates: data.favorites_updates,
    personalizedMatches: data.personalized_matches,
    surveysFeedback: data.surveys_feedback,
    ownerGuide: data.owner_guide,
    puppySearchSms: data.puppy_search_sms,
    breedUpdates: data.breed_updates ?? [],
    genderUpdates: data.gender_updates ?? "any",
    location: data.location ?? "",
  };
}

export async function updateNotificationPrefs(prefs: NotificationPrefs) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not logged in");

  const { error } = await supabase.from("notification_preferences").upsert({
    user_id: userData.user.id,
    news_tips: prefs.newsTips,
    favorites_updates: prefs.favoritesUpdates,
    personalized_matches: prefs.personalizedMatches,
    surveys_feedback: prefs.surveysFeedback,
    owner_guide: prefs.ownerGuide,
    puppy_search_sms: prefs.puppySearchSms,
    breed_updates: prefs.breedUpdates,
    gender_updates: prefs.genderUpdates,
    location: prefs.location,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}