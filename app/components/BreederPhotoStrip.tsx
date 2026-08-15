"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { ProtectedImage } from "./ProtectedMedia";
import BreederPhotoViewer from "./BreederPhotoViewer";
import type { BreederPhoto } from "@/lib/queries/breeders";

export default function BreederPhotoStrip({
  breederName,
  photos,
}: {
  breederName: string;
  photos: BreederPhoto[];
}) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Camera
            size={16}
            className="text-gold"
            strokeWidth={1.5}
          />

          <h2 className="h2">
            {breederName}&apos;s photos
          </h2>
        </div>

        <div
          className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6"
          style={{
            scrollSnapType: "x mandatory",
          }}
        >
          {photos.map((p, index) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setViewerIndex(index)}
              onContextMenu={(event) => event.preventDefault()}
              className="w-40 h-52 shrink-0 rounded-lg overflow-hidden relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
              style={{
                scrollSnapAlign: "start",
              }}
              aria-label={`View photo ${index + 1} of ${photos.length}`}
            >
              <ProtectedImage
                src={p.imageUrl}
                alt={`${breederName} photo ${index + 1}`}
              />
            </button>
          ))}
        </div>
      </section>

      {viewerIndex !== null && (
        <BreederPhotoViewer
          photos={photos}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  );
}