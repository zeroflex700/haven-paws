"use client";

import { Search } from "lucide-react";
import { BREEDS } from "../data/breeds";

export type Filters = {
  search: string;
  breed: string;
  status: string;
  sex: string;
  sort: string;
};

export default function PuppyFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const selectClass =
    "bg-white border border-sage/30 rounded-full px-4 py-2 text-sm text-ink focus:outline-none focus:border-gold";

  return (
    <div>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />
        <input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by breed or puppy name"
          className="w-full border border-sage/30 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </div>

      <div className="flex flex-wrap gap-3 pb-6">
        <select
          className={selectClass}
          value={filters.breed}
          onChange={(e) => onChange({ ...filters, breed: e.target.value })}
        >
          <option value="all">All Breeds</option>
          {BREEDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>

        <select
          className={selectClass}
          value={filters.sex}
          onChange={(e) => onChange({ ...filters, sex: e.target.value })}
        >
          <option value="all">Any Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          className={selectClass}
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
        >
          <option value="none">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}