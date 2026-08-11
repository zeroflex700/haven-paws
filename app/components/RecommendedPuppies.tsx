"use client";

import { useEffect, useState } from "react";
import PedigreeCard from "./PedigreeCard";
import { useRecentlyViewed } from "@/lib/hooks/useRecentlyViewed";
import { getRecommendedPuppies } from "@/lib/queries/recommendations";
import type { PuppyRecord } from "@/lib/queries/puppies";

export default function RecommendedPuppies({ excludeId }: { excludeId?: string }) {
  const { items } = useRecentlyViewed();
  const [puppies, setPuppies] = useState<PuppyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const breedNames = Array.from(
      new Set(
        items
          .filter((i) => i.type === "puppy" && i.breed)
          .map((i) => i.breed as string)
      )
    );

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
  }, [items, excludeId]);

  if (loading || puppies.length === 0) return null;

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