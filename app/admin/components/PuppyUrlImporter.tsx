"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createPuppyFromImport,
  lookupPuppyFromUrl,
  type PuppyImportDraft,
} from "../puppies/import-actions";

type Breed = {
  id: string;
  name: string;
};

type Breeder = {
  id: string;
  name: string;
  breed_id: string | null;
};

type PuppyUrlImporterProps = {
  breeds?: Breed[];
  breeders?: Breeder[];
};

type FormState = Omit<
  PuppyImportDraft,
  "breedName" | "breederName"
> & {
  breedId: string;
  breederId: string;
};

const emptyForm: FormState = {
  sourceUrl: "",
  name: "",
  breedId: "",
  sex: "",
  price: "",
  depositAmount: "",
  description: "",
  status: "available",
  color: "",
  weightEstimate: "",
  markings: "",
  size: "",
  generation: "",
  ageWeeks: "",
  litterId: "",
  readyDate: "",

  breederId: "",

  momName: "",
  momBreed: "",
  momWeight: "",
  momRegistration: "",

  dadName: "",
  dadBreed: "",
  dadWeight: "",
  dadRegistration: "",

  vetChecked: false,
  vaccinated: false,
  isPublished: false,
};

export default function PuppyUrlImporter({
  breeds = [],
  breeders = [],
}: PuppyUrlImporterProps) {
  const [form, setForm] =
    useState<FormState>(
      emptyForm
    );

  const [
    isLookingUp,
    setIsLookingUp,
  ] = useState(false);

  const [
    isCreating,
    setIsCreating,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const lookupTimer =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const lastLookupUrl =
    useRef("");

  function updateField<
    K extends keyof FormState
  >(
    field: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function findBreedId(
    breedName: string
  ) {
    const wanted =
      breedName
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          ""
        );

    const match =
      breeds.find(
        (breed) => {
          const existing =
            breed.name
              .toLowerCase()
              .replace(
                /[^a-z0-9]+/g,
                ""
              );

          return (
            existing === wanted ||
            existing.includes(
              wanted
            ) ||
            wanted.includes(
              existing
            )
          );
        }
      );

    return match?.id ?? "";
  }

  function findBreederId(
    breederName: string,
    breedId: string
  ) {
    if (!breederName) {
      return "";
    }

    const wanted =
      breederName
        .toLowerCase()
        .trim();

    const match =
      breeders.find(
        (breeder) => {
          const sameName =
            breeder.name
              .toLowerCase()
              .trim() ===
            wanted;

          const sameBreed =
            !breedId ||
            breeder.breed_id ===
              breedId;

          return (
            sameName &&
            sameBreed
          );
        }
      );

    return match?.id ?? "";
  }

  function applyDraft(
    draft: PuppyImportDraft
  ) {
    const matchedBreedId =
      findBreedId(
        draft.breedName
      );

    const matchedBreederId =
      findBreederId(
        draft.breederName,
        matchedBreedId
      );

    setForm({
      sourceUrl:
        draft.sourceUrl,

      name:
        draft.name,

      breedId:
        matchedBreedId,

      sex:
        draft.sex,

      price:
        draft.price,

      depositAmount:
        draft.depositAmount,

      description:
        draft.description,

      status:
        draft.status,

      color:
        draft.color,

      weightEstimate:
        draft.weightEstimate,

      markings:
        draft.markings,

      size:
        draft.size,

      generation:
        draft.generation,

      ageWeeks:
        draft.ageWeeks,

      litterId:
        draft.litterId,

      readyDate:
        draft.readyDate,

      breederId:
        matchedBreederId,

      momName:
        draft.momName,

      momBreed:
        draft.momBreed,

      momWeight:
        draft.momWeight,

      momRegistration:
        draft.momRegistration,

      dadName:
        draft.dadName,

      dadBreed:
        draft.dadBreed,

      dadWeight:
        draft.dadWeight,

      dadRegistration:
        draft.dadRegistration,

      vetChecked:
        draft.vetChecked,

      vaccinated:
        draft.vaccinated,

      isPublished:
        false,
    });

    if (
      draft.breedName &&
      !matchedBreedId
    ) {
      setError(
        `The puppy was imported, but "${draft.breedName}" does not yet exist in your Haven Paws breed list.`
      );
    } else if (
      draft.breederName &&
      !matchedBreederId
    ) {
      setError(
        `Puppy details were imported. Breeder "${draft.breederName}" was found on the source page but was not matched to a Haven Paws breeder.`
      );
    } else {
      setError("");
    }

    setMessage(
      `✓ Puppy information found. Review the fields below and click "Save Puppy".`
    );
  }

  async function lookupUrl(
    url: string
  ) {
    const trimmed =
      url.trim();

    if (!trimmed) {
      return;
    }

    let parsed: URL;

    try {
      parsed =
        new URL(trimmed);
    } catch {
      return;
    }

    if (
      parsed.protocol !==
        "http:" &&
      parsed.protocol !==
        "https:"
    ) {
      return;
    }

    if (
      lastLookupUrl.current ===
      trimmed
    ) {
      return;
    }

    lastLookupUrl.current =
      trimmed;

    setIsLookingUp(true);
    setMessage(
      "Reading puppy listing..."
    );
    setError("");

    try {
      const draft =
        await lookupPuppyFromUrl(
          trimmed
        );

      applyDraft(draft);
    } catch (err) {
      lastLookupUrl.current =
        "";

      setMessage("");

      setError(
        err instanceof Error
          ? err.message
          : "Unable to read the puppy listing."
      );
    } finally {
      setIsLookingUp(false);
    }
  }

  function handleUrlChange(
    value: string
  ) {
    updateField(
      "sourceUrl",
      value
    );

    setMessage("");
    setError("");

    lastLookupUrl.current =
      "";

    if (lookupTimer.current) {
      clearTimeout(
        lookupTimer.current
      );
    }

    const trimmed =
      value.trim();

    if (!trimmed) {
      return;
    }

    try {
      const parsed =
        new URL(trimmed);

      if (
        parsed.protocol !==
          "http:" &&
        parsed.protocol !==
          "https:"
      ) {
        return;
      }
    } catch {
      return;
    }

    /*
     * This is what makes the URL the trigger.
     *
     * The user does not need to click
     * "Import Puppy".
     */
    lookupTimer.current =
      setTimeout(() => {
        void lookupUrl(
          trimmed
        );
      }, 700);
  }

  useEffect(() => {
    return () => {
      if (
        lookupTimer.current
      ) {
        clearTimeout(
          lookupTimer.current
        );
      }
    };
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !form.sourceUrl.trim()
    ) {
      setError(
        "Please paste the puppy listing URL."
      );
      return;
    }

    if (!form.name.trim()) {
      setError(
        "The puppy information has not been imported yet."
      );
      return;
    }

    if (!form.breedId) {
      setError(
        "Please select a matching Haven Paws breed."
      );
      return;
    }

    if (!form.price.trim()) {
      setError(
        "The puppy price was not found. Please enter it."
      );
      return;
    }

    setIsCreating(true);

    try {
      const formData =
        new FormData();

      formData.set(
        "source_url",
        form.sourceUrl.trim()
      );

      formData.set(
        "name",
        form.name.trim()
      );

      formData.set(
        "breed_id",
        form.breedId
      );

      formData.set(
        "breeder_id",
        form.breederId
      );

      formData.set(
        "sex",
        form.sex
      );

      formData.set(
        "price",
        form.price
      );

      formData.set(
        "deposit_amount",
        form.depositAmount
      );

      formData.set(
        "description",
        form.description
      );

      formData.set(
        "status",
        form.status
      );

      formData.set(
        "color",
        form.color
      );

      formData.set(
        "weight_estimate",
        form.weightEstimate
      );

      formData.set(
        "markings",
        form.markings
      );

      formData.set(
        "size",
        form.size
      );

      formData.set(
        "generation",
        form.generation
      );

      formData.set(
        "age_weeks",
        form.ageWeeks
      );

      formData.set(
        "litter_id",
        form.litterId
      );

      formData.set(
        "ready_date",
        form.readyDate
      );

      formData.set(
        "mom_name",
        form.momName
      );

      formData.set(
        "mom_breed",
        form.momBreed
      );

      formData.set(
        "mom_weight",
        form.momWeight
      );

      formData.set(
        "mom_registration",
        form.momRegistration
      );

      formData.set(
        "dad_name",
        form.dadName
      );

      formData.set(
        "dad_breed",
        form.dadBreed
      );

      formData.set(
        "dad_weight",
        form.dadWeight
      );

      formData.set(
        "dad_registration",
        form.dadRegistration
      );

      if (
        form.isPublished
      ) {
        formData.set(
          "is_published",
          "on"
        );
      }

      if (
        form.vetChecked
      ) {
        formData.set(
          "vet_checked",
          "on"
        );
      }

      if (
        form.vaccinated
      ) {
        formData.set(
          "vaccinated",
          "on"
        );
      }

      const result =
        await createPuppyFromImport(
          formData
        );

      setMessage(
        `✓ Puppy "${result.name}" was saved successfully.`
      );

      setForm(
        emptyForm
      );

      lastLookupUrl.current =
        "";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the puppy."
      );
    } finally {
      setIsCreating(false);
    }
  }

  const availableBreeders =
    form.breedId
      ? breeders.filter(
          (breeder) =>
            breeder.breed_id ===
            form.breedId
        )
      : breeders;

  return (
    <section className="mb-8 rounded-xl border border-sage/20 bg-white p-5">
      <p className="eyebrow mb-1">
        Quick Import
      </p>

      <h2 className="font-display text-xl text-forest">
        Import Puppy from Website
      </h2>

      <p className="text-sm text-ink/70 mt-2 mb-6">
        Paste a PuppySpot listing URL.
        Haven Paws will automatically
        read the listing and fill the
        puppy details for you. Review
        everything before saving.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* URL */}

        <div>
          <label
            htmlFor="puppy-source-url"
            className="block text-sm font-medium text-ink mb-1"
          >
            Original Puppy Listing URL *
          </label>

          <input
            id="puppy-source-url"
            type="url"
            value={
              form.sourceUrl
            }
            onChange={(event) =>
              handleUrlChange(
                event.target.value
              )
            }
            placeholder="https://www.puppyspot.com/puppies-for-sale-by-breeders/breed/goldendoodle/puppy/826779"
            disabled={
              isCreating ||
              isLookingUp
            }
            className="w-full border border-sage/30 rounded-md px-3 py-3 focus:outline-none focus:border-gold"
          />

          <p className="text-xs text-sage mt-1">
            Paste the URL and wait a
            moment. The details will
            populate automatically.
          </p>

          {isLookingUp && (
            <div className="mt-3 rounded-md bg-gold/10 border border-gold/30 px-3 py-3">
              <p className="text-sm text-forest">
                Reading the puppy listing
                and filling the form...
              </p>
            </div>
          )}
        </div>

        {/* BASIC DETAILS */}

        <div>
          <h3 className="font-display text-lg text-forest mb-3">
            Puppy Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Name *
              </label>

              <input
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                placeholder="e.g. Daisy"
                disabled={
                  isCreating
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Breed *
              </label>

              <select
                value={
                  form.breedId
                }
                onChange={(event) => {
                  updateField(
                    "breedId",
                    event.target.value
                  );

                  updateField(
                    "breederId",
                    ""
                  );
                }}
                disabled={
                  isCreating
                }
                className="input-field"
              >
                <option value="">
                  Select breed
                </option>

                {breeds.map(
                  (breed) => (
                    <option
                      key={
                        breed.id
                      }
                      value={
                        breed.id
                      }
                    >
                      {breed.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Sex
              </label>

              <select
                value={
                  form.sex
                }
                onChange={(event) =>
                  updateField(
                    "sex",
                    event.target.value
                  )
                }
                disabled={
                  isCreating
                }
                className="input-field"
              >
                <option value="">
                  Select sex
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Price *
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  form.price
                }
                onChange={(event) =>
                  updateField(
                    "price",
                    event.target.value
                  )
                }
                placeholder="2500"
                disabled={
                  isCreating
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Deposit Amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  form.depositAmount
                }
                onChange={(event) =>
                  updateField(
                    "depositAmount",
                    event.target.value
                  )
                }
                placeholder="500"
                disabled={
                  isCreating
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Status
              </label>

              <select
                value={
                  form.status
                }
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value
                  )
                }
                disabled={
                  isCreating
                }
                className="input-field"
              >
                <option value="available">
                  Available
                </option>

                <option value="reserved">
                  Reserved
                </option>

                <option value="sold">
                  Sold
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Color
              </label>

              <input
                value={
                  form.color
                }
                onChange={(event) =>
                  updateField(
                    "color",
                    event.target.value
                  )
                }
                placeholder="Golden"
                disabled={
                  isCreating
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Weight Estimate
              </label>

              <input
                type="number"
                step="0.1"
                value={
                  form.weightEstimate
                }
                onChange={(event) =>
                  updateField(
                    "weightEstimate",
                    event.target.value
                  )
                }
                placeholder="25"
                disabled={
                  isCreating
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Markings
              </label>

              <input
                value={
                  form.markings
                }
                onChange={(event) =>
                  updateField(
                    "markings",
                    event.target.value
                  )
                }
                placeholder="White chest"
                disabled={
                  isCreating
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Size
              </label>

              <input
                value={
                  form.size
                }
                onChange={(event) =>
                  updateField(
                    "size",
                    event.target.value
                  )
                }
                placeholder="Medium"
                disabled={
                  isCreating
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Generation
              </label>

              <input
                value={
                  form.generation
                }
                onChange={(event) =>
                  updateField(
                    "generation",
                    event.target.value
                  )
                }
                placeholder="F1B"
                disabled={
                  isCreating
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Age (weeks)
              </label>

              <input
                type="number"
                min="0"
                value={
                  form.ageWeeks
                }
                onChange={(event) =>
                  updateField(
                    "ageWeeks",
                    event.target.value
                  )
                }
                placeholder="10"
                disabled={
                  isCreating
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Litter ID
              </label>

              <input
                value={
                  form.litterId
                }
                onChange={(event) =>
                  updateField(
                    "litterId",
                    event.target.value
                  )
                }
                placeholder="Optional"
                disabled={
                  isCreating
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Ready Date
              </label>

              <input
                type="date"
                value={
                  form.readyDate
                }
                onChange={(event) =>
                  updateField(
                    "readyDate",
                    event.target.value
                  )
                }
                disabled={
                  isCreating
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Breeder
              </label>

              <select
                value={
                  form.breederId
                }
                onChange={(event) =>
                  updateField(
                    "breederId",
                    event.target.value
                  )
                }
                disabled={
                  isCreating
                }
                className="input-field"
              >
                <option value="">
                  No breeder selected
                </option>

                {availableBreeders.map(
                  (breeder) => (
                    <option
                      key={
                        breeder.id
                      }
                      value={
                        breeder.id
                      }
                    >
                      {breeder.name}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="block text-sm text-ink/80 mb-1">
            Description
          </label>

          <textarea
            value={
              form.description
            }
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
            rows={6}
            placeholder="The puppy description will appear here automatically."
            disabled={
              isCreating
            }
            className="input-field"
          />
        </div>

        {/* PARENTS */}

        <div>
          <h3 className="font-display text-lg text-forest mb-3">
            Parents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-sage/20 rounded-lg p-4">
              <p className="font-medium text-forest mb-3">
                Mother
              </p>

              <div className="space-y-3">
                <input
                  value={
                    form.momName
                  }
                  onChange={(event) =>
                    updateField(
                      "momName",
                      event.target.value
                    )
                  }
                  placeholder="Mother's name"
                  disabled={
                    isCreating
                  }
                  className="input-field"
                />

                <input
                  value={
                    form.momBreed
                  }
                  onChange={(event) =>
                    updateField(
                      "momBreed",
                      event.target.value
                    )
                  }
                  placeholder="Breed"
                  disabled={
                    isCreating
                  }
                  className="input-field"
                />

                <input
                  value={
                    form.momWeight
                  }
                  onChange={(event) =>
                    updateField(
                      "momWeight",
                      event.target.value
                    )
                  }
                  placeholder="Weight"
                  disabled={
                    isCreating
                  }
                  className="input-field"
                />

                <input
                  value={
                    form.momRegistration
                  }
                  onChange={(event) =>
                    updateField(
                      "momRegistration",
                      event.target.value
                    )
                  }
                  placeholder="Registration"
                  disabled={
                    isCreating
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div className="border border-sage/20 rounded-lg p-4">
              <p className="font-medium text-forest mb-3">
                Father
              </p>

              <div className="space-y-3">
                <input
                  value={
                    form.dadName
                  }
                  onChange={(event) =>
                    updateField(
                      "dadName",
                      event.target.value
                    )
                  }
                  placeholder="Father's name"
                  disabled={
                    isCreating
                  }
                  className="input-field"
                />

                <input
                  value={
                    form.dadBreed
                  }
                  onChange={(event) =>
                    updateField(
                      "dadBreed",
                      event.target.value
                    )
                  }
                  placeholder="Breed"
                  disabled={
                    isCreating
                  }
                  className="input-field"
                />

                <input
                  value={
                    form.dadWeight
                  }
                  onChange={(event) =>
                    updateField(
                      "dadWeight",
                      event.target.value
                    )
                  }
                  placeholder="Weight"
                  disabled={
                    isCreating
                  }
                  className="input-field"
                />

                <input
                  value={
                    form.dadRegistration
                  }
                  onChange={(event) =>
                    updateField(
                      "dadRegistration",
                      event.target.value
                    )
                  }
                  placeholder="Registration"
                  disabled={
                    isCreating
                  }
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* HEALTH */}

        <div>
          <h3 className="font-display text-lg text-forest mb-3">
            Health & Publishing
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={
                  form.vetChecked
                }
                onChange={(event) =>
                  updateField(
                    "vetChecked",
                    event.target.checked
                  )
                }
                disabled={
                  isCreating
                }
              />

              Vet checked
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={
                  form.vaccinated
                }
                onChange={(event) =>
                  updateField(
                    "vaccinated",
                    event.target.checked
                  )
                }
                disabled={
                  isCreating
                }
              />

              Vaccinated
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={
                  form.isPublished
                }
                onChange={(event) =>
                  updateField(
                    "isPublished",
                    event.target.checked
                  )
                }
                disabled={
                  isCreating
                }
              />

              Publish this puppy immediately
            </label>
          </div>
        </div>

        {/* SAVE */}

        <button
          type="submit"
          disabled={
            isCreating ||
            isLookingUp
          }
          className="w-full bg-forest text-cream py-3 rounded-full hover:bg-forest-light transition-colors disabled:opacity-50"
        >
          {isCreating
            ? "Saving Puppy..."
            : "Save Puppy"}
        </button>
      </form>

      {message && (
        <div className="mt-4 rounded-md bg-forest/5 border border-forest/20 px-3 py-2">
          <p className="text-sm text-forest">
            {message}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-3 py-2">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      <style jsx>{`
        .input-field {
          width: 100%;
          border: 1px solid rgb(112 145 132 / 0.3);
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          background: white;
        }

        .input-field:focus {
          outline: none;
          border-color: rgb(201 160 75);
        }
      `}</style>
    </section>
  );
}