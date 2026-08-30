"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createPuppyFromImport,
  previewPuppyFromUrl,
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

type FormState = {
  sourceUrl: string;
  name: string;
  sex: string;
  price: string;
  depositAmount: string;
  description: string;
  status: string;
  color: string;
  weightEstimate: string;
  markings: string;
  size: string;
  generation: string;
  ageWeeks: string;
  litterId: string;
  readyDate: string;
  breederId: string;

  momName: string;
  momBreed: string;
  momWeight: string;
  momRegistration: string;

  dadName: string;
  dadBreed: string;
  dadWeight: string;
  dadRegistration: string;

  includedItems: string[];

  isPublished: boolean;
  vetChecked: boolean;
  vaccinated: boolean;
};

const EMPTY_FORM: FormState = {
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

  includedItems: [],

  isPublished: false,
  vetChecked: false,
  vaccinated: false,
};

const INCLUDED_OPTIONS = [
  {
    key: "health_commitment",
    label: "10-Year Health Commitment",
  },
  {
    key: "microchip",
    label: "Microchip",
  },
  {
    key: "fully_vetted_breeder",
    label: "Fully Vetted Breeder",
  },
  {
    key: "nose_to_tail_vet_check",
    label:
      "Nose-to-Tail Veterinarian Health Check",
  },
  {
    key: "vaccinations_deworming",
    label:
      "Vaccinations & Deworming",
  },
  {
    key: "vet_records",
    label: "Vet Records",
  },
  {
    key: "white_glove_delivery",
    label:
      "White Glove Delivery Options",
  },
  {
    key: "pet_insurance_discount",
    label:
      "10% Discounted Rate for Pet Insurance",
  },
  {
    key: "registration",
    label: "Registration",
  },
  {
    key:
      "haven_paws_breeder_screening",
    label:
      "Haven Paws Breeder Screening",
  },
  {
    key:
      "secure_traceable_payments",
    label:
      "Secure, Traceable Payments",
  },
];

export default function PuppyUrlImporter({
  breeds = [],
  breeders = [],
}: PuppyUrlImporterProps) {
  const [
    form,
    setForm,
  ] = useState<FormState>(
    EMPTY_FORM
  );

  const [
    breedId,
    setBreedId,
  ] = useState("");

  const [
    isFetching,
    setIsFetching,
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

  const [
    imported,
    setImported,
  ] = useState(false);

  function updateField(
    field: keyof FormState,
    value:
      | string
      | boolean
      | string[]
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  function getBreedersForBreed() {
    if (!breedId) {
      return breeders;
    }

    return breeders.filter(
      (breeder) =>
        breeder.breed_id ===
        breedId
    );
  }

  /*
   * Automatically import when a URL is pasted.
   *
   * The small delay prevents a request for every keystroke.
   */
  useEffect(() => {
    const source =
      form.sourceUrl.trim();

    if (!source) {
      setImported(false);
      return;
    }

    let parsed: URL;

    try {
      parsed = new URL(source);
    } catch {
      setImported(false);
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

    let cancelled = false;

    const timer =
      window.setTimeout(
        async () => {
          setIsFetching(true);
          setError("");
          setMessage("");

          try {
            const details =
              await previewPuppyFromUrl(
                source
              );

            if (cancelled) {
              return;
            }

            setForm(
              (current) => ({
                ...current,

                sourceUrl:
                  source,

                name:
                  details.name ||
                  current.name,

                sex:
                  details.sex ??
                  current.sex,

                price:
                  details.price !==
                  null
                    ? String(
                        details.price
                      )
                    : current.price,

                depositAmount:
                  details.depositAmount !==
                  null
                    ? String(
                        details.depositAmount
                      )
                    : current.depositAmount,

                description:
                  details.description ??
                  current.description,

                status:
                  details.status ??
                  current.status,

                color:
                  details.color ??
                  current.color,

                weightEstimate:
                  details.weightEstimate !==
                  null
                    ? String(
                        details.weightEstimate
                      )
                    : current.weightEstimate,

                markings:
                  details.markings ??
                  current.markings,

                size:
                  details.size ??
                  current.size,

                generation:
                  details.generation ??
                  current.generation,

                ageWeeks:
                  details.ageWeeks !==
                  null
                    ? String(
                        details.ageWeeks
                      )
                    : current.ageWeeks,

                litterId:
                  details.litterId ??
                  current.litterId,

                readyDate:
                  details.readyDate ??
                  current.readyDate,

                momName:
                  details.momName ??
                  current.momName,

                momBreed:
                  details.momBreed ??
                  current.momBreed,

                momWeight:
                  details.momWeight ??
                  current.momWeight,

                momRegistration:
                  details.momRegistration ??
                  current.momRegistration,

                dadName:
                  details.dadName ??
                  current.dadName,

                dadBreed:
                  details.dadBreed ??
                  current.dadBreed,

                dadWeight:
                  details.dadWeight ??
                  current.dadWeight,

                dadRegistration:
                  details.dadRegistration ??
                  current.dadRegistration,

                includedItems:
                  details.includedItems,

              })
            );

            const matchingBreed =
              breeds.find(
                (breed) =>
                  normalize(
                    breed.name
                  ) ===
                    normalize(
                      details.breedName ??
                        ""
                    ) ||
                  normalize(
                    breed.name
                  ).includes(
                    normalize(
                      details.breedName ??
                        ""
                    )
                  ) ||
                  normalize(
                    details.breedName ??
                      ""
                  ).includes(
                    normalize(
                      breed.name
                    )
                  )
              );

            if (
              matchingBreed
            ) {
              setBreedId(
                matchingBreed.id
              );
            }

            setImported(true);

            setMessage(
              "Puppy details imported automatically. Review them below, then save."
            );
          } catch (err) {
            if (cancelled) {
              return;
            }

            setImported(false);

            setError(
              err instanceof Error
                ? err.message
                : "Unable to import this puppy listing."
            );
          } finally {
            if (!cancelled) {
              setIsFetching(false);
            }
          }
        },
        450
      );

    return () => {
      cancelled = true;
      window.clearTimeout(
        timer
      );
    };
  }, [
    form.sourceUrl,
    breeds,
  ]);

  function toggleIncludedItem(
    key: string
  ) {
    setForm(
      (current) => {
        const exists =
          current.includedItems.includes(
            key
          );

        return {
          ...current,
          includedItems:
            exists
              ? current.includedItems.filter(
                  (item) =>
                    item !== key
                )
              : [
                  ...current.includedItems,
                  key,
                ],
        };
      }
    );
  }

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

    if (
      !form.name.trim()
    ) {
      setError(
        "The puppy name could not be imported. Please enter it."
      );
      return;
    }

    if (!breedId) {
      setError(
        "The breed could not be imported. Please select it."
      );
      return;
    }

    if (!form.price.trim()) {
      setError(
        "The puppy price could not be imported. Please enter it."
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

      form.includedItems.forEach(
  (item) => {
    formData.append(
      "included_items",
      item
    );
  }
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
        `Puppy "${result.name}" created successfully.`
      );

      setForm(
        EMPTY_FORM
      );

      setBreedId("");
      setImported(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create the puppy."
      );
    } finally {
      setIsCreating(false);
    }
  }

  const availableBreeders =
    getBreedersForBreed();

  const busy =
    isFetching ||
    isCreating;

  return (
    <section className="mb-8 rounded-xl border border-sage/20 bg-white p-5">
      <p className="eyebrow mb-1">
        Quick Import
      </p>

      <h2 className="font-display text-xl text-forest">
        Import Puppy from Website
      </h2>

      <p className="text-sm text-ink/70 mt-2 mb-6">
        Paste the original puppy listing URL.
        Haven Paws will automatically import the
        available puppy details. Review them, make
        any corrections, then save.
        Images and videos can be added later.
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

          <div className="relative">
            <input
              id="puppy-source-url"
              type="url"
              value={
                form.sourceUrl
              }
              onChange={(
                event
              ) =>
                updateField(
                  "sourceUrl",
                  event.target.value
                )
              }
              placeholder="https://www.puppyspot.com/..."
              disabled={busy}
              className="input-field pr-12"
            />

            {isFetching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="inline-block h-5 w-5 rounded-full border-2 border-sage/30 border-t-forest animate-spin" />
              </div>
            )}
          </div>

          <p className="text-xs text-sage mt-1">
            Paste the URL and wait a moment.
            The puppy details will fill in automatically.
          </p>

          {imported && !isFetching && (
            <p className="text-xs text-forest mt-2 font-medium">
              ✓ Details imported. Review below before saving.
            </p>
          )}
        </div>

        {/* BASIC DETAILS */}

        <div>
          <h3 className="font-display text-lg text-forest mb-3">
            Puppy Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Name *"
              value={form.name}
              onChange={(value) =>
                updateField(
                  "name",
                  value
                )
              }
              placeholder="e.g. Daisy"
              disabled={busy}
            />

            <div>
              <label className="field-label">
                Breed *
              </label>

              <select
                value={breedId}
                onChange={(
                  event
                ) => {
                  setBreedId(
                    event.target.value
                  );

                  updateField(
                    "breederId",
                    ""
                  );
                }}
                disabled={busy}
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
                      {
                        breed.name
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="field-label">
                Sex
              </label>

              <select
                value={form.sex}
                onChange={(
                  event
                ) =>
                  updateField(
                    "sex",
                    event.target.value
                  )
                }
                disabled={busy}
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

            <Field
              label="Price *"
              type="number"
              value={form.price}
              onChange={(value) =>
                updateField(
                  "price",
                  value
                )
              }
              placeholder="2500"
              disabled={busy}
            />

            <Field
              label="Deposit Amount"
              type="number"
              value={
                form.depositAmount
              }
              onChange={(value) =>
                updateField(
                  "depositAmount",
                  value
                )
              }
              placeholder="500"
              disabled={busy}
            />

            <div>
              <label className="field-label">
                Status
              </label>

              <select
                value={
                  form.status
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "status",
                    event.target.value
                  )
                }
                disabled={busy}
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

            <Field
              label="Color"
              value={form.color}
              onChange={(value) =>
                updateField(
                  "color",
                  value
                )
              }
              placeholder="Golden"
              disabled={busy}
            />

            <Field
              label="Weight Estimate"
              type="number"
              value={
                form.weightEstimate
              }
              onChange={(value) =>
                updateField(
                  "weightEstimate",
                  value
                )
              }
              placeholder="25"
              disabled={busy}
            />

            <Field
              label="Markings"
              value={
                form.markings
              }
              onChange={(value) =>
                updateField(
                  "markings",
                  value
                )
              }
              placeholder="White chest"
              disabled={busy}
            />

            <Field
              label="Size"
              value={form.size}
              onChange={(value) =>
                updateField(
                  "size",
                  value
                )
              }
              placeholder="Medium"
              disabled={busy}
            />

            <Field
              label="Generation"
              value={
                form.generation
              }
              onChange={(value) =>
                updateField(
                  "generation",
                  value
                )
              }
              placeholder="F1B"
              disabled={busy}
            />

            <Field
              label="Age (weeks)"
              type="number"
              value={
                form.ageWeeks
              }
              onChange={(value) =>
                updateField(
                  "ageWeeks",
                  value
                )
              }
              placeholder="10"
              disabled={busy}
            />

            <Field
              label="Litter ID"
              value={
                form.litterId
              }
              onChange={(value) =>
                updateField(
                  "litterId",
                  value
                )
              }
              placeholder="Optional"
              disabled={busy}
            />

            <div>
              <label className="field-label">
                Ready Date
              </label>

              <input
                type="date"
                value={
                  form.readyDate
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "readyDate",
                    event.target.value
                  )
                }
                disabled={busy}
                className="input-field"
              />
            </div>

            <div>
              <label className="field-label">
                Breeder
              </label>

              <select
                value={
                  form.breederId
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "breederId",
                    event.target.value
                  )
                }
                disabled={busy}
                className="input-field"
              >
                <option value="">
                  No breeder selected
                </option>

                {availableBreeders.map(
                  (
                    breeder
                  ) => (
                    <option
                      key={
                        breeder.id
                      }
                      value={
                        breeder.id
                      }
                    >
                      {
                        breeder.name
                      }
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="field-label">
            Description
          </label>

          <textarea
            value={
              form.description
            }
            onChange={(
              event
            ) =>
              updateField(
                "description",
                event.target.value
              )
            }
            rows={5}
            placeholder="Imported automatically from the listing..."
            disabled={busy}
            className="input-field"
          />
        </div>

        {/* PARENTS */}

        <div>
          <h3 className="font-display text-lg text-forest mb-3">
            Parents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ParentCard
              title="Mother"
              values={[
                [
                  form.momName,
                  "momName",
                  "Mother's name",
                ],
                [
                  form.momBreed,
                  "momBreed",
                  "Breed",
                ],
                [
                  form.momWeight,
                  "momWeight",
                  "Weight",
                ],
                [
                  form.momRegistration,
                  "momRegistration",
                  "Registration",
                ],
              ]}
              disabled={busy}
              updateField={
                updateField
              }
            />

            <ParentCard
              title="Father"
              values={[
                [
                  form.dadName,
                  "dadName",
                  "Father's name",
                ],
                [
                  form.dadBreed,
                  "dadBreed",
                  "Breed",
                ],
                [
                  form.dadWeight,
                  "dadWeight",
                  "Weight",
                ],
                [
                  form.dadRegistration,
                  "dadRegistration",
                  "Registration",
                ],
              ]}
              disabled={busy}
              updateField={
                updateField
              }
            />
          </div>
        </div>

        {/* WHAT'S INCLUDED */}

        <div>
          <h3 className="font-display text-lg text-forest mb-1">
            What&apos;s Included
          </h3>

          <p className="text-sm text-ink/60 mb-4">
            Imported automatically from the
            puppy listing. Check or uncheck anything
            that needs correction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INCLUDED_OPTIONS.map(
              (item) => (
                <label
                  key={
                    item.key
                  }
                  className="flex items-start gap-3 rounded-lg border border-sage/20 p-3 cursor-pointer hover:bg-sage/5"
                >
                  <input
                    type="checkbox"
                    checked={form.includedItems.includes(
                      item.key
                    )}
                    onChange={() =>
                      toggleIncludedItem(
                        item.key
                      )
                    }
                    disabled={busy}
                    className="mt-1"
                  />

                  <span className="text-sm text-ink/80">
                    {
                      item.label
                    }
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* HEALTH */}

        <div>
          <h3 className="font-display text-lg text-forest mb-3">
            Health & Publishing
          </h3>

          <div className="space-y-3">
            <Check
              label="Vet checked"
              checked={
                form.vetChecked
              }
              onChange={(
                value
              ) =>
                updateField(
                  "vetChecked",
                  value
                )
              }
              disabled={busy}
            />

            <Check
              label="Vaccinated"
              checked={
                form.vaccinated
              }
              onChange={(
                value
              ) =>
                updateField(
                  "vaccinated",
                  value
                )
              }
              disabled={busy}
            />

            <Check
              label="Publish this puppy immediately"
              checked={
                form.isPublished
              }
              onChange={(
                value
              ) =>
                updateField(
                  "isPublished",
                  value
                )
              }
              disabled={busy}
            />
          </div>
        </div>

        {/* SAVE */}

        <button
          type="submit"
          disabled={
            busy ||
            !imported
          }
          className="w-full bg-forest text-cream py-3 rounded-full hover:bg-forest-light transition-colors disabled:opacity-50"
        >
          {isCreating
            ? "Saving Puppy..."
            : isFetching
              ? "Importing Puppy Details..."
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
          padding: 0.625rem 0.75rem;
          background: white;
          color: #183f38;
        }

        .input-field:focus {
          outline: none;
          border-color: rgb(201 160 75);
          box-shadow: 0 0 0 2px rgb(201 160 75 / 0.08);
        }

        .field-label {
          display: block;
          font-size: 0.875rem;
          color: rgb(24 63 56 / 0.8);
          margin-bottom: 0.25rem;
        }
      `}</style>
    </section>
  );
}

function normalize(
  value: string
): string {
  return value
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      ""
    );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="field-label">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        disabled={disabled}
        className="input-field"
      />
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
        disabled={disabled}
      />

      {label}
    </label>
  );
}

function ParentCard({
  title,
  values,
  disabled,
  updateField,
}: {
  title: string;
  values: Array<
    [
      string,
      keyof FormState,
      string
    ]
  >;
  disabled: boolean;
  updateField: (
    field: keyof FormState,
    value:
      | string
      | boolean
      | string[]
  ) => void;
}) {
  return (
    <div className="border border-sage/20 rounded-lg p-4">
      <p className="font-medium text-forest mb-3">
        {title}
      </p>

      <div className="space-y-3">
        {values.map(
          ([
            value,
            field,
            placeholder,
          ]) => (
            <input
              key={
                String(field)
              }
              value={value}
              onChange={(event) =>
                updateField(
                  field,
                  event.target.value
                )
              }
              placeholder={
                placeholder
              }
              disabled={
                disabled
              }
              className="input-field"
            />
          )
        )}
      </div>
    </div>
  );
}