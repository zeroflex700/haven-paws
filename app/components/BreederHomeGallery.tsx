"use client";

import { useState } from "react";
import { Home, X, ChevronLeft, ChevronRight } from "lucide-react";
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

  function previousPhoto() {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1
    );
  }

  function nextPhoto() {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1
    );
  }

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

        <div className="grid grid-cols-2 gap-2">
          {photos.slice(0, 4).map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative overflow-hidden rounded-lg text-left cursor-pointer ${
                index === 0
                  ? "col-span-2 aspect-video"
                  : "aspect-square"
              }`}
              aria-label={`View photo ${index + 1} of ${photos.length}`}
            >
              <ProtectedImage
                src={photo.imageUrl}
                alt={title}
              />

              {index === 3 && photos.length > 4 && (
                <div className="absolute inset-0 bg-forest/60 flex items-center justify-center text-cream text-sm font-medium">
                  +{photos.length - 4} photos
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {selectedPhoto && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-5 right-5 z-10 text-white/90 hover:text-white p-2"
            aria-label="Close gallery"
          >
            <X size={28} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              previousPhoto();
            }}
            className="absolute left-3 md:left-6 z-10 text-white/90 hover:text-white p-3"
            aria-label="Previous photo"
          >
            <ChevronLeft size={36} />
          </button>

          <div
            className="relative w-full max-w-5xl h-[80vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <ProtectedImage
              src={selectedPhoto.imageUrl}
              alt={`${title} photo ${selectedIndex + 1}`}
            />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              nextPhoto();
            }}
            className="absolute right-3 md:right-6 z-10 text-white/90 hover:text-white p-3"
            aria-label="Next photo"
          >
            <ChevronRight size={36} />
          </button>

          <div className="absolute bottom-5 left-0 right-0 text-center text-white/80 text-sm">
            {selectedIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}