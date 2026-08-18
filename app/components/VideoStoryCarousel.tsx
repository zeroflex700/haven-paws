"use client";

import { useState } from "react";
import { Play, ArrowUpRight } from "lucide-react";
import { ProtectedImage, ProtectedVideo } from "./ProtectedMedia";
import type { VideoStory } from "@/lib/queries/homepageCollections";

export default function VideoStoryCarousel({
  stories,
}: {
  stories: VideoStory[];
}) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (stories.length === 0) return null;

  return (
    <section className="hp-section bg-navy py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <p className="eyebrow text-white/50 mb-2">
              Behind the Scenes
            </p>

            <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight">
              See how your future puppy is raised
            </h2>
          </div>

          <p className="text-sm text-white/55 max-w-sm">
            A closer look at the people and moments behind the puppies you
            could soon call family.
          </p>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-3 -mx-6 px-6 snap-x no-scrollbar">
          {stories.map((s) => (
            <div key={s.id} className="w-60 sm:w-64 shrink-0 snap-start">
              <div className="aspect-[3/4] rounded-[24px] overflow-hidden bg-navy-light relative border border-white/10 shadow-2xl">
                {playingId === s.id && s.videoUrl ? (
                  <ProtectedVideo
                    src={s.videoUrl}
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {s.thumbnailUrl && (
                      <ProtectedImage
                        src={s.thumbnailUrl}
                        alt={s.personName}
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                    <button
                      onClick={() => setPlayingId(s.id)}
                      aria-label="Play video"
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <span className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110 group-active:scale-90">
                        <Play
                          size={20}
                          className="text-forest ml-0.5"
                          fill="currentColor"
                        />
                      </span>
                    </button>

                    <span className="absolute left-4 top-4 rounded-full bg-black/25 backdrop-blur-md border border-white/20 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white">
                      Story
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-start justify-between gap-3 mt-3">
                <div>
                  <p className="text-white font-semibold text-sm">
                    {s.personName}
                  </p>

                  {s.description && (
                    <p className="text-xs text-white/50 mt-0.5">
                      {s.description}
                    </p>
                  )}
                </div>

                <ArrowUpRight
                  size={15}
                  className="text-gold shrink-0 mt-0.5"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}