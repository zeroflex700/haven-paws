"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import IncludedItemsPicker from "./IncludedItemsPicker";
import type { IncludedItemKey } from "@/lib/includedItems";
import { supabase } from "@/lib/supabase/client";

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
  color?: string;
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
  mom_name?: string;
  mom_breed?: string;
  mom_weight?: string;
  mom_registration?: string;
  mom_photo_url?: string;
  dad_name?: string;
  dad_breed?: string;
  dad_weight?: string;
  dad_registration?: string;
  dad_photo_url?: string;
};

type SiblingRow = {
  name: string;
  breed_id: string | null;
  breeder_id: string | null;
  price: number | null;
  deposit_amount: number | null;
  age_weeks: number | null;
  size: string | null;
  status: string | null;
  vet_checked: boolean | null;
  vaccinated: boolean | null;
  is_published: boolean | null;
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

const LITTER_LOOKUP_DEBOUNCE_MS = 500;

export default function PuppyForm({
  breeds,
  breeders,
  puppy,
  action,
  litterIds = [],
}: {
  breeds: Breed[];
  breeders: BreederOption[];
  puppy?: PuppyData;
  action: (formData: FormData) => void;
  litterIds?: string[];
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

const [selectedSex, setSelectedSex] = useState(
  puppy?.sex ?? ""
);

  const [litterId, setLitterId] = useState(
    puppy?.litter_id ?? ""
  );

  const [autofillStatus, setAutofillStatus] = useState<
    | { type: "found"; siblingName: string }
    | { type: "none" }
    | null
  >(null);

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

  /* ============================================================= */
  /* LITTER AUTO-FILL                                               */
  /*                                                                 */
  /* Refs for the fields we programmatically fill in when a sibling  */
  /* is found. These stay uncontrolled inputs (matching the rest of  */
  /* this form's pattern of using defaultValue + FormData), we just  */
  /* set .value directly via the ref when auto-filling.              */
  /* ============================================================= */

  const priceRef = useRef<HTMLInputElement>(null);
  const depositRef = useRef<HTMLInputElement>(null);
  const ageWeeksRef = useRef<HTMLInputElement>(null);
  const sizeRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);
  const vetCheckedRef = useRef<HTMLInputElement>(null);
  const vaccinatedRef = useRef<HTMLInputElement>(null);
  const isPublishedRef = useRef<HTMLInputElement>(null);

  const momNameRef = useRef<HTMLInputElement>(null);
  const momBreedRef = useRef<HTMLInputElement>(null);
  const momWeightRef = useRef<HTMLInputElement>(null);
  const momRegistrationRef = useRef<HTMLInputElement>(null);
  const momPhotoUrlRef = useRef<HTMLInputElement>(null);
  const dadNameRef = useRef<HTMLInputElement>(null);
  const dadBreedRef = useRef<HTMLInputElement>(null);
  const dadWeightRef = useRef<HTMLInputElement>(null);
  const dadRegistrationRef = useRef<HTMLInputElement>(null);
  const dadPhotoUrlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmed = litterId.trim();

    if (!trimmed) {
      setAutofillStatus(null);
      return;
    }

    const timeout = setTimeout(async () => {
      const { data, error } = await supabase
        .from("puppies")
        .select(
          `
            name,
            breed_id,
            breeder_id,
            price,
            deposit_amount,
            age_weeks,
            size,
            status,
            vet_checked,
            vaccinated,
            is_published,
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
        .eq("litter_id", trimmed)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "Failed to look up litter siblings:",
          error
        );
        return;
      }

      if (!data) {
        setAutofillStatus({ type: "none" });
        return;
      }

      const sibling = data as SiblingRow;

      // Shared-across-litter fields.
      if (sibling.breed_id) {
        setSelectedBreedId(sibling.breed_id);
      }

      if (sibling.breeder_id) {
        setSelectedBreederId(sibling.breeder_id);
      }

      if (priceRef.current && sibling.price !== null) {
        priceRef.current.value = String(sibling.price);
      }

      if (
        depositRef.current &&
        sibling.deposit_amount !== null
      ) {
        depositRef.current.value = String(
          sibling.deposit_amount
        );
      }

      if (
        ageWeeksRef.current &&
        sibling.age_weeks !== null
      ) {
        ageWeeksRef.current.value = String(
          sibling.age_weeks
        );
      }

      if (sizeRef.current && sibling.size) {
        sizeRef.current.value = sibling.size;
      }

      if (statusRef.current && sibling.status) {
        statusRef.current.value = sibling.status;
      }

      if (vetCheckedRef.current) {
        vetCheckedRef.current.checked = !!sibling.vet_checked;
      }

      if (vaccinatedRef.current) {
        vaccinatedRef.current.checked = !!sibling.vaccinated;
      }

      if (isPublishedRef.current) {
        isPublishedRef.current.checked =
          !!sibling.is_published;
      }

      // Parent info.
      if (momNameRef.current && sibling.mom_name) {
        momNameRef.current.value = sibling.mom_name;
      }

      if (momBreedRef.current && sibling.mom_breed) {
        momBreedRef.current.value = sibling.mom_breed;
      }

      if (momWeightRef.current && sibling.mom_weight) {
        momWeightRef.current.value = sibling.mom_weight;
      }

      if (
        momRegistrationRef.current &&
        sibling.mom_registration
      ) {
        momRegistrationRef.current.value =
          sibling.mom_registration;
      }

      if (
        momPhotoUrlRef.current &&
        sibling.mom_photo_url
      ) {
        momPhotoUrlRef.current.value =
          sibling.mom_photo_url;
      }

      if (dadNameRef.current && sibling.dad_name) {
        dadNameRef.current.value = sibling.dad_name;
      }

      if (dadBreedRef.current && sibling.dad_breed) {
        dadBreedRef.current.value = sibling.dad_breed;
      }

      if (dadWeightRef.current && sibling.dad_weight) {
        dadWeightRef.current.value = sibling.dad_weight;
      }

      if (
        dadRegistrationRef.current &&
        sibling.dad_registration
      ) {
        dadRegistrationRef.current.value =
          sibling.dad_registration;
      }

      if (
        dadPhotoUrlRef.current &&
        sibling.dad_photo_url
      ) {
        dadPhotoUrlRef.current.value =
          sibling.dad_photo_url;
      }

      setAutofillStatus({
        type: "found",
        siblingName: sibling.name,
      });
    }, LITTER_LOOKUP_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [litterId]);

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
        onChange={(event) =>
          setSelectedBreederId(event.target.value)
        }
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
  value={selectedSex}
  onChange={(event) => setSelectedSex(event.target.value)}
  required
  className={inputClass}
>
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <label className={labelClass}>Price ($)</label>
      <input
        ref={priceRef}
        name="price"
        type="number"
        step="0.01"
        defaultValue={puppy?.price}
        required
        className={inputClass}
      />

      <label className={labelClass}>Deposit Amount ($)</label>
      <input
        ref={depositRef}
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

      <label className={labelClass}>Age (weeks)</label>
      <input
        ref={ageWeeksRef}
        name="age_weeks"
        type="number"
        step="1"
        min="0"
        defaultValue={puppy?.age_weeks}
        placeholder="e.g. 11"
        className={inputClass}
      />
      <p className="text-xs text-sage mt-1">
        Enter the puppy&apos;s current age in weeks. This is a fixed number —
        remember to update it periodically as the puppy gets older.
      </p>

      <label className={labelClass}>Markings</label>
      <input
        name="markings"
        defaultValue={puppy?.markings}
        placeholder="e.g. White markings"
        className={inputClass}
      />

      <label className={labelClass}>Size</label>
      <input
        ref={sizeRef}
        name="size"
        defaultValue={puppy?.size}
        placeholder="e.g. Miniature, Standard"
        className={inputClass}
      />

      <label className={labelClass}>Generation</label>
      <input
        name="generation"
        defaultValue={puppy?.generation}
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
        onChange={(event) => setLitterId(event.target.value)}
        placeholder="e.g. havanese-petunia-2026-06"
        list="litter-id-suggestions"
        className={inputClass}
      />
      <datalist id="litter-id-suggestions">
        {litterIds.map((id) => (
          <option key={id} value={id} />
        ))}
      </datalist>
      <p className="text-xs text-sage mt-1">
        Use the exact same Litter ID on every puppy from the same litter so
        they show up as siblings on each other&apos;s pages. Start typing to
        see existing litter IDs.
      </p>

      {autofillStatus?.type === "found" && (
        <p className="text-xs text-forest bg-sage/10 border border-sage/20 rounded-md px-3 py-2 mt-2">
          ✓ Auto-filled breed, breeder, price, deposit, age, size, status,
          and parent info from <strong>{autofillStatus.siblingName}</strong>,
          an existing puppy in this litter. Review before saving —
          fields specific to this puppy (name, sex, color, weight,
          markings, photos) still need to be entered.
        </p>
      )}

      {autofillStatus?.type === "none" && (
        <p className="text-xs text-sage mt-2">
          No existing puppy found with this Litter ID yet — this will be
          the first puppy in the litter.
        </p>
      )}

      <label className={labelClass}>Description</label>
      <textarea
        name="description"
        defaultValue={puppy?.description}
        rows={4}
        className={inputClass}
      />

      <label className={labelClass}>Status</label>
      <select
        ref={statusRef}
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
          ref={vetCheckedRef}
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
          ref={vaccinatedRef}
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
          ref={isPublishedRef}
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

      {/* ============================================================= */}
      {/* PARENT INFORMATION                                             */}
      {/*                                                                 */}
      {/* Newly added — these columns already existed on the puppies      */}
      {/* table but had no form fields, so they could never be entered    */}
      {/* or saved before now. Auto-filled from a sibling when a Litter   */}
      {/* ID match is found, above.                                      */}
      {/* ============================================================= */}

      <div className="mt-8 pt-6 border-t border-sage/20">
        <h2 className="font-display text-lg text-forest">
          Parent Information
        </h2>
        <p className="text-xs text-sage mt-1">
          Auto-filled from a litter sibling when available. Applies once
          per litter — usually the same for every puppy in it.
        </p>

        <label className={labelClass}>Mom&apos;s Name</label>
        <input
          ref={momNameRef}
          name="mom_name"
          defaultValue={puppy?.mom_name}
          className={inputClass}
        />

        <label className={labelClass}>Mom&apos;s Breed</label>
        <input
          ref={momBreedRef}
          name="mom_breed"
          defaultValue={puppy?.mom_breed}
          className={inputClass}
        />

        <label className={labelClass}>Mom&apos;s Weight</label>
        <input
          ref={momWeightRef}
          name="mom_weight"
          defaultValue={puppy?.mom_weight}
          placeholder="e.g. 45 lbs"
          className={inputClass}
        />

        <label className={labelClass}>Mom&apos;s Registration</label>
        <input
          ref={momRegistrationRef}
          name="mom_registration"
          defaultValue={puppy?.mom_registration}
          className={inputClass}
        />

        <label className={labelClass}>Mom&apos;s Photo URL</label>
        <input
          ref={momPhotoUrlRef}
          name="mom_photo_url"
          defaultValue={puppy?.mom_photo_url}
          className={inputClass}
        />

        <label className={labelClass}>Dad&apos;s Name</label>
        <input
          ref={dadNameRef}
          name="dad_name"
          defaultValue={puppy?.dad_name}
          className={inputClass}
        />

        <label className={labelClass}>Dad&apos;s Breed</label>
        <input
          ref={dadBreedRef}
          name="dad_breed"
          defaultValue={puppy?.dad_breed}
          className={inputClass}
        />

        <label className={labelClass}>Dad&apos;s Weight</label>
        <input
          ref={dadWeightRef}
          name="dad_weight"
          defaultValue={puppy?.dad_weight}
          placeholder="e.g. 50 lbs"
          className={inputClass}
        />

        <label className={labelClass}>Dad&apos;s Registration</label>
        <input
          ref={dadRegistrationRef}
          name="dad_registration"
          defaultValue={puppy?.dad_registration}
          className={inputClass}
        />

        <label className={labelClass}>Dad&apos;s Photo URL</label>
        <input
          ref={dadPhotoUrlRef}
          name="dad_photo_url"
          defaultValue={puppy?.dad_photo_url}
          className={inputClass}
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
