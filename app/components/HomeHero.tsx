"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { ProtectedVideo } from "./ProtectedMedia";
import { cldOptimized } from "@/lib/cloudinary";

export default function HomeHero({
  heroImage,
  heroVideo,
  reviewCount,
  avgRating,
}: {
  heroImage: string | null;
  heroVideo: string | null;
  reviewCount: number;
  avgRating: number | null;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/puppies?search=${encodeURIComponent(search)}`);
  }

  return (
    <section className="relative h-[560px] overflow-hidden">
      {heroVideo ? (
        <ProtectedVideo
          src={heroVideo}
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cldOptimized(heroImage, 1200)}
          alt="Haven Paws"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-forest" />
      )}
      <div className="absolute inset-0 bg-forest/50" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow text-white/90 mb-2">Where New Beginnings Start</p>
        <h1 className="font-display text-2xl text-white mb-6 max-w-md">
          Trusted puppy placement, nationwide
        </h1>

        <form onSubmit={handleSearch} className="w-full max-w-md relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by breed or puppy name"
            className="w-full bg-white rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none"
          />
        </form>

        <Link
          href="/puppies"
          className="bg-gold text-forest px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Browse All Puppies
        </Link>

        {reviewCount > 0 && avgRating && (
          <div className="flex items-center gap-2 mt-8 text-white/90 text-sm">
            <Star size={16} className="fill-gold text-gold" />
            <span>
              {avgRating} · {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}