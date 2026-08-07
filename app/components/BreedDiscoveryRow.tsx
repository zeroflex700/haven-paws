"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

type Breed = { id: string; name: string; image_url: string | null };

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
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  const filtered = breeds.filter((b) => b.name.toLowerCase().includes(breedSearch.toLowerCase()));

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage" />
          <input
            value={breedSearch}
            onChange={(e) => setBreedSearch(e.target.value)}
            placeholder="Search a breed"
            className="w-full border border-sage/30 rounded-full pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your location"
          className="flex-1 border border-sage/30 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "popular" ? "/puppies" : `/lifestyle#${f.key}`}
            className="shrink-0 bg-cream-alt text-ink text-sm px-4 py-2 rounded-full whitespace-nowrap"
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x scroll-smooth">
        {filtered.map((b) => (
          <Link key={b.id} href={`/puppies?breed=${encodeURIComponent(b.name)}`} className="w-36 shrink-0 snap-start">
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt mb-2">
              <OptimizedImage src={b.image_url} alt={b.name} sizes="144px" />
            </div>
            <p className="text-sm text-forest font-medium text-center">{b.name}</p>
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={() => scrollBy(-160)}
          aria-label="Scroll left"
          className="w-9 h-9 rounded-full border border-sage/30 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft size={16} className="text-forest" />
        </button>
        <button
          onClick={() => scrollBy(160)}
          aria-label="Scroll right"
          className="w-9 h-9 rounded-full border border-sage/30 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronRight size={16} className="text-forest" />
        </button>
      </div>
    </section>
  );
}