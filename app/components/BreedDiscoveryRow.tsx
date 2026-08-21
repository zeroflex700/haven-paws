"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import OptimizedImage from "./OptimizedImage";

type Breed = {
  id: string;
  name: string;
  image_url: string | null;
};

const FILTERS = [
  { key: "popular", label: "Popular" },
  { key: "family", label: "Good with Families" },
  { key: "apartment", label: "Small Breeds" },
  { key: "allergy", label: "Allergy-Friendly" },
  { key: "active", label: "Active" },
];

export default function BreedDiscoveryRow({ breeds }: { breeds: Breed[] }) {
  const [breedSearch, setBreedSearch] = useState("");
  const [location, setLocation] = useState("");
  const [activeFilter, setActiveFilter] = useState("popular");
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  }

  const filtered = useMemo(() => {
    return breeds.filter((breed) =>
      breed.name.toLowerCase().includes(breedSearch.toLowerCase())
    );
  }, [breeds, breedSearch]);

  const searchHref = `/puppies?search=${encodeURIComponent(
    breedSearch
  )}${location.trim() ? `&location=${encodeURIComponent(location.trim())}` : ""}`;

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      {/* Subtle editorial background */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[38%] bg-cream-alt/70" />
      <div className="pointer-events-none absolute right-[8%] top-12 h-56 w-56 rounded-full bg-gold/10 blur-[90px]" />

      <div className="relative hp-container">
        {/* Compact editorial header */}
        <div className="grid gap-8 border-b border-forest/10 pb-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold" />
              <p className="eyebrow">Find Your Match</p>
            </div>

            <h2 className="max-w-xl font-display text-3xl leading-[1.02] tracking-[-0.035em] text-forest sm:text-4xl lg:text-5xl">
              Start with the dog that fits
              <span className="text-forest/55"> your life.</span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-md text-sm leading-relaxed text-ink/65 sm:text-[15px]">
              Explore breeds by personality, lifestyle, size, and the qualities
              that matter most to your family.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-sage">
              <Sparkles size={14} className="text-gold" />
              <span>{breeds.length} breeds to explore</span>
            </div>
          </div>
        </div>

        {/* Discovery controls */}
        <div className="mt-6 grid gap-3 lg:grid-cols-[1.35fr_1fr_auto]">
          <div className="group relative">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sage transition-colors group-focus-within:text-forest"
            />

            <input
              value={breedSearch}
              onChange={(e) => setBreedSearch(e.target.value)}
              placeholder="Search a breed"
              className="h-14 w-full rounded-2xl border border-forest/10 bg-cream-alt/60 pl-11 pr-11 text-sm text-ink outline-none transition-all placeholder:text-sage focus:border-gold focus:bg-white focus:shadow-[0_10px_35px_rgba(23,63,58,0.06)]"
            />

            {breedSearch && (
              <button
                type="button"
                onClick={() => setBreedSearch("")}
                aria-label="Clear breed search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-sage transition-colors hover:bg-forest/5 hover:text-forest"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="group relative">
            <MapPin
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sage transition-colors group-focus-within:text-forest"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="h-14 w-full rounded-2xl border border-forest/10 bg-cream-alt/60 pl-11 pr-4 text-sm text-ink outline-none transition-all placeholder:text-sage focus:border-gold focus:bg-white focus:shadow-[0_10px_35px_rgba(23,63,58,0.06)]"
            />
          </div>

          <Link
            href={searchHref}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-forest px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-light hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
          >
            Explore matches
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Lifestyle filters */}
        <div className="mt-5 flex items-center gap-3">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-forest/10 bg-white text-forest sm:flex">
            <SlidersHorizontal size={16} />
          </div>

          <div className="no-scrollbar flex min-w-0 gap-2 overflow-x-auto py-1">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key;

              return (
                <Link
                  key={filter.key}
                  href={
                    filter.key === "popular"
                      ? "/puppies"
                      : `/lifestyle#${filter.key}`
                  }
                  onClick={() => setActiveFilter(filter.key)}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-medium transition-all duration-300 sm:text-sm ${
                    isActive
                      ? "border-forest bg-forest text-white shadow-[0_8px_20px_rgba(23,63,58,0.14)]"
                      : "border-forest/10 bg-white text-forest hover:border-gold hover:bg-yellow/40"
                  }`}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Breed rail header */}
        <div className="mt-10 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              Browse breeds
            </p>

            <p className="mt-2 text-sm text-ink/55">
              {filtered.length === breeds.length
                ? "Discover a personality that feels like home."
                : `${filtered.length} ${
                    filtered.length === 1 ? "breed" : "breeds"
                  } found.`}
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-360)}
              aria-label="Scroll breeds left"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-forest/10 bg-white text-forest transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md active:translate-y-0 active:scale-95"
            >
              <ChevronLeft size={17} />
            </button>

            <button
              type="button"
              onClick={() => scrollBy(360)}
              aria-label="Scroll breeds right"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-forest text-white transition-all hover:-translate-y-0.5 hover:bg-forest-light hover:shadow-md active:translate-y-0 active:scale-95"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        {/* Horizontal discovery rail */}
        <div
          ref={scrollRef}
          className="no-scrollbar -mx-6 mt-5 flex gap-4 overflow-x-auto px-6 pb-4 sm:-mx-0 sm:px-0"
        >
          {filtered.length > 0 ? (
            filtered.map((breed, index) => (
              <Link
                key={breed.id}
                href={`/puppies?breed=${encodeURIComponent(breed.name)}`}
                className="group relative w-[190px] shrink-0 sm:w-[215px] lg:w-[230px]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-cream-alt shadow-[0_8px_30px_rgba(23,63,58,0.06)]">
                  <OptimizedImage
                    src={breed.image_url}
                    alt={breed.name}
                    sizes="(max-width: 640px) 190px, (max-width: 1024px) 215px, 230px"
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-forest/75 via-forest/5 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                  <div
                    className={`absolute left-4 top-4 h-2.5 w-2.5 rounded-full ${
                      index % 4 === 0
                        ? "bg-gold"
                        : index % 4 === 1
                        ? "bg-blue"
                        : index % 4 === 2
                        ? "bg-lavender"
                        : "bg-yellow"
                    } shadow-sm`}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <div className="flex items-end justify-between gap-3">
                      <p className="font-display text-xl leading-tight text-white sm:text-2xl">
                        {breed.name}
                      </p>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-gold group-hover:text-forest">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex min-h-[260px] w-full items-center justify-center rounded-[26px] border border-dashed border-forest/15 bg-cream-alt/60 px-6 text-center">
              <div>
                <p className="font-display text-xl text-forest">
                  No breeds found
                </p>

                <p className="mt-2 text-sm text-sage">
                  Try another breed name or clear your search.
                </p>

                <button
                  type="button"
                  onClick={() => setBreedSearch("")}
                  className="mt-4 text-sm font-medium text-forest underline decoration-gold underline-offset-4"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile rail controls */}
        <div className="mt-2 flex items-center justify-between sm:hidden">
          <span className="text-xs text-sage">
            Swipe to explore
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-260)}
              aria-label="Scroll breeds left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/10 bg-white text-forest active:scale-95"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => scrollBy(260)}
              aria-label="Scroll breeds right"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-white active:scale-95"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}