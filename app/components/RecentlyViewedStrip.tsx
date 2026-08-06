"use client";

import Link from "next/link";
import { useRecentlyViewed } from "@/lib/hooks/useRecentlyViewed";
import OptimizedImage from "./OptimizedImage";

export default function RecentlyViewedStrip() {
  const { items } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
      <h2 className="h3 mb-3">Recently viewed</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="w-28 shrink-0 snap-start">
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt mb-1.5">
              <OptimizedImage src={item.image} alt={item.name} sizes="112px" />
            </div>
            <p className="text-xs text-forest font-medium truncate">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}