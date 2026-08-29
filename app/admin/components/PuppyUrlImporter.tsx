"use client";

import { useState } from "react";
import { createPuppyFromImport } from "../puppies/import-actions";

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

const initialForm = {
  sourceUrl: "",
  name: "",
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
  isPublished: false,
  vetChecked: false,
  vaccinated: false,
};

export default function PuppyUrlImporter({
  breeds = [],
  breeders = [],
}: PuppyUrlImporterProps) {
  const [isCreating, setIsCreating] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [breedId, setBreedId] =
    useState("");

  const [form, setForm] =
    useState(initialForm);

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function getBreedersForBreed() {
    if (!breedId) {
      return breeders;
    }

    return breeders.filter(
      (breeder) =>
        breeder.breed_id === breedId
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    /*
     * SOURCE URL
     */
    const sourceUrl =
      form.sourceUrl.trim();

    if (!sourceUrl) {
      setError(
        "Please paste the original puppy listing URL."
      );
      return;
    }

    try {
      const parsed =
        new URL(sourceUrl);

      if (
        parsed.protocol !== "http:" &&
        parsed.protocol !== "https:"
      ) {
        setError(
          "Please enter a valid HTTP or HTTPS URL."
        );
        return;
      }
    } catch {
      setError(
        "Please enter a valid puppy listing URL."
      );
      return;
    }

    /*
     * NAME
     */
    if (!form.name.trim()) {
      setError(
        "Please enter the puppy's name."
      );
      return;
    }

    /*
     * BREED
     */
    if (!breedId) {
      setError(
        "Please select a breed."
      );
      return;
    }

    /*
     * PRICE
     */
    if (!form.price.trim()) {
      setError(
        "Please enter the puppy's price."
      );
      return;
    }

    const price =
      Number(form.price);

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError(
        "Please enter a valid puppy price."
      );
      return;
    }

    setIsCreating(true);

    try {
      const formData =
        new FormData();

      /*
       * SOURCE
       */
      formData.set(
        "source_url",
        sourceUrl
      );

      /*
       * BASIC DETAILS
       */
      formData.set(
        "name",
        form.name.trim()
      );

      formData.set(
        "breed_id",
        breedId
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

      /*
       * MOTHER
       */
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

      /*
       * FATHER
       */
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

      /*
       * CHECKBOXES
       */
      if (form.isPublished) {
        formData.set(
          "is_published",
          "on"
        );
      }

      if (form.vetChecked) {
        formData.set(
          "vet_checked",
          "on"
        );
      }

      if (form.vaccinated) {
        formData.set(
          "vaccinated",
          "on"
        );
      }

      /*
       * CREATE / IMPORT
       */
      const result =
        await createPuppyFromImport(
          formData
        );

      setMessage(
        `Puppy "${result.name}" imported successfully.`
      );

      /*
       * RESET FORM
       */
      setForm(initialForm);

      setBreedId("");

      /*
       * Scroll back to top of importer
       */
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to import the puppy."
      );
    } finally {
      setIsCreating(false);
    }
  }

  const availableBreeders =
    getBreedersForBreed();

  return (
    <section className="mb-8 rounded-xl border border-sage/20 bg-white p-5">
      {/* HEADER */}

      <p className="eyebrow mb-1">
        Quick Import
      </p>

      <h2 className="font-display text-xl text-forest">
        Import Puppy from Website
      </h2>

      <p className="text-sm text-ink/70 mt-2 mb-6">
        Paste the original puppy listing
        URL, then enter the puppy details
        below. The website is not scraped.
        Images and videos can be added later.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* SOURCE URL */}

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
            value={form.sourceUrl}
            onChange={(event) =>
              updateField(
                "sourceUrl",
                event.target.value
              )
            }
            placeholder="https://www.puppyspot.com/puppies-for-sale-by-breeders/..."
            disabled={isCreating}
            className="input-field"
          />

          <p className="text-xs text-sage mt-1">
            This URL is saved as the source
            reference. Haven Paws does not
            attempt to open or scrape the
            website.
          </p>
        </div>

        {/* BASIC DETAILS */}

        <div>
          <h3 className="font-display text-lg text-forest mb-3">
            Puppy Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAME */}

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
                disabled={isCreating}
                className="input-field"
              />
            </div>

            {/* BREED */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Breed *
              </label>

              <select
                value={breedId}
                onChange={(event) => {
                  setBreedId(
                    event.target.value
                  );

                  updateField(
                    "breederId",
                    ""
                  );
                }}
                disabled={isCreating}
                className="input-field"
              >
                <option value="">
                  Select breed
                </option>

                {breeds.map((breed) => (
                  <option
                    key={breed.id}
                    value={breed.id}
                  >
                    {breed.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SEX */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Sex
              </label>

              <select
                value={form.sex}
                onChange={(event) =>
                  updateField(
                    "sex",
                    event.target.value
                  )
                }
                disabled={isCreating}
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

            {/* PRICE */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Price *
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  updateField(
                    "price",
                    event.target.value
                  )
                }
                placeholder="2500"
                disabled={isCreating}
                className="input-field"
              />
            </div>

            {/* DEPOSIT */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Deposit Amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.depositAmount}
                onChange={(event) =>
                  updateField(
                    "depositAmount",
                    event.target.value
                  )
                }
                placeholder="500"
                disabled={isCreating}
                className="input-field"
              />
            </div>

            {/* STATUS */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value
                  )
                }
                disabled={isCreating}
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

            {/* COLOR */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Color
              </label>

              <input
                value={form.color}
                onChange={(event) =>
                  updateField(
                    "color",
                    event.target.value
                  )
                }
                placeholder="Golden"
                disabled={isCreating}
                className="input-field"
              />
            </div>

            {/* WEIGHT */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Weight Estimate
              </label>

              <input
                type="number"
                step="0.1"
                min="0"
                value={form.weightEstimate}
                onChange={(event) =>
                  updateField(
                    "weightEstimate",
                    event.target.value
                  )
                }
                placeholder="25"
                disabled={isCreating}
                className="input-field"
              />
            </div>

            {/* MARKINGS */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Markings
              </label>

              <input
                value={form.markings}
                onChange={(event) =>
                  updateField(
                    "markings",
                    event.target.value
                  )
                }
                placeholder="White chest"
                disabled={isCreating}
                className="input-field"
              />
            </div>

            {/* SIZE */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Size
              </label>

              <input
                value={form.size}
                onChange={(event) =>
                  updateField(
                    "size",
                    event.target.value
                  )
                }
                placeholder="Medium"
                disabled={isCreating}
                className="input-field"
              />
            </div>

            {/* GENERATION */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Generation
              </label>

              <input
                value={form.generation}
                onChange={(event) =>
                  updateField(
                    "generation",
                    event.target.value
                  )
                }
                placeholder="F1B"
                disabled={isCreating}
                className="input-field"
              />
            </div>

            {/* AGE */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Age (weeks)
              </label>

              <input
                type="number"
                min="0"
                value={form.ageWeeks}
                onChange={(event) =>
                  updateField(
                    "ageWeeks",
                    event.target.value
                  )
                }
                placeholder="10"
                disabled={isCreating}
                className="input-field"
              />
            </div>

            {/* LITTER */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Litter ID
              </label>

              <input
                value={form.litterId}
                onChange={(event) =>
                  updateField(
                    "litterId",
                    event.target.value
                  )
                }
                placeholder="Optional"
                disabled={isCreating}
                className="input-field"
              />
            </div>

            {/* READY DATE */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Ready Date
              </label>

              <input
                type="date"
                value={form.readyDate}
                onChange={(event) =>
                  updateField(
                    "readyDate",
                    event.target.value
                  )
                }
                disabled={isCreating}
                className="input-field"
              />
            </div>

            {/* BREEDER */}

            <div>
              <label className="block text-sm text-ink/80 mb-1">
                Breeder
              </label>

              <select
                value={form.breederId}
                onChange={(event) =>
                  updateField(
                    "breederId",
                    event.target.value
                  )
                }
                disabled={
                  isCreating ||
                  !breedId
                }
                className="input-field"
              >
                <option value="">
                  No breeder selected
                </option>

                {availableBreeders.map(
                  (breeder) => (
                    <option
                      key={breeder.id}
                      value={breeder.id}
                    >
                      {breeder.name}
                    </option>
                  )
                )}
              </select>

              {!breedId && (
                <p className="text-xs text-sage mt-1">
                  Select a breed first.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="block text-sm text-ink/80 mb-1">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
            rows={5}
            placeholder="Enter the puppy's description..."
            disabled={isCreating}
            className="input-field"
          />
        </div>

        {/* PARENTS */}

        <div>
          <h3 className="font-display text-lg text-forest mb-3">
            Parents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MOTHER */}

            <div className="border border-sage/20 rounded-lg p-4">
              <p className="font-medium text-forest mb-3">
                Mother
              </p>

              <div className="space-y-3">
                <input
                  value={form.momName}
                  onChange={(event) =>
                    updateField(
                      "momName",
                      event.target.value
                    )
                  }
                  placeholder="Mother's name"
                  disabled={isCreating}
                  className="input-field"
                />

                <input
                  value={form.momBreed}
                  onChange={(event) =>
                    updateField(
                      "momBreed",
                      event.target.value
                    )
                  }
                  placeholder="Breed"
                  disabled={isCreating}
                  className="input-field"
                />

                <input
                  value={form.momWeight}
                  onChange={(event) =>
                    updateField(
                      "momWeight",
                      event.target.value
                    )
                  }
                  placeholder="Weight"
                  disabled={isCreating}
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
                  disabled={isCreating}
                  className="input-field"
                />
              </div>
            </div>

            {/* FATHER */}

            <div className="border border-sage/20 rounded-lg p-4">
              <p className="font-medium text-forest mb-3">
                Father
              </p>

              <div className="space-y-3">
                <input
                  value={form.dadName}
                  onChange={(event) =>
                    updateField(
                      "dadName",
                      event.target.value
                    )
                  }
                  placeholder="Father's name"
                  disabled={isCreating}
                  className="input-field"
                />

                <input
                  value={form.dadBreed}
                  onChange={(event) =>
                    updateField(
                      "dadBreed",
                      event.target.value
                    )
                  }
                  placeholder="Breed"
                  disabled={isCreating}
                  className="input-field"
                />

                <input
                  value={form.dadWeight}
                  onChange={(event) =>
                    updateField(
                      "dadWeight",
                      event.target.value
                    )
                  }
                  placeholder="Weight"
                  disabled={isCreating}
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
                  disabled={isCreating}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* HEALTH & PUBLISHING */}

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
                disabled={isCreating}
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
                disabled={isCreating}
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
                disabled={isCreating}
              />

              Publish this puppy immediately
            </label>
          </div>
        </div>

        {/* IMPORT BUTTON */}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-forest text-cream py-4 rounded-full hover:bg-forest-light transition-colors disabled:opacity-50 font-medium"
          >
            {isCreating
              ? "Importing Puppy..."
              : "Import Puppy"}
          </button>

          <p className="text-center text-xs text-sage mt-2">
            This creates the puppy using
            the details entered above. No
            external website is scraped.
          </p>
        </div>
      </form>

      {/* SUCCESS */}

      {message && (
        <div className="mt-4 rounded-md bg-forest/5 border border-forest/20 px-3 py-3">
          <p className="text-sm text-forest font-medium">
            {message}
          </p>
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-3 py-3">
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
          padding: 0.65rem 0.75rem;
          background: white;
          color: #173f38;
        }

        .input-field:focus {
          outline: none;
          border-color: rgb(201 160 75);
          box-shadow: 0 0 0 2px rgb(201 160 75 / 0.12);
        }

        .input-field:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}