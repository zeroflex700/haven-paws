"use client";

import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, X, Check, Heart } from "lucide-react";
import { BREEDS } from "../data/breeds";
import { useMountedTransition } from "@/lib/hooks/useMountedTransition";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { useDismissableOverlay } from "@/lib/hooks/useDismissableOverlay";
import { useFavoriteBreeds } from "@/lib/hooks/useFavoriteBreeds";

export type Filters = {
  search: string;
  breed: string;
  sex: string;
  readyNow: boolean;
  sort: string;
};

const SORT_OPTIONS = [
  { value: "none", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function FilterSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { mounted, entered } = useMountedTransition(open);
  const panelRef = useDismissableOverlay(open, onClose);
  useBodyScrollLock(open);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label={title}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-forest/40 transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`absolute bottom-0 left-0 right-0 bg-cream rounded-t-2xl max-h-[75vh] overflow-y-auto outline-none transition-transform duration-300 ease-out ${
          entered ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-sage/15 sticky top-0 bg-cream">
          <span className="font-display text-lg text-forest">{title}</span>
          <button onClick={onClose} aria-label="Close" className="active:scale-90 transition-transform">
            <X size={20} className="text-ink" />
          </button>
        </div>
        <div className="px-5 py-2">{children}</div>
      </div>
    </div>
  );
}

export default function PuppyFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const [breedOpen, setBreedOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const { isFavorite: isFavoriteBreed, toggle: toggleFavoriteBreed } = useFavoriteBreeds();

  const chipBase =
    "flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-full text-sm border transition-colors";
  const chipInactive = "bg-white border-sage/30 text-ink";
  const chipActive = "bg-forest border-forest text-cream";

  function toggleSex(value: string) {
    onChange({ ...filters, sex: filters.sex === value ? "all" : value });
  }

  const sortedBreeds = [...BREEDS].sort(
    (a, b) => Number(isFavoriteBreed(b)) - Number(isFavoriteBreed(a))
  );

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6">
        <button
          onClick={() => setBreedOpen(true)}
          aria-haspopup="dialog"
          className={`${chipBase} ${filters.breed !== "all" ? chipActive : chipInactive}`}
        >
          <SlidersHorizontal size={14} />
          {filters.breed === "all" ? "Filter" : filters.breed}
        </button>

        <button
          onClick={() => setSortOpen(true)}
          aria-haspopup="dialog"
          className={`${chipBase} ${filters.sort !== "none" ? chipActive : chipInactive}`}
        >
          <ArrowUpDown size={14} />
          Sort
        </button>

        <button
          onClick={() => toggleSex("female")}
          className={`${chipBase} ${filters.sex === "female" ? chipActive : chipInactive}`}
        >
          Female
        </button>
        <button
          onClick={() => toggleSex("male")}
          className={`${chipBase} ${filters.sex === "male" ? chipActive : chipInactive}`}
        >
          Male
        </button>
        <button
          onClick={() => onChange({ ...filters, readyNow: !filters.readyNow })}
          className={`${chipBase} ${filters.readyNow ? chipActive : chipInactive}`}
        >
          Ready to go home
        </button>
      </div>

      <FilterSheet open={breedOpen} title="Filter by breed" onClose={() => setBreedOpen(false)}>
        <button
          onClick={() => {
            onChange({ ...filters, breed: "all" });
            setBreedOpen(false);
          }}
          className="w-full flex items-center justify-between text-left py-3.5 border-b border-sage/10 text-sm"
        >
          All Breeds
          {filters.breed === "all" && <Check size={16} className="text-gold" />}
        </button>
        {sortedBreeds.map((b) => (
          <div key={b} className="flex items-center border-b border-sage/10">
            <button
              onClick={() => {
                onChange({ ...filters, breed: b });
                setBreedOpen(false);
              }}
              className="flex-1 text-left py-3.5 text-sm flex items-center justify-between"
            >
              {b}
              {filters.breed === b && <Check size={16} className="text-gold" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavoriteBreed(b);
              }}
              aria-label={isFavoriteBreed(b) ? `Remove ${b} from favorite breeds` : `Favorite ${b}`}
              className="p-2 shrink-0 active:scale-90 transition-transform"
            >
              <Heart size={16} className={isFavoriteBreed(b) ? "fill-gold text-gold" : "text-sage"} />
            </button>
          </div>
        ))}
      </FilterSheet>

      <FilterSheet open={sortOpen} title="Sort by" onClose={() => setSortOpen(false)}>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              onChange({ ...filters, sort: opt.value });
              setSortOpen(false);
            }}
            className="w-full flex items-center justify-between text-left py-3.5 border-b border-sage/10 text-sm"
          >
            {opt.label}
            {filters.sort === opt.value && <Check size={16} className="text-gold" />}
          </button>
        ))}
      </FilterSheet>
    </>
  );
}