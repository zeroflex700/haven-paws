"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { ProtectedVideo } from "./ProtectedMedia";
import OptimizedImage from "./OptimizedImage";
import SearchSuggestionsDropdown from "./SearchSuggestionsDropdown";
import { useSearchHistory } from "@/lib/hooks/useSearchHistory";

export default function HomeHero({
  heroImage,
  heroVideo,
  reviewCount,
  avgRating,
}: {
  heroImage: string | null;
  heroVideo: string | null;
  reviewCount: number;
  avgRating: number | null;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const { terms, addTerm, clearHistory } = useSearchHistory();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setSuggestOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goSearch(term: string) {
    if (term.trim()) addTerm(term.trim());
    router.push(`/puppies?search=${encodeURIComponent(term)}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    goSearch(search);
  }

  return (
    <section className="relative h-[560px] overflow-hidden">
      {heroVideo ? (
        <ProtectedVideo
          src={heroVideo}
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : heroImage ? (
        <div className="absolute inset-0">
          <OptimizedImage src={heroImage} alt="Haven Paws" priority sizes="100vw" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-forest" />
      )}
      <div className="absolute inset-0 bg-forest/50" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow text-white/90 mb-2">Where New Beginnings Start</p>
        <h1 className="font-display text-3xl text-white mb-6 max-w-md">
          Trusted puppy placement, nationwide
        </h1>

        <div ref={boxRef} className="w-full max-w-md relative mb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSuggestOpen(true)}
              placeholder="Search by breed or puppy name"
              className="w-full bg-white rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none"
            />
          </form>
          {suggestOpen && (
            <SearchSuggestionsDropdown
              query={search}
              history={terms}
              onSelect={(term) => {
                setSuggestOpen(false);
                goSearch(term);
              }}
              onClearHistory={clearHistory}
            />
          )}
        </div>

        <Link
          href="/puppies"
          className="bg-gold text-forest px-6 py-3 rounded-full font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          Browse All Puppies
        </Link>

        {reviewCount > 0 && avgRating && (
          <div className="flex items-center gap-2 mt-8 text-white/90 text-sm">
            <Star size={16} className="fill-gold text-gold" />
            <span>
              {avgRating} · {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}