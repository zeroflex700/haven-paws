"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type StagedMediaInput = {
  url: string;
  public_id: string;
  media_type: "image" | "video";
  is_cover: boolean;
  sort_order: number;
};

type SiblingParentFields = {
  mom_name: string | null;
  mom_breed: string | null;
  mom_weight: string | null;
  mom_registration: string | null;
  mom_photo_url: string | null;
  dad_name: string | null;
  dad_breed: string | null;
  dad_weight: string | null;
  dad_registration: string | null;
  dad_photo_url: string | null;
};

const EMPTY_PARENT_FIELDS: SiblingParentFields = {
  mom_name: null,
  mom_breed: null,
  mom_weight: null,
  mom_registration: null,
  mom_photo_url: null,
  dad_name: null,
  dad_breed: null,
  dad_weight: null,
  dad_registration: null,
  dad_photo_url: null,
};

async function validateBreederForBreed(
  supabase: Awaited<ReturnType<typeof createClient>>,
  breederId: string | null,
  breedId: string
) {
  if (!breederId) return;

  const { data: breeder, error } = await supabase
    .from("breeders")
    .select("id, breed_id")
    .eq("id", breederId)
    .single();

  if (error || !breeder) {
    throw new Error("Selected breeder was not found.");
  }

  if (breeder.breed_id !== breedId) {
    throw new Error(
      "The selected breeder does not belong to the selected breed."
    );
  }
}

/**
 * Looks up the oldest existing puppy in a litter and returns its parent
 * fields, used as a fallback when the submitted form doesn't provide its
 * own values (e.g. adding a second/third sibling to an existing litter).
 */
async function getSiblingParentFields(
  supabase: Awaited<ReturnType<typeof createClient>>,
  litterId: string | null
): Promise<SiblingParentFields> {
  if (!litterId) {
    return EMPTY_PARENT_FIELDS;
  }

  const { data } = await supabase
    .from("puppies")
    .select(
      `
        mom_name,
        mom_breed,
        mom_weight,
        mom_registration,
        mom_photo_url,
        dad_name,
        dad_breed,
        dad_weight,
        dad_registration,
        dad_photo_url
      `
    )
    .eq("litter_id", litterId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (data as SiblingParentFields | null) ?? EMPTY_PARENT_FIELDS;
}

export async function createPuppy(formData: FormData) {
  const supabase = await createClient();

  const breedId = formData.get("breed_id") as string;
  const breederId =
    (formData.get("breeder_id") as string) || null;
  const litterId = (formData.get("litter_id") as string) || null;
  const puppyId = (formData.get("id") as string) || undefined;

  if (!breedId) {
    throw new Error("A breed is required.");
  }

  await validateBreederForBreed(
    supabase,
    breederId,
    breedId
  );

  // Fall back to a matching sibling's parent info only for whatever
  // the form itself didn't provide (form values always win).
  const siblingParentFields = await getSiblingParentFields(
    supabase,
    litterId
  );

  const momName =
    (formData.get("mom_name") as string) || null;
  const momBreed =
    (formData.get("mom_breed") as string) || null;
  const momWeight =
    (formData.get("mom_weight") as string) || null;
  const momRegistration =
    (formData.get("mom_registration") as string) || null;
  const momPhotoUrl =
    (formData.get("mom_photo_url") as string) || null;

  const dadName =
    (formData.get("dad_name") as string) || null;
  const dadBreed =
    (formData.get("dad_breed") as string) || null;
  const dadWeight =
    (formData.get("dad_weight") as string) || null;
  const dadRegistration =
    (formData.get("dad_registration") as string) || null;
  const dadPhotoUrl =
    (formData.get("dad_photo_url") as string) || null;

  const { error } = await supabase.from("puppies").insert({
    ...(puppyId ? { id: puppyId } : {}),
    name: formData.get("name") as string,
    breed_id: breedId,
    breeder_id: breederId,
    sex: formData.get("sex") as string,
    price: Number(formData.get("price")),
    deposit_amount: Number(formData.get("deposit_amount") || 0),
    description: formData.get("description") as string,
    status: formData.get("status") as string,
    color: formData.get("color") as string,
    weight_estimate: formData.get("weight_estimate")
      ? Number(formData.get("weight_estimate"))
      : null,
    markings: (formData.get("markings") as string) || null,
    size: (formData.get("size") as string) || null,
    generation: (formData.get("generation") as string) || null,
    age_weeks: formData.get("age_weeks")
      ? Number(formData.get("age_weeks"))
      : null,
    litter_id: litterId,
    ready_date: (formData.get("ready_date") as string) || null,
    included_items: formData.getAll("included_items"),
    vet_checked: formData.get("vet_checked") === "on",
    vaccinated: formData.get("vaccinated") === "on",
    is_published: formData.get("is_published") === "on",
    mom_name: momName ?? siblingParentFields.mom_name ?? null,
    mom_breed: momBreed ?? siblingParentFields.mom_breed ?? null,
    mom_weight: momWeight ?? siblingParentFields.mom_weight ?? null,
    mom_registration:
      momRegistration ?? siblingParentFields.mom_registration ?? null,
    mom_photo_url:
      momPhotoUrl ?? siblingParentFields.mom_photo_url ?? null,
    dad_name: dadName ?? siblingParentFields.dad_name ?? null,
    dad_breed: dadBreed ?? siblingParentFields.dad_breed ?? null,
    dad_weight: dadWeight ?? siblingParentFields.dad_weight ?? null,
    dad_registration:
      dadRegistration ?? siblingParentFields.dad_registration ?? null,
    dad_photo_url:
      dadPhotoUrl ?? siblingParentFields.dad_photo_url ?? null,
  });

  if (error) throw new Error(error.message);

  const stagedMediaRaw = formData.get("staged_media") as string | null;

  if (puppyId && stagedMediaRaw) {
    let stagedMedia: StagedMediaInput[] = [];

    try {
      stagedMedia = JSON.parse(stagedMediaRaw);
    } catch {
      stagedMedia = [];
    }

    if (stagedMedia.length > 0) {
      const { error: mediaError } = await supabase
        .from("puppy_media")
        .insert(
          stagedMedia.map((item) => ({
            puppy_id: puppyId,
            media_type: item.media_type,
            url: item.url,
            cloudinary_public_id: item.public_id,
            sort_order: item.sort_order,
            is_cover: item.is_cover,
          }))
        );

      if (mediaError) throw new Error(mediaError.message);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/puppies");
  if (puppyId) {
    revalidatePath(`/puppies/${puppyId}`);
  }

  redirect("/admin/puppies");
}

/**
 * Updates an existing puppy. Bound with the puppy id via
 * updatePuppy.bind(null, id) on the edit page, so the form action
 * signature stays (formData: FormData) like the rest of this file.
 *
 * Deliberately does NOT touch mom_ or dad_ fields, or media — those are
 * managed from the separate "Manage Parents" and "Manage Photos & Videos"
 * pages linked from the edit screen, and PuppyForm doesn't render those
 * inputs at all when editing an existing puppy.
 */
export async function updatePuppy(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();

  const breedId = formData.get("breed_id") as string;
  const breederId =
    (formData.get("breeder_id") as string) || null;

  if (!breedId) {
    throw new Error("A breed is required.");
  }

  await validateBreederForBreed(
    supabase,
    breederId,
    breedId
  );

  const { error } = await supabase
    .from("puppies")
    .update({
      name: formData.get("name") as string,
      breed_id: breedId,
      breeder_id: breederId,
      sex: formData.get("sex") as string,
      price: Number(formData.get("price")),
      deposit_amount: Number(
        formData.get("deposit_amount") || 0
      ),
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      color: formData.get("color") as string,
      weight_estimate: formData.get("weight_estimate")
        ? Number(formData.get("weight_estimate"))
        : null,
      markings: (formData.get("markings") as string) || null,
      size: (formData.get("size") as string) || null,
      generation: (formData.get("generation") as string) || null,
      age_weeks: formData.get("age_weeks")
        ? Number(formData.get("age_weeks"))
        : null,
      litter_id:
        (formData.get("litter_id") as string) || null,
      ready_date:
        (formData.get("ready_date") as string) || null,
      included_items: formData.getAll("included_items"),
      vet_checked: formData.get("vet_checked") === "on",
      vaccinated: formData.get("vaccinated") === "on",
      is_published: formData.get("is_published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/puppies");
  revalidatePath(`/admin/puppies/${id}`);
  revalidatePath(`/puppies/${id}`);

  redirect("/admin/puppies");
}
