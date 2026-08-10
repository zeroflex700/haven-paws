"use client";

import { useEffect, useState } from "react";
import PageContainer from "../../components/PageContainer";
import PedigreeCard from "../../components/PedigreeCard";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { supabase } from "@/lib/supabase/client";
import type { PuppyRecord } from "@/lib/queries/puppies";

export default function FavoritesClient() {
  const { favoriteIds } = useFavorites();
  const [puppies, setPuppies] = useState<PuppyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setPuppies([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("puppies")
      .select(
        `id, name, sex, price, birth_date, ready_date, status,
         breeds ( name ),
         puppy_media ( url, is_cover, media_type )`
      )
      .in("id", favoriteIds)
      .then(({ data }) => {
        const mapped = (data ?? []).map((p) => {
          const media = (p.puppy_media ?? []) as { url: string; is_cover: boolean; media_type: string }[];
          const cover = media.find((m) => m.is_cover)?.url ?? media[0]?.url ?? null;
          return {
            id: p.id,
            name: p.name,
            breed: (p.breeds as unknown as { name: string })?.name ?? "Unknown",
            sex: p.sex,
            ageWeeks: p.birth_date
              ? Math.max(0, Math.floor((Date.now() - new Date(p.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 7)))
              : null,
            readyLabel: p.ready_date ? "Ready to go home" : "Coming soon",
            status: p.status,
            price: Number(p.price),
            coverImage: cover,
            hasVideo: media.some((m) => m.media_type === "video"),
          } as PuppyRecord;
        });
        setPuppies(mapped);
        setLoading(false);
      });
  }, [favoriteIds]);

  return (
    <PageContainer className="py-10">
      <p className="eyebrow mb-2">Your Account</p>
      <h1 className="h1 mb-8">Favorites</h1>

      {loading ? (
        <p className="small-text">Loading...</p>
      ) : puppies.length === 0 ? (
        <p className="small-text">
          You haven&apos;t favorited any puppies yet. Tap the heart icon on any puppy to save it here.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-7">
          {puppies.map((p) => (
            <PedigreeCard key={p.id} {...p} image={p.coverImage} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}