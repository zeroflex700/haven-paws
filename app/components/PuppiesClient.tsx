"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PedigreeCard from "./PedigreeCard";
import PuppyFilters, { Filters } from "./PuppyFilters";
import type { PuppyRecord } from "@/lib/queries/puppies";

export default function PuppiesClient({
  initialPuppies,
}: {
  initialPuppies: PuppyRecord[];
}) {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("search") ?? "",
    breed: searchParams.get("breed") ?? "all",
    sex: "all",
    readyNow: false,
    sort: "none",
  });

  const filtered = useMemo(() => {
    let result = initialPuppies.filter((p) => {
      if (filters.breed !== "all" && p.breed !== filters.breed) return false;
      if (filters.sex !== "all" && p.sex !== filters.sex) return false;
      if (filters.readyNow && p.readyLabel !== "Ready to go home") return false;
      if (filters.search.trim()) {
        const term = filters.search.trim().toLowerCase();
        const matches = p.name.toLowerCase().includes(term) || p.breed.toLowerCase().includes(term);
        if (!matches) return false;
      }
      return true;
    });

    if (filters.sort === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [filters, initialPuppies]);

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-6 pb-16">
      <div className="relative mb-3">
        <input
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search by breed or puppy name"
          className="w-full border border-sage/30 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </div>

      <PuppyFilters filters={filters} onChange={setFilters} />

      {filtered.length === 0 ? (
        <p className="small-text py-10 text-center">
          No puppies match these filters. Try adjusting your search.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-7">
          {filtered.map((p) => (
            <PedigreeCard key={p.id} {...p} image={p.coverImage} />
          ))}
        </div>
      )}
    </section>
  );
}