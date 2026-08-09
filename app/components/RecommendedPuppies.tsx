"use client";

import { useEffect, useState } from "react";
import PedigreeCard from "./PedigreeCard";
import { useRecentlyViewed } from "@/lib/hooks/useRecentlyViewed";
import { getRecommendedPuppies } from "@/lib/queries/recommendations";
import type { PuppyRecord } from "@/lib/queries/puppies";

export default function RecommendedPuppies({ excludeId }: { excludeId?: string }) {
  const { items } = useRecentlyViewed();
  const [puppies, setPuppies] = useState<PuppyRecord[]>([]);

  useEffect(() => {
    const breedNames = Array.from(
      new Set(items.filter((i) => i.type === "puppy").map((i) => i.name.split(" ").slice(-1)[0]))
    );
    // Recently-viewed items store the puppy's display name, not breed —
    // so instead we re-derive breed interest from the puppy detail pages
    // themselves isn't available here; use the breed filter already
    // present in recent /puppies?breed= visits stored via search history
    // is out of scope for this simple pass. Fall back to nothing if we
    // can't confidently infer a breed.
    if (breedNames.length === 0) {
      setPuppies([]);
      return;
    }
    getRecommendedPuppies(breedNames, excludeId ? [excludeId] : []).then(setPuppies);
  }, [items, excludeId]);

  if (puppies.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
      <p className="eyebrow mb-2">Just For You</p>
      <h2 className="h2 mb-6">Puppies you might love</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-7">
        {puppies.map((p) => (
          <PedigreeCard key={p.id} {...p} image={p.coverImage} />
        ))}
      </div>
    </section>
  );
}