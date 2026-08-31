"use client";

import { useEffect, useMemo, useState } from "react";
import IncludedItemsPicker from "./IncludedItemsPicker";
import type { IncludedItemKey } from "@/lib/includedItems";

type Breed = {
  id: string;
  name: string;
};

type BreederOption = {
  id: string;
  name: string;
  breed_id: string | null;
};

type PuppyData = {
  id?: string;
  name?: string;
  breed_id?: string;
  breeder_id?: string | null;
  sex?: string;
  price?: number;
  weight_estimate?: number;
  age_weeks?: number;
  markings?: string;
  size?: string;
  generation?: string;
  ready_date?: string;
  litter_id?: string;
  description?: string;
  status?: string;
  vet_checked?: boolean;
  vaccinated?: boolean;
  included_items?: IncludedItemKey[];
};

type PuppyFormProps = {
  breeds: Breed[];
  breeders: BreederOption[];
  puppy?: PuppyData;
  action: (formData: FormData) => void | Promise<void>;
  litterIds?: string[];
};

const inputClass =
  "w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

export default function PuppyForm({
  breeds,
  breeders,
  puppy,
  action,
  litterIds = [],
}: PuppyFormProps) {
  const labelClass = "block text-sm text-ink/80 mb-1 mt-4";

  const [selectedBreedId, setSelectedBreedId] = useState(
    puppy?.breed_id ?? ""
  );

  const [selectedBreederId, setSelectedBreederId] = useState(
    puppy?.breeder_id ?? ""
  );

  const filteredBreeders = useMemo(() => {
    if (!selectedBreedId) return [];

    return breeders.filter(
      (breeder) => breeder.breed_id === selectedBreedId
    );
  }, [breeders, selectedBreedId]);

  useEffect(() => {
    // If the currently selected breeder is not assigned to the
    // selected breed, clear the breeder selection.
    if (
      selectedBreederId &&
      !filteredBreeders.some((breeder) => breeder.id === selectedBreederId)
    ) {
      setSelectedBreederId("");
    }
  }, [filteredBreeders, selectedBreederId]);

  function handleBreedChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const breedId = event.target.value;

    setSelectedBreedId(breedId);
    setSelectedBreederId("");
  }

  return (
    <form action={action} className="pb-10">
      <label className={labelClass}>Name</label>
      <input
        name="name"
        defaultValue={puppy?.name ?? ""}
        required
        className={inputClass}
      />

      <label className={labelClass}>Breed</label>
      <select
        name="breed_id"
        value={selectedBreedId}
        onChange={handleBreedChange}
        required
        className={inputClass}
      >
        <option value="">Select a breed</option>

        {breeds.map((breed) => (
          <option key={breed.id} value={breed.id}>
            {breed.name}
          </option>
        ))}
      </select>

      <label className={labelClass}>Breeder (optional)</label>
      <select
        name="breeder_id"
        value={selectedBreederId}
        onChange={(event) => setSelectedBreederId(event.target.value)}
        className={inputClass}
        disabled={!selectedBreedId}
      >
        <option value="">
          {!selectedBreedId
            ? "Select a breed first"
            : filteredBreeders.length === 0
              ? "No breeders for this breed"
              : "No breeder selected"}
        </option>

        {filteredBreeders.map((breeder) => (
          <option key={breeder.id} value={breeder.id}>
            {breeder.name}
          </option>
        ))}
      </select>

      {selectedBreedId && filteredBreeders.length === 0 && (
        <p className="text-xs text-sage mt-1">
          No breeder profiles are currently assigned to this breed.
        </p>
      )}

      <label className={labelClass}>Gender</label>
      <select
        name="sex"
        defaultValue={puppy?.sex ?? ""}
        required
        className={inputClass}
      >
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <label className={labelClass}>Price ($)</label>
      <input
        name="price"
        type="number"
        step="0.01"
        defaultValue={puppy?.price ?? ""}
        className={inputClass}
      />

      <label className={labelClass}>Weight Estimate (lbs)</label>
      <input
        name="weight_estimate"
        type="number"
        step="0.1"
        defaultValue={puppy?.weight_estimate ?? ""}
        className={inputClass}
      />

      <label className={labelClass}>Age (weeks)</label>
      <input
        name="age_weeks"
        type="number"
        min="0"
        defaultValue={puppy?.age_weeks ?? ""}
        className={inputClass}
      />
      <p className="text-xs text-sage mt-1">
        Enter the puppy&apos;s current age in weeks. This is a fixed number —
        remember to update it periodically as the puppy gets older.
      </p>

      <label className={labelClass}>Markings</label>
      <input
        name="markings"
        defaultValue={puppy?.markings ?? ""}
        placeholder="e.g. White markings"
        className={inputClass}
      />

      <label className={labelClass}>Size</label>
      <input
        name="size"
        defaultValue={puppy?.size ?? ""}
        placeholder="e.g. Miniature, Standard"
        className={inputClass}
      />

      <label className={labelClass}>Generation</label>
      <input
        name="generation"
        defaultValue={puppy?.generation ?? ""}
        placeholder="e.g. F1, F1B, F2"
        className={inputClass}
      />

      <label className={labelClass}>Ready Date</label>
      <input
        name="ready_date"
        type="date"
        defaultValue={puppy?.ready_date ?? ""}
        className={inputClass}
      />

      <label className={labelClass}>Litter ID</label>
      <input
        name="litter_id"
        defaultValue={puppy?.litter_id ?? ""}
        placeholder="e.g. havanese-petunia-2026-06"
        list="litter-id-suggestions"
        className={inputClass}
      />

      <datalist id="litter-id-suggestions">
        {litterIds.map((litterId) => (
          <option key={litterId} value={litterId} />
        ))}
      </datalist>

      <label className={labelClass}>Description</label>
      <textarea
        name="description"
        defaultValue={puppy?.description ?? ""}
        rows={4}
        className={inputClass}
      />

      <label className={labelClass}>Status</label>
      <select
        name="status"
        defaultValue={puppy?.status ?? "available"}
        required
        className={inputClass}
      >
        <option value="available">Available</option>
        <option value="reserved">Reserved</option>
        <option value="sold">Sold</option>
        <option value="unavailable">Unavailable</option>
      </select>

      <div className="flex items-center gap-2 mt-5">
        <input
          type="checkbox"
          name="vet_checked"
          id="vet_checked"
          defaultChecked={puppy?.vet_checked ?? false}
          className="w-4 h-4"
        />
        <label htmlFor="vet_checked" className="text-sm text-ink/80">
          Vet Checked
        </label>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <input
          type="checkbox"
          name="vaccinated"
          id="vaccinated"
          defaultChecked={puppy?.vaccinated ?? false}
          className="w-4 h-4"
        />
        <label htmlFor="vaccinated" className="text-sm text-ink/80">
          Vaccinated
        </label>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-forest mb-1">
          Included Items
        </p>
        <p className="text-xs text-sage mb-2">
          Check everything that applies to this puppy.
        </p>

        <IncludedItemsPicker
          selected={puppy?.included_items ?? []}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-forest text-cream py-3 rounded-full mt-8 hover:bg-forest-light transition-colors"
      >
        {puppy?.id ? "Save Changes" : "Add Puppy"}
      </button>
    </form>
  );
}