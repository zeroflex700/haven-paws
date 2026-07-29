"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ArrowUpDown, ChevronDown } from "lucide-react";
import { BREEDS } from "../data/breeds";

export type Filters = {
  search: string;
  breed: string;
  sex: string;
  readyNow: boolean;
  sort: string;
};

export default function PuppyFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const [breedOpen, setBreedOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const breedRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (breedRef.current && !breedRef.current.contains(e.target as Node)) setBreedOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const chipBase =
    "flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-full text-sm border transition-colors";
  const chipInactive = "bg-white border-sage/30 text-ink";
  const chipActive = "bg-forest border-forest text-cream";

  function toggleSex(value: string) {
    onChange({ ...filters, sex: filters.sex === value ? "all" : value });
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6">
      <div className="relative shrink-0" ref={breedRef}>
        <button
          onClick={() => setBreedOpen(!breedOpen)}
          className={`${chipBase} ${filters.breed !== "all" ? chipActive : chipInactive}`}
        >
          <SlidersHorizontal size={14} />
          {filters.breed === "all" ? "Filter" : filters.breed}
          <ChevronDown size={14} />
        </button>
        {breedOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 max-h-72 overflow-y-auto bg-white border border-sage/20 rounded-lg shadow-lg z-20 py-2">
            <button
              onClick={() => {
                onChange({ ...filters, breed: "all" });
                setBreedOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-cream-alt"
            >
              All Breeds
            </button>
            {BREEDS.map((b) => (
              <button
                key={b}
                onClick={() => {
                  onChange({ ...filters, breed: b });
                  setBreedOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-cream-alt"
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative shrink-0" ref={sortRef}>
        <button
          onClick={() => setSortOpen(!sortOpen)}
          className={`${chipBase} ${filters.sort !== "none" ? chipActive : chipInactive}`}
        >
          <ArrowUpDown size={14} />
          Sort
          <ChevronDown size={14} />
        </button>
        {sortOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-sage/20 rounded-lg shadow-lg z-20 py-2">
            {[
              { value: "none", label: "Default" },
              { value: "price-asc", label: "Price: Low to High" },
              { value: "price-desc", label: "Price: High to Low" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange({ ...filters, sort: opt.value });
                  setSortOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-cream-alt"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

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
  );
}