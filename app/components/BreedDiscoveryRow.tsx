"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
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

// Slow, continuous auto-scroll speed. Kept deliberately gentle.
const AUTO_SCROLL_PX_PER_SEC = 26;

// How long to wait after the user releases/lets go before the
// auto-scroll resumes, so it doesn't fight momentum scrolling.
const RESUME_DELAY_MS = 700;
const RESUME_DELAY_AFTER_BUTTON_MS = 1500;

export default function BreedDiscoveryRow({ breeds }: { breeds: Breed[] }) {
  const [activeFilter, setActiveFilter] = useState("popular");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = breeds;

  // Whether the ticker should currently advance. A ref (not state) so
  // pausing/resuming never triggers a re-render — the rAF loop just
  // reads it every frame.
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    prefersReducedMotionRef.current = mediaQuery.matches;

    function handleChange(event: MediaQueryListEvent) {
      prefersReducedMotionRef.current = event.matches;
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  function pauseAutoScroll() {
    isPausedRef.current = true;

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }

  function scheduleResume(delay: number) {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, delay);
  }

  function scrollBy(amount: number) {
    pauseAutoScroll();
    scrollRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
    scheduleResume(RESUME_DELAY_AFTER_BUTTON_MS);
  }

  // Continuous slow auto-scroll, looping seamlessly by wrapping the
  // scroll position back once the (duplicated) content has scrolled
  // past one full set — since both halves are identical, the wrap is
  // invisible to the eye.
  useEffect(() => {
    const el = scrollRef.current;

    if (!el || filtered.length <= 1) {
      return;
    }

    function step(timestamp: number) {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaMs = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      if (
        el &&
        !isPausedRef.current &&
        !prefersReducedMotionRef.current
      ) {
        const singleSetWidth = el.scrollWidth / 2;

        el.scrollLeft +=
          (AUTO_SCROLL_PX_PER_SEC * deltaMs) / 1000;

        if (singleSetWidth > 0 && el.scrollLeft >= singleSetWidth) {
          el.scrollLeft -= singleSetWidth;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lastTimestampRef.current = null;
    };
  }, [filtered.length]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  const canLoop = filtered.length > 1;

  function renderCard(breed: Breed, index: number, isDuplicate: boolean) {
    return (
      <Link
        key={`${breed.id}-${isDuplicate ? "dup" : "orig"}`}
        href={`/puppies?breed=${encodeURIComponent(breed.name)}`}
        aria-hidden={isDuplicate ? true : undefined}
        tabIndex={isDuplicate ? -1 : undefined}
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
    );
  }

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      {/* Subtle editorial background */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[38%] bg-cream-alt/70" />
      <div className="pointer-events-none absolute right-[8%] top-12 h-56 w-56 rounded-full bg-gold/10 blur-[90px]" />

      <div className="relative hp-container">
        {/* Lifestyle filters */}
        <div className="flex items-center gap-3">
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
          onPointerDown={pauseAutoScroll}
          onPointerUp={() => scheduleResume(RESUME_DELAY_MS)}
          onPointerLeave={() => scheduleResume(RESUME_DELAY_MS)}
          onPointerCancel={() => scheduleResume(RESUME_DELAY_MS)}
          onTouchStart={pauseAutoScroll}
          onTouchEnd={() => scheduleResume(RESUME_DELAY_MS)}
          className="no-scrollbar -mx-6 mt-5 flex gap-4 overflow-x-auto px-6 pb-4 sm:-mx-0 sm:px-0"
        >
          {filtered.length > 0 ? (
            <>
              {filtered.map((breed, index) =>
                renderCard(breed, index, false)
              )}

              {/* Duplicate set — only rendered when there's enough
                  content to loop, so the ticker can wrap seamlessly
                  instead of jump-cutting back to the start. Hidden
                  from screen readers and keyboard tabbing. */}
              {canLoop &&
                filtered.map((breed, index) =>
                  renderCard(breed, index, true)
                )}
            </>
          ) : (
            <div className="flex min-h-[260px] w-full items-center justify-center rounded-[26px] border border-dashed border-forest/15 bg-cream-alt/60 px-6 text-center">
              <div>
                <p className="font-display text-xl text-forest">
                  No breeds found
                </p>

                <p className="mt-2 text-sm text-sage">
                  Try another breed name or clear your search.
                </p>
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
