"use client";

import { useEffect, useRef, useState } from "react";
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
  const [mounted, setMounted] = useState(false);
  const { terms, addTerm, clearHistory } = useSearchHistory();

  const boxRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (media.matches) return;

    let frame = 0;

    function handleMouseMove(e: MouseEvent) {
      if (!heroRef.current) return;

      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        if (!heroRef.current) return;

        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        if (visualRef.current) {
          visualRef.current.style.transform = `scale(1.045) translate3d(${
            x * -10
          }px, ${y * -8}px, 0)`;
        }

        if (contentRef.current) {
          contentRef.current.style.transform = `translate3d(${
            x * 5
          }px, ${y * 4}px, 0)`;
        }
      });
    }

    function handleMouseLeave() {
      if (visualRef.current) {
        visualRef.current.style.transform = "scale(1.035) translate3d(0, 0, 0)";
      }

      if (contentRef.current) {
        contentRef.current.style.transform = "translate3d(0, 0, 0)";
      }
    }

    const hero = heroRef.current;

    hero?.addEventListener("mousemove", handleMouseMove);
    hero?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(frame);
      hero?.removeEventListener("mousemove", handleMouseMove);
      hero?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  function goSearch(term: string) {
    if (term.trim()) {
      addTerm(term.trim());
    }

    router.push(`/puppies?search=${encodeURIComponent(term)}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    goSearch(search);
  }

  return (
    <section
      ref={heroRef}
      className="relative isolate min-h-[680px] overflow-hidden bg-forest sm:min-h-[720px] lg:min-h-[760px]"
    >
      {/* Background media */}
      <div
        ref={visualRef}
        className="absolute -inset-6 will-change-transform transition-transform duration-[1800ms] ease-out"
      >
        {heroVideo ? (
          <ProtectedVideo
            src={heroVideo}
            autoPlay
            muted
            loop
            className="absolute inset-0 h-full w-full object-cover"
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

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,29,26,0.24)_0%,rgba(8,29,26,0.12)_30%,rgba(8,29,26,0.78)_100%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,29,26,0.58)_0%,rgba(8,29,26,0.16)_50%,rgba(8,29,26,0.36)_100%)]" />

      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute left-[8%] top-[16%] h-64 w-64 rounded-full bg-gold/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[8%] h-80 w-80 rounded-full bg-sky/10 blur-[120px]" />

      {/* Fine editorial frame */}
      <div className="pointer-events-none absolute inset-4 border border-white/[0.09] sm:inset-6 lg:inset-8" />

      {/* Decorative geometry */}
      <div className="pointer-events-none absolute right-[7%] top-[14%] hidden h-40 w-40 rounded-full border border-white/[0.13] lg:block" />
      <div className="pointer-events-none absolute right-[10%] top-[17%] hidden h-24 w-24 rounded-full border border-white/[0.1] lg:block" />

      <div className="pointer-events-none absolute bottom-8 left-8 hidden items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/45 lg:flex">
        <span className="h-px w-10 bg-gold/80" />
        Curated with care
      </div>

      {/* Main composition */}
      <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl items-center px-5 pb-12 pt-24 sm:min-h-[720px] sm:px-6 sm:pb-16 sm:pt-28 lg:min-h-[760px] lg:px-10">
        <div
          ref={contentRef}
          className={`w-full max-w-3xl will-change-transform transition-[opacity,transform] duration-1000 ease-out ${
            mounted
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0"
          }`}
        >
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.16] bg-white/[0.09] px-4 py-2 backdrop-blur-xl sm:mb-7">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>

            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/85 sm:text-[10px]">
              Where New Beginnings Start
            </p>
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl font-display text-[2.65rem] leading-[0.96] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl xl:text-[5.35rem]">
            Trusted puppy placement
            <span className="block text-white/72">for the way families live.</span>
          </h1>

          {/* Gold rule */}
          <div className="mt-7 flex items-center gap-4 sm:mt-8">
            <span className="h-px w-14 bg-gold" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/45">
              Nationwide
            </span>
          </div>

          {/* Description */}
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/75 sm:mt-7 sm:text-[17px]">
            Find a puppy you can feel confident bringing home, with trusted
            breeders and support from the first search to the first night.
          </p>

          {/* Search experience */}
          <div
            ref={boxRef}
            className="relative mt-8 w-full max-w-2xl sm:mt-9"
          >
            <form
              onSubmit={handleSearch}
              className="group relative rounded-[22px] border border-white/[0.22] bg-white/[0.92] p-1.5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-shadow duration-500 focus-within:shadow-[0_28px_90px_rgba(0,0,0,0.32)]"
            >
              <Search
                size={19}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sage"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSuggestOpen(true)}
                placeholder="Search by breed or puppy name"
                className="h-[58px] w-full rounded-[17px] bg-transparent pl-12 pr-28 text-sm text-ink placeholder:text-sage/90 outline-none sm:pr-32 sm:text-[15px]"
              />

              <button
                type="submit"
                className="absolute bottom-1.5 right-1.5 top-1.5 inline-flex items-center gap-2 rounded-[17px] bg-forest px-5 text-sm font-medium text-white transition-all duration-300 hover:bg-forest-light hover:shadow-lg active:scale-[0.97]"
              >
                <span className="hidden sm:inline">Search</span>
                <Search size={15} />
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

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
            <Link
              href="/puppies"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-forest shadow-[0_12px_35px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)] active:translate-y-0 active:scale-[0.97]"
            >
              Browse All Puppies
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {reviewCount > 0 && avgRating && (
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.14] bg-white/[0.09] px-4 py-3 text-sm text-white/85 backdrop-blur-xl">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15">
                  <Star size={13} className="fill-gold text-gold" />
                </span>

                <span>
                  <strong className="font-semibold text-white">{avgRating}</strong>
                  <span className="mx-1.5 text-white/35">/</span>
                  {reviewCount} review
                  {reviewCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom fade / scroll cue */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-forest/35 to-transparent" />

      <div className="absolute bottom-8 right-8 hidden items-center gap-3 lg:flex">
        <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/45">
          Explore
        </span>
        <span className="relative h-9 w-px overflow-hidden bg-white/20">
          <span className="absolute left-0 top-0 h-4 w-px animate-[heroScroll_2s_ease-in-out_infinite] bg-gold" />
        </span>
      </div>

      <style jsx>{`
        @keyframes heroScroll {
          0%,
          100% {
            transform: translateY(-16px);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          70% {
            opacity: 1;
          }

          100% {
            transform: translateY(42px);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}