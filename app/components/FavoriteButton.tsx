"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";

export default function FavoriteButton({
  puppyId,
  size = 16,
  className = "",
}: {
  puppyId: string;
  size?: number;
  className?: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(puppyId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(puppyId);
      }}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      className={`w-8 h-8 rounded-full bg-white/90 flex items-center justify-center active:scale-90 transition-transform ${className}`}
    >
      <Heart
        size={size}
        className={`transition-colors duration-200 ${active ? "fill-gold text-gold" : "text-forest"}`}
      />
    </button>
  );
}