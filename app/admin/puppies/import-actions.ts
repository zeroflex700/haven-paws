"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ImportResult = {
  id: string;
  name: string;
};

function textValue(
  formData: FormData,
  field: string
): string | null {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  return cleaned || null;
}

function numberValue(
  formData: FormData,
  field: string
): number | null {
  const value = textValue(formData, field);

  if (!value) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

async function validateBreederForBreed(
  supabase: Awaited<ReturnType<typeof createClient>>,
  breederId: string | null,
  breedId: string
) {
  if (!breederId) {
    return;
  }

  const { data: breeder, error } = await supabase
    .from("breeders")
    .select("id, breed_id")
    .eq("id", breederId)
    .single();

  if (error || !breeder) {
    throw new Error(
      "The selected breeder was not found."
    );
  }

  if (breeder.breed_id !== breedId) {
    throw new Error(
      "The selected breeder does not belong to the selected breed."
    );
  }
}

export async function createPuppyFromImport(
  formData: FormData
): Promise<ImportResult> {
  const supabase = await createClient();

  const sourceUrl = textValue(
    formData,
    "source_url"
  );

  const name = textValue(formData, "name");

  const breedId = textValue(
    formData,
    "breed_id"
  );

  const breederId = textValue(
    formData,
    "breeder_id"
  );

  if (!sourceUrl) {
    throw new Error(
      "A source website URL is required."
    );
  }

  try {
    const parsedUrl = new URL(sourceUrl);

    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      throw new Error();
    }
  } catch {
    throw new Error(
      "Please enter a valid HTTP or HTTPS source URL."
    );
  }

  if (!name) {
    throw new Error(
      "A puppy name is required."
    );
  }

  if (!breedId) {
    throw new Error(
      "A breed is required."
    );
  }

  const price = numberValue(
    formData,
    "price"
  );

  if (price === null) {
    throw new Error(
      "A valid puppy price is required."
    );
  }

  await validateBreederForBreed(
    supabase,
    breederId,
    breedId
  );

  const description =
    textValue(
      formData,
      "description"
    ) ?? "";

  const finalDescription = description
    ? `${description}\n\nSource listing:\n${sourceUrl}`
    : `Source listing:\n${sourceUrl}`;

  const puppyData = {
    name,
    breed_id: breedId,
    breeder_id: breederId,

    sex: textValue(formData, "sex"),

    price,

    deposit_amount:
      numberValue(
        formData,
        "deposit_amount"
      ) ?? 0,

    description:
      finalDescription,

    status:
      textValue(formData, "status") ??
      "available",

    color:
      textValue(formData, "color"),

    weight_estimate:
      numberValue(
        formData,
        "weight_estimate"
      ),

    markings:
      textValue(formData, "markings"),

    size:
      textValue(formData, "size"),

    generation:
      textValue(formData, "generation"),

    age_weeks:
      numberValue(
        formData,
        "age_weeks"
      ) !== null
        ? Math.round(
            numberValue(
              formData,
              "age_weeks"
            ) as number
          )
        : null,

    litter_id:
      textValue(
        formData,
        "litter_id"
      ),

    ready_date:
      textValue(
        formData,
        "ready_date"
      ),

    vet_checked:
      formData.get(
        "vet_checked"
      ) === "on",

    vaccinated:
      formData.get(
        "vaccinated"
      ) === "on",

    is_published:
      formData.get(
        "is_published"
      ) === "on",

    mom_name:
      textValue(
        formData,
        "mom_name"
      ),

    mom_breed:
      textValue(
        formData,
        "mom_breed"
      ),

    mom_weight:
      textValue(
        formData,
        "mom_weight"
      ),

    mom_registration:
      textValue(
        formData,
        "mom_registration"
      ),

    dad_name:
      textValue(
        formData,
        "dad_name"
      ),

    dad_breed:
      textValue(
        formData,
        "dad_breed"
      ),

    dad_weight:
      textValue(
        formData,
        "dad_weight"
      ),

    dad_registration:
      textValue(
        formData,
        "dad_registration"
      ),
  };

  const {
    data: puppy,
    error,
  } = await supabase
    .from("puppies")
    .insert(puppyData)
    .select("id, name")
    .single();

  if (error || !puppy) {
    throw new Error(
      error?.message ??
        "Failed to create the puppy."
    );
  }

  revalidatePath("/");
  revalidatePath("/puppies");
  revalidatePath("/admin");
  revalidatePath("/admin/puppies");

  return {
    id: puppy.id,
    name: puppy.name,
  };
}