"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  }

  const filtered = breeds.filter((b) =>
    b.name.toLowerCase().includes(breedSearch.toLowerCase())
  );

  return (
    <section className="hp-section hp-section-cream py-16 md:py-20">
      <div className="hp-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div>
            <p className="eyebrow mb-2">Find Your Match</p>
            <h2 className="h2">Start with what feels right</h2>
          </div>

          <p className="small-text max-w-sm">
            Explore breeds by personality, lifestyle, and the qualities that
            matter most to your family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mb-6">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sage"
            />

            <input
              value={breedSearch}
              onChange={(e) => setBreedSearch(e.target.value)}
              placeholder="Search a breed"
              className="w-full bg-white border border-forest/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm shadow-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sage"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="w-full bg-white border border-forest/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm shadow-sm focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-5 -mx-6 px-6 no-scrollbar">
          {FILTERS.map((f, i) => (
            <Link
              key={f.key}
              href={
                f.key === "popular"
                  ? "/puppies"
                  : `/lifestyle#${f.key}`
              }
              className={`shrink-0 text-sm px-4 py-2.5 rounded-full whitespace-nowrap tap-feedback border ${
                i === 0
                  ? "bg-forest text-white border-forest"
                  : "bg-white text-forest border-forest/10 hover:border-gold"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-3 -mx-6 px-6 snap-x scroll-smooth no-scrollbar"
        >
          {filtered.map((b, index) => (
            <Link
              key={b.id}
              href={`/puppies?breed=${encodeURIComponent(b.name)}`}
              className="w-40 sm:w-44 shrink-0 snap-start group"
            >
              <div
                className={`aspect-square rounded-[22px] overflow-hidden mb-3 p-1 ${
                  index % 3 === 0
                    ? "bg-yellow"
                    : index % 3 === 1
                    ? "bg-blue"
                    : "bg-lavender"
                }`}
              >
                <div className="w-full h-full rounded-[18px] overflow-hidden bg-white">
                  <OptimizedImage
                    src={b.image_url}
                    alt={b.name}
                    sizes="176px"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <p className="text-sm text-forest font-semibold text-center">
                {b.name}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex justify-between items-center mt-5">
          <p className="text-xs text-sage">
            {filtered.length} breeds available
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => scrollBy(-220)}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full bg-white border border-forest/10 flex items-center justify-center hover:border-gold active:scale-95 transition-all"
            >
              <ChevronLeft size={16} className="text-forest" />
            </button>

            <button
              onClick={() => scrollBy(220)}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full bg-white border border-forest/10 flex items-center justify-center hover:border-gold active:scale-95 transition-all"
            >
              <ChevronRight size={16} className="text-forest" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}