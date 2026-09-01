"use client";

import { useEffect, useMemo, useState } from "react";
import IncludedItemsPicker from "./IncludedItemsPicker";
import type { IncludedItemKey } from "@/lib/includedItems";
import type { LitterAutofillData } from "@/lib/queries/adminLitters";
import PasteParser from "./PasteParser";
import type { ParsedPuppyData } from "../puppies/parse-actions";
import StagedMediaUploader from "./StagedMediaUploader";

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
  markings?: string;
  size?: string;
  generation?: string;
  age_weeks?: number;
};

export default function PuppyForm({
  breeds,
  breeders,
  puppy,
  action,
  litterAutofillMap = {},
}: {
  breeds: Breed[];
  breeders: BreederOption[];
  puppy?: PuppyData;
  action: (formData: FormData) => void;
  litterAutofillMap?: Record<string, LitterAutofillData>;
}) {
  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  const labelClass = "block text-sm text-ink/80 mb-1 mt-4";

  const litterIds = useMemo(
    () => Object.keys(litterAutofillMap).sort(),
    [litterAutofillMap]
  );

  const [selectedBreedId, setSelectedBreedId] = useState(
    puppy?.breed_id ?? ""
  );
  
  const [parsedExtras, setParsedExtras] = useState<ParsedPuppyData | null>(
    null
  );

  const [selectedBreederId, setSelectedBreederId] = useState(
    puppy?.breeder_id ?? ""
  );

  const [litterId, setLitterId] = useState(puppy?.litter_id ?? "");
  const [autofillApplied, setAutofillApplied] = useState(false);

  const [price, setPrice] = useState(puppy?.price ?? "");
  const [depositAmount, setDepositAmount] = useState(
    puppy?.deposit_amount ?? 0
  );
  const [ageWeeks, setAgeWeeks] = useState(puppy?.age_weeks ?? "");
  const [size, setSize] = useState(puppy?.size ?? "");
  const [status, setStatus] = useState(puppy?.status ?? "available");
  const [vetChecked, setVetChecked] = useState(
    puppy?.vet_checked ?? false
  );
  const [vaccinated, setVaccinated] = useState(
    puppy?.vaccinated ?? false
  );
  const [isPublished, setIsPublished] = useState(
    puppy?.is_published ?? false
  );
  const [includedItems, setIncludedItems] = useState<IncludedItemKey[]>(
    puppy?.included_items ?? []
  );
  const [puppyId] = useState(() =>
    puppy?.id ?? crypto.randomUUID()
  );

  const filteredBreeders = useMemo(() => {
    if (!selectedBreedId) return [];

    return breeders.filter(
      (breeder) => breeder.breed_id === selectedBreedId
    );
  }, [breeders, selectedBreedId]);

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
    setSelectedBreederId("");
  }
  
  function handleParsed(data: ParsedPuppyData) {
    if (data.breed_name) {
      const match = breeds.find(
        (b) => b.name.toLowerCase() === data.breed_name?.toLowerCase()
      );
      if (match) {
        setSelectedBreedId(match.id);
      }
    }

    if (data.price !== null) setPrice(data.price);
    if (data.deposit_amount !== null) setDepositAmount(data.deposit_amount);
    if (data.age_weeks !== null) setAgeWeeks(data.age_weeks);
    if (data.size) setSize(data.size);
    if (data.included_items.length > 0) {
      setIncludedItems(data.included_items as IncludedItemKey[]);
    }

    setParsedExtras(data);
  }

  function handleLitterIdChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value;
    setLitterId(value);

    const match = litterAutofillMap[value];

    if (match) {
      setSelectedBreedId(match.breed_id ?? "");
      setPrice(match.price ?? "");
      setDepositAmount(match.deposit_amount ?? 0);
      setAgeWeeks(match.age_weeks ?? "");
      setSize(match.size ?? "");
      setStatus(match.status ?? "available");
      setVetChecked(match.vet_checked);
      setVaccinated(match.vaccinated);
      setIsPublished(match.is_published);
      setIncludedItems(match.included_items);
      setAutofillApplied(true);
    } else {
      setAutofillApplied(false);
    }
  }

  return (
    <form action={action} className="pb-10">
      {!puppy?.id && (
        <input type="hidden" name="id" value={puppyId} />
      )}
      {!puppy?.id && <PasteParser onParsed={handleParsed} />}
      <label className={labelClass}>Name</label>
      {!puppy?.id && (
        <>
          <label className={labelClass}>Photos & Videos</label>
          <p className="text-xs text-sage mb-1">
            Upload now — these will be saved together with the puppy when
            you submit the form below.
          </p>
          <StagedMediaUploader />
        </>
      )}
      <input
        key={parsedExtras?.name ?? puppy?.name ?? "name"}
        name="name"
        defaultValue={parsedExtras?.name ?? puppy?.name ?? ""}
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
        key={parsedExtras?.sex ?? puppy?.sex ?? "sex"}
        name="sex"
        defaultValue={parsedExtras?.sex ?? puppy?.sex ?? ""}
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
        value={price}
        onChange={(e) =>
          setPrice(e.target.value === "" ? "" : Number(e.target.value))
        }
        required
        className={inputClass}
      />

      <label className={labelClass}>Deposit Amount ($)</label>
      <input
        name="deposit_amount"
        type="number"
        step="0.01"
        value={depositAmount}
        onChange={(e) => setDepositAmount(Number(e.target.value))}
        className={inputClass}
      />

      <label className={labelClass}>Color</label>
      <input
        key={parsedExtras?.color ?? puppy?.color ?? "color"}
        name="color"
        defaultValue={parsedExtras?.color ?? puppy?.color ?? ""}
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

      <label className={labelClass}>Age (weeks)</label>
      <input
        name="age_weeks"
        type="number"
        step="1"
        min="0"
        value={ageWeeks}
        onChange={(e) =>
          setAgeWeeks(e.target.value === "" ? "" : Number(e.target.value))
        }
        placeholder="e.g. 11"
        className={inputClass}
      />
      <p className="text-xs text-sage mt-1">
        Enter the puppy&apos;s current age in weeks. This is a fixed number —
        remember to update it periodically as the puppy gets older.
      </p>

      <label className={labelClass}>Markings</label>
      <input
        key={parsedExtras?.markings ?? puppy?.markings ?? "markings"}
        name="markings"
        defaultValue={parsedExtras?.markings ?? puppy?.markings ?? ""}
        placeholder="e.g. White markings"
        className={inputClass}
      />

      <label className={labelClass}>Size</label>
      <input
        name="size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        placeholder="e.g. Miniature, Standard"
        className={inputClass}
      />

      <label className={labelClass}>Generation</label>
      <input
        key={parsedExtras?.generation ?? puppy?.generation ?? "generation"}
        name="generation"
        defaultValue={parsedExtras?.generation ?? puppy?.generation ?? ""}
        placeholder="e.g. F1, F1B, F2"
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
        value={litterId}
        onChange={handleLitterIdChange}
        placeholder="e.g. havanese-petunia-2026-06"
        list="litter-id-suggestions"
        className={inputClass}
      />
      <datalist id="litter-id-suggestions">
        {litterIds.map((id) => (
          <option key={id} value={id} />
        ))}
      </datalist>

      {autofillApplied ? (
        <p className="text-xs text-forest font-medium mt-1">
          ✓ Autofilled from this litter — breed, price, deposit, age, size,
          status, checkboxes, and included items were copied. Review and
          adjust anything before saving. Parent info and photos will be
          copied automatically once you save.
        </p>
      ) : (
        <p className="text-xs text-sage mt-1">
          Use the exact same Litter ID on every puppy from the same litter so
          they show up as siblings — and to auto-fill shared details here.
        </p>
      )}
      
      {parsedExtras && (
        <>
          <input type="hidden" name="mom_name" value={parsedExtras.mom_name ?? ""} />
          <input type="hidden" name="mom_breed" value={parsedExtras.mom_breed ?? ""} />
          <input type="hidden" name="mom_weight" value={parsedExtras.mom_weight ?? ""} />
          <input type="hidden" name="mom_registration" value={parsedExtras.mom_registration ?? ""} />
          <input type="hidden" name="dad_name" value={parsedExtras.dad_name ?? ""} />
          <input type="hidden" name="dad_breed" value={parsedExtras.dad_breed ?? ""} />
          <input type="hidden" name="dad_weight" value={parsedExtras.dad_weight ?? ""} />
          <input type="hidden" name="dad_registration" value={parsedExtras.dad_registration ?? ""} />

          {(parsedExtras.mom_name || parsedExtras.dad_name) && (
            <p className="text-xs text-forest mt-1">
              ✓ Parent info detected and will be saved automatically —
              you can review/edit it afterward on the &quot;Manage
              Parents&quot; page.
            </p>
          )}
        </>
      )}

      <label className={labelClass}>Description</label>
      <textarea
        key={parsedExtras?.description ?? puppy?.description ?? "description"}
        name="description"
        defaultValue={parsedExtras?.description ?? puppy?.description ?? ""}
        rows={4}
        className={inputClass}
      />

      <label className={labelClass}>Status</label>
      <select
        name="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
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
          checked={vetChecked}
          onChange={(e) => setVetChecked(e.target.checked)}
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
          checked={vaccinated}
          onChange={(e) => setVaccinated(e.target.checked)}
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
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
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
        selected={includedItems}
        onChange={setIncludedItems}
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