"use client";

import { X } from "lucide-react";
import type { Filters } from "./PuppyFilters";

const DEFAULTS: Filters = { search: "", breed: "all", sex: "all", readyNow: false, sort: "none" };

export default function FilterChips({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const chips: { key: keyof Filters; label: string }[] = [];

  if (filters.search.trim()) chips.push({ key: "search", label: `"${filters.search.trim()}"` });
  if (filters.breed !== "all") chips.push({ key: "breed", label: filters.breed });
  if (filters.sex !== "all") chips.push({ key: "sex", label: filters.sex === "male" ? "Male" : "Female" });
  if (filters.readyNow) chips.push({ key: "readyNow", label: "Ready to go home" });
  if (filters.sort !== "none")
    chips.push({ key: "sort", label: filters.sort === "price-asc" ? "Price: Low to High" : "Price: High to Low" });

  if (chips.length === 0) return null;

  function removeChip(key: keyof Filters) {
    onChange({ ...filters, [key]: DEFAULTS[key] });
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => removeChip(chip.key)}
          className="flex items-center gap-1.5 bg-cream-alt text-ink text-xs px-3 py-1.5 rounded-full tap-feedback"
        >
          {chip.label}
          <X size={12} className="text-sage" />
        </button>
      ))}
      <button
        onClick={() => onChange(DEFAULTS)}
        className="text-xs text-forest underline px-1 py-1.5"
      >
        Clear all
      </button>
    </div>
  );
}