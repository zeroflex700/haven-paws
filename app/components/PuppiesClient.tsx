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
    status: "all",
    sex: "all",
    sort: "none",
  });

  const filtered = useMemo(() => {
    let result = initialPuppies.filter((p) => {
      if (filters.breed !== "all" && p.breed !== filters.breed) return false;
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.sex !== "all" && p.sex !== filters.sex) return false;
      if (filters.search.trim()) {
        const term = filters.search.trim().toLowerCase();
        const matches =
          p.name.toLowerCase().includes(term) || p.breed.toLowerCase().includes(term);
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
    <section className="max-w-6xl mx-auto px-6 pt-12 pb-20">
      <p className="eyebrow mb-3">Available Puppies</p>
      <h1 className="font-display text-3xl text-forest mb-2">Find your puppy</h1>
      <p className="text-ink/70 mb-2">
        {filtered.length} {filtered.length === 1 ? "puppy" : "puppies"} match your search
      </p>

      <PuppyFilters filters={filters} onChange={setFilters} />

      {filtered.length === 0 ? (
        <p className="text-sage py-12 text-center">
          No puppies match these filters. Try adjusting your search.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PedigreeCard key={p.id} {...p} image={p.coverImage} />
          ))}
        </div>
      )}
    </section>
  );
}