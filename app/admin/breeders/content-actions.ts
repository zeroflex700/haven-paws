"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function revalidateBreeder(slug: string) {
  revalidatePath(`/breeders/${slug}`);
}

// --- Home photos ---
export async function addHomePhoto(breederId: string, breederSlug: string, imageUrl: string) {
  const supabase = await createClient();
  const { count } = await supabase.from("breeder_home_photos").select("id", { count: "exact", head: true }).eq("breeder_id", breederId);
  const { error } = await supabase.from("breeder_home_photos").insert({ breeder_id: breederId, image_url: imageUrl, sort_order: count ?? 0 });
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}
export async function deleteHomePhoto(id: string, breederSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_home_photos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}

// --- Photo strip ---
export async function addBreederPhoto(breederId: string, breederSlug: string, imageUrl: string) {
  const supabase = await createClient();
  const { count } = await supabase.from("breeder_photos").select("id", { count: "exact", head: true }).eq("breeder_id", breederId);
  const { error } = await supabase.from("breeder_photos").insert({ breeder_id: breederId, image_url: imageUrl, sort_order: count ?? 0 });
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}
export async function deleteBreederPhoto(id: string, breederSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_photos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}

// --- Q&A ---
export async function addBreederQA(breederId: string, breederSlug: string, question: string, answer: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_qa").insert({ breeder_id: breederId, question, answer });
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}
export async function deleteBreederQA(id: string, breederSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_qa").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}

// --- Included items ---
export async function addIncludedItem(breederId: string, breederSlug: string, category: string, label: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_included_items").insert({ breeder_id: breederId, category, label });
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}
export async function deleteIncludedItem(id: string, breederSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_included_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}

// --- More about ---
export async function addMoreAbout(breederId: string, breederSlug: string, iconKey: string, heading: string, body: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_more_about").insert({ breeder_id: breederId, icon_key: iconKey, heading, body });
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}
export async function deleteMoreAbout(id: string, breederSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_more_about").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}

// --- Qualifications ---
export async function addQualification(breederId: string, breederSlug: string, badgeImageUrl: string | null, labelLine: string, titleLine: string) {
  const supabase = await createClient();
  const { count } = await supabase.from("breeder_qualifications").select("id", { count: "exact", head: true }).eq("breeder_id", breederId);
  if ((count ?? 0) >= 8) throw new Error("Maximum of 8 qualifications reached");
  const { error } = await supabase.from("breeder_qualifications").insert({
    breeder_id: breederId,
    badge_image_url: badgeImageUrl,
    label_line: labelLine,
    title_line: titleLine,
    sort_order: count ?? 0,
  });
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}
export async function deleteQualification(id: string, breederSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_qualifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}

// --- Health testing ---
export async function addHealthTesting(breederId: string, breederSlug: string, iconKey: string, heading: string, body: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_health_testing").insert({ breeder_id: breederId, icon_key: iconKey, heading, body });
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}
export async function deleteHealthTesting(id: string, breederSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("breeder_health_testing").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateBreeder(breederSlug);
}