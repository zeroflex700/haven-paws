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
  deposit_amount?: number;
  description?: string;
  status?: string;
  color?: string;
  weight_estimate?: number;
  litter_id?: string;
  ready_date?: string;
  included_items?: IncludedItemKey[];
  vet_checked?: boolean;
  vaccinated?: boolean;
  is_published?: boolean;
};

export default function PuppyForm({
  breeds,
  breeders,
  puppy,
  action,
}: {
  breeds: Breed[];
  breeders: BreederOption[];
  puppy?: PuppyData;
  action: (formData: FormData) => void;
}) {
  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

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

  // If the breed changes, make sure an old breeder from another
  // breed cannot remain selected.
  useEffect(() => {
    if (
      selectedBreederId &&
      !filteredBreeders.some(
        (breeder) => breeder.id === selectedBreederId
      )
    ) {
      setSelectedBreederId("");
    }
  }, [filteredBreeders, selectedBreederId]);

  function handleBreedChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const breedId = event.target.value;

    setSelectedBreedId(breedId);

    // A breeder belongs to a breed, so changing the breed
    // clears the previous breeder selection.
    setSelectedBreederId("");
  }

  return (
    <form action={action} className="pb-10">
      <label className={labelClass}>Name</label>
      <input
        name="name"
        defaultValue={puppy?.name}
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

        {breeds.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
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
              : "No breeder profile linked"}
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
        defaultValue={puppy?.sex}
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
        defaultValue={puppy?.price}
        required
        className={inputClass}
      />

      <label className={labelClass}>Deposit Amount ($)</label>
      <input
        name="deposit_amount"
        type="number"
        step="0.01"
        defaultValue={puppy?.deposit_amount ?? 0}
        className={inputClass}
      />

      <label className={labelClass}>Color</label>
      <input
        name="color"
        defaultValue={puppy?.color}
        className={inputClass}
      />

      <label className={labelClass}>Weight Estimate (lbs)</label>
      <input
        name="weight_estimate"
        type="number"
        step="0.1"
        defaultValue={puppy?.weight_estimate}
        className={inputClass}
      />

      <label className={labelClass}>Ready Date</label>
      <input
        name="ready_date"
        type="date"
        defaultValue={puppy?.ready_date}
        className={inputClass}
      />

      <label className={labelClass}>Litter ID</label>
      <input
        name="litter_id"
        defaultValue={puppy?.litter_id}
        placeholder="e.g. litter-2026-golden-01"
        className={inputClass}
      />

      <label className={labelClass}>Description</label>
      <textarea
        name="description"
        defaultValue={puppy?.description}
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
        <option value="hidden">Hidden</option>
      </select>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          name="vet_checked"
          id="vet_checked"
          defaultChecked={puppy?.vet_checked}
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
          defaultChecked={puppy?.vaccinated}
          className="w-4 h-4"
        />
        <label htmlFor="vaccinated" className="text-sm text-ink/80">
          Vaccinated
        </label>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <input
          type="checkbox"
          name="is_published"
          id="is_published"
          defaultChecked={puppy?.is_published}
          className="w-4 h-4"
        />
        <label htmlFor="is_published" className="text-sm text-ink/80">
          Published (visible on site)
        </label>
      </div>

      <label className={labelClass}>What&apos;s Included</label>

      <p className="text-xs text-sage mb-1">
        Check everything that applies to this puppy.
      </p>

      <IncludedItemsPicker
        selected={puppy?.included_items ?? []}
      />

      <button
        type="submit"
        className="w-full bg-forest text-cream py-3 rounded-full mt-8 hover:bg-forest-light transition-colors"
      >
        {puppy?.id ? "Save Changes" : "Add Puppy"}
      </button>
    </form>
  );
}