"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

export default function PuppyGallery({
  media,
  name,
}: {
  media: { url: string; mediaType: "image" | "video" }[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (media.length === 0) {
    return (
      <div className="aspect-square rounded-lg bg-cream-alt flex items-center justify-center">
        <span className="text-sage text-sm">No photos yet</span>
      </div>
    );
  }

  const current = media[active];

  function goPrev() {
    setActive((i) => (i === 0 ? media.length - 1 : i - 1));
  }
  function goNext() {
    setActive((i) => (i === media.length - 1 ? 0 : i + 1));
  }

  return (
    <div>
      <div className="relative aspect-square rounded-lg overflow-hidden bg-cream-alt">
        {current.mediaType === "image" ? (
          <OptimizedImage src={current.url} alt={name} priority sizes="(max-width: 768px) 100vw, 50vw" />
        ) : (
          <video src={current.url} controls className="w-full h-full object-cover" />
        )}

        {media.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center active:scale-95 transition-transform"
            >
              <ChevronLeft size={20} className="text-forest" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center active:scale-95 transition-transform"
            >
              <ChevronRight size={20} className="text-forest" />
            </button>
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
              {active + 1} / {media.length}
            </span>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-md overflow-hidden shrink-0 border-2 ${
                i === active ? "border-gold" : "border-transparent"
              }`}
            >
              {m.mediaType === "image" ? (
                <OptimizedImage src={m.url} alt="" sizes="64px" />
              ) : (
                <div className="w-full h-full bg-forest flex items-center justify-center">
                  <Play size={18} className="text-cream fill-cream" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}