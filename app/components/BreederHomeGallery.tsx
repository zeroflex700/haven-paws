"use client";

import { useState } from "react";
import { Home, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ProtectedImage } from "./ProtectedMedia";
import type { BreederHomePhoto } from "@/lib/queries/breeders";

export default function BreederHomeGallery({
  title,
  photos,
}: {
  title: string;
  photos: BreederHomePhoto[];
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const selectedPhoto =
    selectedIndex !== null ? photos[selectedIndex] : null;

  const showPrevious = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1
    );
  };

  const showNext = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1
    );
  };

  return (
    <>
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Home
            size={16}
            className="text-gold"
            strokeWidth={1.5}
          />

          <h2 className="h2">{title}</h2>
        </div>

        {/* Landscape gallery */}
        <div className="grid grid-cols-2 gap-2">
          {photos.slice(0, 4).map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative overflow-hidden rounded-lg bg-cream-alt ${
                index === 0
                  ? "col-span-2 aspect-video"
                  : "aspect-video"
              }`}
            >
              <ProtectedImage
                src={photo.imageUrl}
                alt={title}
              />

              {index === 3 && photos.length > 4 && (
                <div className="absolute inset-0 bg-forest/60 flex items-center justify-center text-cream text-sm font-medium">
                  +{photos.length - 4} more
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Contained landscape photo viewer */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image stays inside a landscape frame */}
            <ProtectedImage
              src={selectedPhoto.imageUrl}
              alt={title}
              className="bg-black"
            />

            {/* Close */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close gallery"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center"
            >
              <X size={22} strokeWidth={1.8} />
            </button>

            {/* Previous */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Next */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={showNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Counter */}
            {photos.length > 1 && selectedIndex !== null && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                {selectedIndex + 1} / {photos.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}