"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section className="hp-section hp-section-blue py-16 md:py-20">
      <div className="hp-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow mb-2">Just For You</p>
            <h2 className="h2">Puppies you might love</h2>
          </div>

          <Link
            href="/puppies"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-forest-light"
          >
            Browse all
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-7">
          {puppies.map((p) => (
            <div
              key={p.id}
              className="rounded-[22px] bg-white/70 p-2 shadow-sm"
            >
              <PedigreeCard
                {...p}
                image={p.coverImage}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}