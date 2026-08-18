"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Star, ArrowRight } from "lucide-react";
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
      if (
        boxRef.current &&
        !boxRef.current.contains(e.target as Node)
      ) {
        setSuggestOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goSearch(term: string) {
    if (term.trim()) {
      addTerm(term.trim());
    }

    router.push(
      `/puppies?search=${encodeURIComponent(term)}`
    );
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    goSearch(search);
  }

  return (
    <section className="relative overflow-hidden bg-forest min-h-[720px] sm:min-h-[760px] lg:min-h-[800px]">
      {/* Portrait video / image area */}
      <div className="absolute inset-0">
        {heroVideo ? (
          <ProtectedVideo
            src={heroVideo}
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : heroImage ? (
          <OptimizedImage
            src={heroImage}
            alt="Haven Paws"
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-forest" />
        )}
      </div>

      {/* Image/video readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#102d2a]/35 via-[#102d2a]/35 to-[#102d2a]/80" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#102d2a]/45 via-transparent to-[#102d2a]/30" />

      {/* Decorative rings */}
      <div className="absolute top-16 right-[8%] w-40 h-40 rounded-full border border-white/15 pointer-events-none" />
      <div className="absolute top-24 right-[10%] w-24 h-24 rounded-full border border-white/10 pointer-events-none" />

      {/* Centered portrait composition */}
      <div className="relative z-10 min-h-[720px] sm:min-h-[760px] lg:min-h-[800px] flex flex-col items-center justify-center px-5 sm:px-6 text-center">
        <div className="w-full max-w-2xl pt-10 sm:pt-14">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />

            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-white/90">
              Where New Beginnings Start
            </p>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.98] tracking-[-0.025em] text-white max-w-2xl mx-auto mb-5 sm:mb-6">
            Trusted puppy placement, nationwide
          </h1>

          {/* Description */}
          <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-7 sm:mb-8">
            Find a puppy you can feel confident bringing home, with trusted
            breeders and support from the first search to the first night.
          </p>

          {/* Search */}
          <div
            ref={boxRef}
            className="w-full max-w-xl mx-auto relative mb-4"
          >
            <form
              onSubmit={handleSearch}
              className="relative flex items-center rounded-2xl bg-white p-1.5 shadow-2xl shadow-black/20"
            >
              <Search
                size={19}
                className="absolute left-5 text-sage pointer-events-none"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSuggestOpen(true)}
                placeholder="Search by breed or puppy name"
                className="w-full bg-transparent rounded-xl pl-12 pr-28 py-3.5 text-sm text-ink placeholder:text-sage focus:outline-none"
              />

              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 rounded-xl bg-forest text-white px-5 text-sm font-medium hover:bg-forest-light transition-colors"
              >
                Search
              </button>
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

          {/* Browse + rating */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/puppies"
              className="inline-flex items-center gap-2 bg-gold text-forest px-6 py-3.5 rounded-full font-semibold hover:bg-gold-light active:scale-95 transition-all shadow-lg shadow-black/10"
            >
              Browse All Puppies
              <ArrowRight size={15} />
            </Link>

            {reviewCount > 0 && avgRating && (
              <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md px-4 py-3 text-white/90 text-sm">
                <Star
                  size={15}
                  className="fill-gold text-gold"
                />

                <span>
                  {avgRating} · {reviewCount} review
                  {reviewCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}