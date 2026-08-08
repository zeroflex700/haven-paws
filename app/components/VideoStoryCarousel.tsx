"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ProtectedImage, ProtectedVideo } from "./ProtectedMedia";
import type { VideoStory } from "@/lib/queries/homepageCollections";

export default function VideoStoryCarousel({ stories }: { stories: VideoStory[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (stories.length === 0) return null;

  return (
    <section className="bg-forest py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="eyebrow text-cream/70 mb-2 text-center">Behind the Scenes</p>
        <h2 className="h2 text-center mb-10" style={{ color: "var(--color-cream)" }}>
          See how your future puppy is raised
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
          {stories.map((s) => (
            <div key={s.id} className="w-52 shrink-0 snap-start">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-forest-light relative">
                {playingId === s.id && s.videoUrl ? (
                  <ProtectedVideo src={s.videoUrl} autoPlay className="w-full h-full object-cover" />
                ) : (
                  <>
                    {s.thumbnailUrl && <ProtectedImage src={s.thumbnailUrl} alt={s.personName} />}
                    <button
                      onClick={() => setPlayingId(s.id)}
                      aria-label="Play video"
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-active:scale-90">
                        <Play size={20} className="text-forest ml-0.5" />
                      </span>
                    </button>
                  </>
                )}
              </div>
              <p className="text-cream font-medium text-sm mt-2">{s.personName}</p>
              {s.description && <p className="text-xs text-cream/60">{s.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}