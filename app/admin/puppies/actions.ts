type StagedMediaInput = {
  url: string;
  public_id: string;
  media_type: "image" | "video";
  is_cover: boolean;
  sort_order: number;
};

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