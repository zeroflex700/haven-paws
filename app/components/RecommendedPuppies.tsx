"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import PedigreeCard from "./PedigreeCard";
import { useRecentlyViewed } from "@/lib/hooks/useRecentlyViewed";
import { getRecommendedPuppies } from "@/lib/queries/recommendations";
import type { PuppyRecord } from "@/lib/queries/puppies";

export default function RecommendedPuppies({
excludeId,
}: {
excludeId?: string;
}) {
const { items } = useRecentlyViewed();
const [puppies, setPuppies] = useState<PuppyRecord[]>([]);
const [loading, setLoading] = useState(true);

const breedNames = useMemo(
() =>
Array.from(
new Set(
items
.filter((i) => i.type === "puppy" && i.breed)
.map((i) => i.breed as string)
)
),
[items]
);

useEffect(() => {
if (breedNames.length === 0) {
setPuppies([]);
setLoading(false);
return;
}

const excludeIds = [excludeId, ...items.map((i) => i.id)].filter(
  (id): id is string => !!id
);

setLoading(true);

getRecommendedPuppies(breedNames, excludeIds)
  .then(setPuppies)
  .finally(() => setLoading(false));

}, [breedNames, items, excludeId]);

if (loading || puppies.length === 0) return null;

return (
<section className="relative overflow-hidden py-10 sm:py-14 lg:py-16">
{/* Ambient background */}
<div className="absolute inset-0 bg-[#eef6f7]" />

  <div className="absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-white/60 blur-3xl" />
  <div className="absolute -bottom-32 left-[5%] h-80 w-80 rounded-full bg-[#d7e8e8]/50 blur-3xl" />

  <div className="relative hp-container">
    {/* Compact editorial header */}
    <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-forest/10 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur-md">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20">
            <Sparkles size={11} className="text-forest" />
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-forest/70">
            Personalized for you
          </span>
        </div>

        <h2 className="font-display text-3xl leading-[1.05] text-forest sm:text-4xl">
          Puppies that caught
          <span className="block text-forest/55">
            our attention for you.
          </span>
        </h2>

        <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/65">
          Selected from the breeds and puppies you&apos;ve been exploring.
          Your next favorite might be right here.
        </p>
      </div>

      <Link
        href="/puppies"
        className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-forest transition-colors hover:text-forest-light"
      >
        <span className="border-b border-gold pb-1 transition-colors group-hover:border-forest">
          Explore all puppies
        </span>

        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-forest/10 bg-white transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight size={14} />
        </span>
      </Link>
    </div>

    {/* Recommendation rail */}
    <div className="relative">
      {/* Soft frame */}
      <div className="absolute -inset-2 rounded-[32px] border border-white/60 bg-white/25 backdrop-blur-sm sm:-inset-3" />

      <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {puppies.map((p, index) => (
          <div
            key={p.id}
            className="group relative min-w-0"
          >
            {/* Number marker */}
            <div className="pointer-events-none absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-forest/90 text-[10px] font-semibold text-white shadow-lg backdrop-blur-md">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="relative rounded-[24px] border border-white/70 bg-white/80 p-1.5 shadow-[0_14px_40px_rgba(20,40,61,0.07)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_22px_50px_rgba(20,40,61,0.13)]">
              <PedigreeCard
                {...p}
                image={p.coverImage}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recommendation context */}
    <div className="mt-6 flex flex-col gap-3 border-t border-forest/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
        </span>

        <p className="text-xs text-ink/55">
          Recommendations update as you discover more puppies.
        </p>
      </div>

      {breedNames.length > 0 && (
        <p className="text-xs text-forest/60">
          Inspired by your interest in{" "}
          <span className="font-semibold text-forest">
            {breedNames.slice(0, 2).join(" & ")}
            {breedNames.length > 2 ? " and more" : ""}
          </span>
        </p>
      )}
    </div>
  </div>
</section>

);
}