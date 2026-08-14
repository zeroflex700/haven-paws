"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavoriteBreeds } from "@/lib/hooks/useFavoriteBreeds";

export default function FavoriteBreedsRow() {
  const { favoriteBreeds } = useFavoriteBreeds();
  if (favoriteBreeds.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-2">
      <div className="flex items-center gap-2 mb-2">
        <Heart size={14} className="fill-gold text-gold" />
        <p className="text-xs text-sage">Your favorite breeds</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {favoriteBreeds.map((b) => (
          <Link
            key={b}
            href={`/puppies?breed=${encodeURIComponent(b)}`}
            className="text-xs bg-gold/10 border border-gold/30 text-forest px-3 py-1.5 rounded-full tap-feedback"
          >
            {b}
          </Link>
        ))}
      </div>
    </div>
  );
}