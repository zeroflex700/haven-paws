"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ProtectedImage } from "./ProtectedMedia";

export type ViewerPhoto = {
  id: string;
  imageUrl: string;
};

export default function BreederPhotoViewer({
  photos,
  initialIndex = 0,
  onClose,
}: {
  photos: ViewerPhoto[];
  initialIndex?: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  const photo = photos[index];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        setIndex((current) =>
          current === 0 ? photos.length - 1 : current - 1
        );
      }

      if (event.key === "ArrowRight") {
        setIndex((current) =>
          current === photos.length - 1 ? 0 : current + 1
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, photos.length]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onClose}
      onContextMenu={(event) => event.preventDefault()}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo viewer"
        className="absolute top-4 right-4 z-[102] w-11 h-11 rounded-full bg-cream/10 text-cream flex items-center justify-center hover:bg-cream/20 transition-colors"
      >
        <X size={24} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[102] text-cream text-sm bg-ink/60 rounded-full px-3 py-1">
        {index + 1} / {photos.length}
      </div>

      {/* Previous */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setIndex((current) =>
              current === 0 ? photos.length - 1 : current - 1
            );
          }}
          aria-label="Previous photo"
          className="absolute left-3 md:left-6 z-[102] w-11 h-11 rounded-full bg-cream/10 text-cream flex items-center justify-center hover:bg-cream/20 transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Image */}
      <div
  className="relative w-full max-w-6xl aspect-video select-none"
  onClick={(event) => event.stopPropagation()}
  onContextMenu={(event) => event.preventDefault()}
>
  <ProtectedImage
    src={photo.imageUrl}
    alt={`Photo ${index + 1} of ${photos.length}`}
    className="object-contain select-none"
  />
</div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setIndex((current) =>
              current === photos.length - 1 ? 0 : current + 1
            );
          }}
          aria-label="Next photo"
          className="absolute right-3 md:right-6 z-[102] w-11 h-11 rounded-full bg-cream/10 text-cream flex items-center justify-center hover:bg-cream/20 transition-colors"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  );
}