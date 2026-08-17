"use client";

import {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import {
  Search,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  ChevronDown,
  X,
  PawPrint,
  ShieldCheck,
  MapPin,
} from "lucide-react";

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

  const [filters, setFiltersRaw] =
    usePersistentFilters<Filters>(
      "havenpaws_puppy_filters",
      {
        ...DEFAULT_FILTERS,
        search: searchParams.get("search") ?? "",
        breed: searchParams.get("breed") ?? "all",
      }
    );

  const { terms, addTerm, clearHistory } =
    useSearchHistory();

  const [suggestOpen, setSuggestOpen] =
    useState(false);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const searchBoxRef =
    useRef<HTMLDivElement>(null);

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

      const currentBreed =
        searchParams.get("breed") ?? "all";

      const currentSearch =
        searchParams.get("search") ?? "";

      if (
        next.breed === currentBreed &&
        next.search === currentSearch
      ) {
        return;
      }

      const params = new URLSearchParams(
        searchParams.toString()
      );

      if (
        next.breed &&
        next.breed !== "all"
      ) {
        params.set("breed", next.breed);
      } else {
        params.delete("breed");
      }

      if (next.search.trim()) {
        params.set("search", next.search);
      } else {
        params.delete("search");
      }

      const qs = params.toString();

      router.replace(
        qs ? `${pathname}?${qs}` : pathname,
        {
          scroll: false,
        }
      );
    },
    [
      router,
      pathname,
      searchParams,
      setFiltersRaw,
    ]
  );

  useEffect(() => {
    function handleClickOutside(
      e: MouseEvent
    ) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(
          e.target as Node
        )
      ) {
        setSuggestOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  useEffect(() => {
    if (!mobileFiltersOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  function commitSearch(term: string) {
    setFilters({
      ...filters,
      search: term,
    });

    if (term.trim()) {
      addTerm(term.trim());
    }

    setSuggestOpen(false);
  }

  const filtered = useMemo(() => {
    let result = initialPuppies.filter(
      (p) => {
        if (
          filters.breed !== "all" &&
          p.breed !== filters.breed
        ) {
          return false;
        }

        if (
          filters.sex !== "all" &&
          p.sex !== filters.sex
        ) {
          return false;
        }

        if (
          filters.readyNow &&
          p.readyLabel !== "Ready to go home"
        ) {
          return false;
        }

        if (filters.search.trim()) {
          const term =
            filters.search
              .trim()
              .toLowerCase();

          const matches =
            p.name
              .toLowerCase()
              .includes(term) ||
            p.breed
              .toLowerCase()
              .includes(term);

          if (!matches) {
            return false;
          }
        }

        return true;
      }
    );

    if (filters.sort === "price-asc") {
      result = [...result].sort(
        (a, b) => a.price - b.price
      );
    } else if (
      filters.sort === "price-desc"
    ) {
      result = [...result].sort(
        (a, b) => b.price - a.price
      );
    }

    return result;
  }, [filters, initialPuppies]);

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.breed !== "all" ||
    filters.sex !== "all" ||
    filters.readyNow ||
    filters.sort !== "none";

  const activeFilterCount =
    Number(filters.breed !== "all") +
    Number(filters.sex !== "all") +
    Number(filters.readyNow) +
    Number(filters.sort !== "none") +
    Number(filters.search.trim() !== "");

  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setMobileFiltersOpen(false);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-cream">

        {/* ================================================================ */}
        {/* ATMOSPHERIC BACKGROUND                                           */}
        {/* ================================================================ */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden"
        >
          <div className="absolute -top-44 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-forest/[0.035] blur-3xl" />

          <div className="absolute right-[-180px] top-24 h-[360px] w-[360px] rounded-full bg-gold/[0.055] blur-3xl" />

          <div className="absolute left-[-180px] top-64 h-[300px] w-[300px] rounded-full bg-sage/[0.045] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-7 lg:px-10 xl:px-12">

          {/* ============================================================ */}
          {/* HERO / SEARCH                                                  */}
          {/* ============================================================ */}

          <div className="pt-9 sm:pt-12 lg:pt-16">

            <div className="max-w-3xl">

              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest/[0.07] text-forest">
                  <PawPrint
                    size={14}
                    strokeWidth={1.8}
                  />
                </span>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">
                  Find your companion
                </p>
              </div>

              <h1 className="font-display text-[2.35rem] leading-[1.02] tracking-[-0.025em] text-forest sm:text-5xl lg:text-[4.1rem]">
                Puppies looking
                <br className="hidden sm:block" />
                <span className="text-forest/55">
                  for a home.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-ink/60 sm:text-base sm:leading-7">
                Browse available puppies from
                vetted, responsible breeders and
                find the one that feels right for
                your family.
              </p>

            </div>

            {/* ========================================================== */}
            {/* SEARCH                                                        */}
            {/* ========================================================== */}

            <div
              ref={searchBoxRef}
              className="relative mt-7 max-w-4xl"
            >

              <div
                className={`group flex min-h-[58px] items-center rounded-[18px] border bg-white px-4 shadow-[0_12px_40px_rgba(30,55,45,0.07)] transition-all duration-200 sm:min-h-[64px] sm:rounded-[20px] sm:px-5 ${
                  suggestOpen
                    ? "border-forest/30 ring-4 ring-forest/[0.035]"
                    : "border-sage/15 hover:border-sage/25"
                }`}
              >

                <Search
                  size={20}
                  strokeWidth={1.7}
                  className="mr-3 shrink-0 text-sage"
                />

                <input
                  value={filters.search}
                  onChange={(e) =>
                    setFiltersRaw({
                      ...filters,
                      search: e.target.value,
                    })
                  }
                  onFocus={() =>
                    setSuggestOpen(true)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      commitSearch(
                        filters.search
                      );
                    }

                    if (
                      e.key === "Escape"
                    ) {
                      setSuggestOpen(false);
                    }
                  }}
                  placeholder="Search by breed or puppy name"
                  aria-label="Search puppies"
                  className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-sage/60 sm:text-[15px]"
                />

                {filters.search && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        search: "",
                      })
                    }
                    className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sage transition-colors hover:bg-cream-alt hover:text-ink"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    commitSearch(filters.search)
                  }
                  className="hidden shrink-0 rounded-xl bg-forest px-5 py-2.5 text-xs font-medium text-cream transition-all hover:bg-forest-light sm:block"
                >
                  Search
                </button>

              </div>

              {suggestOpen && (
                <SearchSuggestionsDropdown
                  query={filters.search}
                  history={terms}
                  onSelect={commitSearch}
                  onClearHistory={
                    clearHistory
                  }
                />
              )}

            </div>

            {/* ========================================================== */}
            {/* TRUST SIGNALS                                                 */}
            {/* ========================================================== */}

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-sage">
              <span className="flex items-center gap-1.5">
                <ShieldCheck
                  size={13}
                  className="text-forest"
                />
                Vetted breeders
              </span>

              <span className="hidden h-3 w-px bg-sage/20 sm:block" />

              <span className="flex items-center gap-1.5">
                <PawPrint
                  size={13}
                  className="text-forest"
                />
                Carefully listed puppies
              </span>

              <span className="hidden h-3 w-px bg-sage/20 sm:block" />

              <span className="flex items-center gap-1.5">
                <MapPin
                  size={13}
                  className="text-forest"
                />
                Across the U.S.
              </span>
            </div>

          </div>

          {/* ============================================================ */}
          {/* SEARCH TOOLS                                                    */}
          {/* ============================================================ */}

          <div className="mt-8">

            <SavedSearchesBar
              filters={filters}
              onApply={setFilters}
            />

          </div>

          {/* ============================================================ */}
          {/* DESKTOP FILTER AREA                                             */}
          {/* ============================================================ */}

          <div className="mt-5 hidden lg:block">

            <div className="rounded-2xl border border-sage/12 bg-white/70 p-3 backdrop-blur-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-alt text-forest">
                  <SlidersHorizontal
                    size={16}
                    strokeWidth={1.7}
                  />
                </div>

                <div className="mr-1 shrink-0">
                  <p className="text-xs font-medium text-forest">
                    Refine your search
                  </p>

                  <p className="text-[10px] text-sage">
                    Find the right match
                  </p>
                </div>

                <div className="h-8 w-px bg-sage/10" />

                <div className="min-w-0 flex-1">
                  <PuppyFilters
                    filters={filters}
                    onChange={setFilters}
                  />
                </div>

              </div>

            </div>

          </div>

          {/* ============================================================ */}
          {/* MOBILE FILTER BAR                                               */}
          {/* ============================================================ */}

          <div className="mt-5 lg:hidden">

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(true)
                }
                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-sage/15 bg-white px-4 text-xs font-medium text-forest shadow-sm transition-colors hover:border-sage/25"
              >
                <SlidersHorizontal
                  size={15}
                />

                Filters

                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1.5 text-[10px] text-cream">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-sage/15 bg-white px-4 text-xs text-sage transition-colors hover:border-sage/25 hover:text-ink"
                >
                  <X size={13} />
                  Clear
                </button>
              )}

            </div>

          </div>

          {/* ============================================================ */}
          {/* ACTIVE FILTERS                                                  */}
          {/* ============================================================ */}

          <div className="mt-4">
            <FilterChips
              filters={filters}
              onChange={setFilters}
            />
          </div>

          {/* ============================================================ */}
          {/* RESULTS HEADER                                                  */}
          {/* ============================================================ */}

          <div className="mt-9 border-t border-sage/10 pt-6 sm:mt-11 sm:pt-7">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl tracking-[-0.01em] text-forest sm:text-3xl">
                    Available puppies
                  </h2>

                  <span className="rounded-full bg-forest/[0.07] px-2.5 py-1 text-[10px] font-medium text-forest">
                    {filtered.length}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-sage sm:text-sm">
                  {hasActiveFilters
                    ? "Showing puppies that match your preferences."
                    : "Explore our current puppy listings."}
                </p>

              </div>

              <div className="flex items-center gap-2">

                {filters.sort !== "none" && (
                  <span className="text-[10px] uppercase tracking-[0.14em] text-sage">
                    Sorted
                  </span>
                )}

                {filters.sort ===
                  "price-asc" && (
                  <span className="text-xs font-medium text-forest">
                    Price: low to high
                  </span>
                )}

                {filters.sort ===
                  "price-desc" && (
                  <span className="text-xs font-medium text-forest">
                    Price: high to low
                  </span>
                )}

                {filters.sort === "none" && (
                  <span className="hidden items-center gap-1 text-xs text-sage sm:flex">
                    <Sparkles
                      size={13}
                    />
                    Curated listings
                  </span>
                )}

                <ChevronDown
                  size={14}
                  className="hidden text-sage sm:block"
                />

              </div>

            </div>

          </div>

          {/* ============================================================ */}
          {/* LISTINGS                                                       */}
          {/* ============================================================ */}

          <div className="pb-24 pt-6 sm:pt-8">

            {filtered.length === 0 ? (
              <div className="rounded-[24px] border border-sage/12 bg-white px-6 py-16 text-center shadow-[0_8px_30px_rgba(30,55,45,0.035)] sm:px-10 sm:py-24">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream-alt text-sage">
                  <SearchX
                    size={27}
                    strokeWidth={1.4}
                  />
                </div>

                <p className="mt-5 font-display text-2xl text-forest">
                  No puppies found
                </p>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-sage">
                  We couldn&apos;t find puppies
                  matching your current
                  search. Try broadening your
                  preferences or removing a
                  filter.
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-medium text-cream transition-colors hover:bg-forest-light"
                  >
                    <X size={14} />
                    Clear all filters
                  </button>
                )}

              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4 lg:gap-x-5 xl:grid-cols-5 xl:gap-x-6">

                {filtered.map((p) => (
                  <div
                    key={p.id}
                    className="min-w-0"
                  >
                    <PedigreeCard
                      {...p}
                      image={p.coverImage}
                    />
                  </div>
                ))}

              </div>
            )}

          </div>

        </div>
      </section>

      {/* ================================================================== */}
      {/* MOBILE FILTER DRAWER                                               */}
      {/* ================================================================== */}

      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-[90] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Puppy filters"
        >

          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[28px] bg-cream shadow-[0_-20px_70px_rgba(20,35,30,0.18)]">

            <div className="sticky top-0 z-10 border-b border-sage/10 bg-cream/95 px-5 py-4 backdrop-blur-md">

              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-sage/20" />

              <div className="flex items-center justify-between">

                <div>
                  <p className="font-display text-xl text-forest">
                    Refine your search
                  </p>

                  <p className="mt-0.5 text-xs text-sage">
                    Choose your puppy preferences
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFiltersOpen(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sage shadow-sm transition-colors hover:text-ink"
                  aria-label="Close filters"
                >
                  <X size={17} />
                </button>

              </div>

            </div>

            <div className="px-5 pb-28 pt-5">

              <div className="rounded-2xl border border-sage/12 bg-white p-4">
                <PuppyFilters
                  filters={filters}
                  onChange={setFilters}
                />
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 w-full rounded-xl border border-sage/15 bg-white py-3 text-xs font-medium text-forest transition-colors hover:border-sage/30"
                >
                  Clear all filters
                </button>
              )}

            </div>

            <div className="fixed inset-x-0 bottom-0 border-t border-sage/10 bg-cream/95 p-4 backdrop-blur-md">

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                className="w-full rounded-xl bg-forest py-3.5 text-sm font-medium text-cream transition-colors hover:bg-forest-light"
              >
                Show {filtered.length}{" "}
                {filtered.length === 1
                  ? "puppy"
                  : "puppies"}
              </button>

            </div>

          </div>

        </div>
      )}

      <CompareBar />
    </>
  );
}