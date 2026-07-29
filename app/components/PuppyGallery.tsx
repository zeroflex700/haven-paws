"use client";

import { useState } from "react";
import { cldOptimized } from "@/lib/cloudinary";

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

  return (
    <div>
      <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt">
        {current.mediaType === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cldOptimized(current.url, 800)}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <video src={current.url} controls className="w-full h-full object-cover" />
        )}
      </div>
      {media.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-md overflow-hidden shrink-0 border-2 ${
                i === active ? "border-gold" : "border-transparent"
              }`}
            >
              {m.mediaType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cldOptimized(m.url, 128)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <video src={m.url} className="w-full h-full object-cover" preload="metadata" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}