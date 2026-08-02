"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cldOptimized } from "@/lib/cloudinary";
import type { LifestyleBreed } from "../data/lifestyleCategories";

export default function BreedCarousel({
  breeds,
  imageMap,
}: {
  breeds: LifestyleBreed[];
  imageMap: Record<string, string>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x scroll-smooth"
      >
        {breeds.map((b) => {
          const image = imageMap[b.name];
          return (
            <Link
              key={b.name}
              href={`/puppies?breed=${encodeURIComponent(b.name)}`}
              className="w-40 shrink-0 snap-start"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-cream-alt">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cldOptimized(image, 400)}
                    alt={b.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sage text-xs text-center px-2">
                    Photo coming soon
                  </div>
                )}
              </div>
              <p className="text-forest font-medium text-sm mt-2">{b.name}</p>
              <p className="text-xs text-sage">{b.trait}</p>
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => scrollBy(-180)}
        aria-label="Scroll left"
        className="absolute left-0 top-[35%] -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center"
      >
        <ChevronLeft size={18} className="text-forest" />
      </button>
      <button
        onClick={() => scrollBy(180)}
        aria-label="Scroll right"
        className="absolute right-0 top-[35%] -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center"
      >
        <ChevronRight size={18} className="text-forest" />
      </button>
    </div>
  );
}