"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SearchX } from "lucide-react";
import PedigreeCard from "./PedigreeCard";
import PuppyFilters, { Filters } from "./PuppyFilters";
import FilterChips from "./FilterChips";
import SearchSuggestionsDropdown from "./SearchSuggestionsDropdown";
import SavedSearchesBar from "./SavedSearchesBar";
import CompareBar from "./CompareBar";
import { usePersistentFilters } from "@/lib/hooks/usePersistentFilters";
import { useSearchHistory } from "@/lib/hooks/useSearchHistory";
import type { PuppyRecord } from "@/lib/queries/puppies";

const DEFAULT_FILTERS: Filters = {
  search: "",
  breed: "all",
  sex: "all",
  readyNow: false,
  sort: "none",
};

export default function PuppiesClient({
  initialPuppies,
}: {
  initialPuppies: PuppyRecord[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFiltersRaw] = usePersistentFilters<Filters>("havenpaws_puppy_filters", {
    ...DEFAULT_FILTERS,
    search: searchParams.get("search") ?? "",
    breed: searchParams.get("breed") ?? "all",
  });

  const { terms, addTerm, clearHistory } = useSearchHistory();
  const [suggestOpen, setSuggestOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlBreed = searchParams.get("breed");
    const urlSearch = searchParams.get("search");
    if (urlBreed || urlSearch) {
      setFiltersRaw((f) => ({
        ...f,
        breed: urlBreed ?? f.breed,
        search: urlSearch ?? f.search,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Filters) => {
      setFiltersRaw(next);

      const currentBreed = searchParams.get("breed") ?? "all";
      const currentSearch = searchParams.get("search") ?? "";
      if (next.breed === currentBreed && next.search === currentSearch) return;

      const params = new URLSearchParams(searchParams.toString());
      if (next.breed && next.breed !== "all") params.set("breed", next.breed);
      else params.delete("breed");
      if (next.search.trim()) params.set("search", next.search);
      else params.delete("search");

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams, setFiltersRaw]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSuggestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function commitSearch(term: string) {
    setFilters({ ...filters, search: term });
    if (term.trim()) addTerm(term.trim());
    setSuggestOpen(false);
  }

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

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.breed !== "all" ||
    filters.sex !== "all" ||
    filters.readyNow ||
    filters.sort !== "none";

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-6 pb-16">
      <div ref={searchBoxRef} className="relative mb-3">
        <input
          value={filters.search}
          onChange={(e) => setFiltersRaw({ ...filters, search: e.target.value })}
          onFocus={() => setSuggestOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitSearch(filters.search);
          }}
          placeholder="Search by breed or puppy name"
          className="w-full border border-sage/30 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
        {suggestOpen && (
          <SearchSuggestionsDropdown
            query={filters.search}
            history={terms}
            onSelect={commitSearch}
            onClearHistory={clearHistory}
          />
        )}
      </div>

      <SavedSearchesBar filters={filters} onApply={setFilters} />

      <FilterChips filters={filters} onChange={setFilters} />

      <PuppyFilters filters={filters} onChange={setFilters} />

      {filtered.length === 0 ? (
        <div className="py-14 text-center">
          <SearchX size={28} className="text-sage mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-ink font-medium text-sm mb-1">No puppies match these filters</p>
          <p className="small-text mb-4">Try adjusting your search or clearing filters below.</p>
          {hasActiveFilters && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-sm text-forest border border-forest/30 px-5 py-2 rounded-full hover:border-forest transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-7">
          {filtered.map((p) => (
            <PedigreeCard key={p.id} {...p} image={p.coverImage} />
          ))}
        </div>
      )}

      <CompareBar />
    </section>
  );
}