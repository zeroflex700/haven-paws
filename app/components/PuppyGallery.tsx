"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Images } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

export default function PuppyGallery({
  media,
  name,
}: {
  media: { url: string; mediaType: "image" | "video" }[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (media.length === 0) {
    return (
      <div className="aspect-square rounded-lg bg-cream-alt flex items-center justify-center">
        <span className="text-sage text-sm">No photos yet</span>
      </div>
    );
  }

  const current = media[active];

  function goPrev() {
    setIsPlaying(false);
    setActive((i) => (i === 0 ? media.length - 1 : i - 1));
  }

  function goNext() {
    setIsPlaying(false);
    setActive((i) => (i === media.length - 1 ? 0 : i + 1));
  }

  function selectThumbnail(i: number) {
    setIsPlaying(false);
    setActive(i);
  }

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div>
      <div className="relative aspect-square rounded-lg overflow-hidden bg-cream-alt">
        {current.mediaType === "image" ? (
          <OptimizedImage
            src={current.url}
            alt={name}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="relative w-full h-full" onClick={togglePlayback}>
            <video
              ref={videoRef}
              src={current.url}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <span className="w-16 h-16 rounded-full bg-white/85 flex items-center justify-center">
                  <Play size={28} className="text-forest fill-forest ml-1" />
                </span>
              </div>
            )}
          </div>
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

            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-white text-forest text-xs font-medium px-3 py-2 rounded-full shadow-sm">
              <Images size={14} strokeWidth={2} />
              View {media.length} photos
            </span>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => selectThumbnail(i)}
              className={`relative w-16 h-16 rounded-md overflow-hidden shrink-0 border-2 ${
                i === active ? "border-gold" : "border-transparent"
              }`}
            >
              {m.mediaType === "image" ? (
                <OptimizedImage src={m.url} alt="" sizes="64px" />
              ) : (
                <div className="relative w-full h-full bg-forest flex items-center justify-center">
                  <video
                    src={m.url}
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Play size={18} className="text-cream fill-cream" />
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}