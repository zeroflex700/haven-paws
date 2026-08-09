"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { getTrendingBreeds } from "@/lib/queries/recommendations";

export default function TrendingSearches() {
  const [trending, setTrending] = useState<{ breed: string; count: number }[]>([]);

  useEffect(() => {
    getTrendingBreeds().then(setTrending);
  }, []);

  if (trending.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-2">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp size={14} className="text-gold" />
        <p className="text-xs text-sage">Popular right now</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {trending.map((t) => (
          <Link
            key={t.breed}
            href={`/puppies?breed=${encodeURIComponent(t.breed)}`}
            className="text-xs bg-cream-alt text-ink px-3 py-1.5 rounded-full tap-feedback"
          >
            {t.breed}
          </Link>
        ))}
      </div>
    </div>
  );
}