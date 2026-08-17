"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PageContainer from "../../components/PageContainer";
import PedigreeCard from "../../components/PedigreeCard";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { supabase } from "@/lib/supabase/client";
import type { PuppyRecord } from "@/lib/queries/puppies";

type PuppyMedia = {
  url: string;
  is_cover: boolean;
  media_type: string;
};

type BreedRelation =
  | {
      name: string;
    }
  | {
      name: string;
    }[]
  | null;

type PuppyRow = {
  id: string;
  name: string;
  sex: string | null;
  price: number | string | null;
  birth_date: string | null;
  ready_date: string | null;
  status: string | null;
  breeds: BreedRelation;
  puppy_media: PuppyMedia[] | null;
};

export default function FavoritesClient() {
  const {
    favoriteIds,
    loading: favoritesLoading,
  } = useFavorites();

  const [puppies, setPuppies] =
    useState<PuppyRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * Convert the IDs into a stable string.
   *
   * This prevents the Supabase request from being
   * restarted just because useFavorites returned
   * a new array reference.
   */
  const favoriteIdsKey = useMemo(
    () =>
      favoriteIds
        .filter(Boolean)
        .join(","),
    [favoriteIds]
  );

  useEffect(() => {
    let cancelled = false;

    /*
     * Wait for useFavorites to finish determining
     * the user's favorites.
     */
    if (favoritesLoading) {
      setLoading(true);
      return () => {
        cancelled = true;
      };
    }

    const ids = favoriteIdsKey
      ? favoriteIdsKey
          .split(",")
          .filter(Boolean)
      : [];

    /*
     * No favorite puppies.
     */
    if (ids.length === 0) {
      setPuppies([]);
      setError("");
      setLoading(false);

      return () => {
        cancelled = true;
      };
    }

    async function loadPuppies() {
      setLoading(true);
      setError("");

      try {
        const {
          data,
          error: queryError,
        } = await supabase
          .from("puppies")
          .select(
            `
              id,
              name,
              sex,
              price,
              birth_date,
              ready_date,
              status,
              breeds (
                name
              ),
              puppy_media (
                url,
                is_cover,
                media_type
              )
            `
          )
          .in("id", ids);

        if (cancelled) return;

        if (queryError) {
          console.error(
            "Failed to load favorite puppies:",
            queryError
          );

          setPuppies([]);
          setError(
            "We couldn't load your favorite puppies. Please try again."
          );
          setLoading(false);

          return;
        }

        const rows =
          (data ?? []) as unknown as PuppyRow[];

        const mapped: PuppyRecord[] =
          rows.map((puppy) => {
            const media =
              Array.isArray(
                puppy.puppy_media
              )
                ? puppy.puppy_media
                : [];

            const coverImage =
              media.find(
                (item) =>
                  item.is_cover
              )?.url ??
              media[0]?.url ??
              null;

            let breedName = "Unknown";

            if (
              Array.isArray(
                puppy.breeds
              )
            ) {
              breedName =
                puppy.breeds[0]
                  ?.name ??
                "Unknown";
            } else if (
              puppy.breeds
            ) {
              breedName =
                puppy.breeds.name ??
                "Unknown";
            }

            const ageWeeks =
              puppy.birth_date
                ? Math.max(
                    0,
                    Math.floor(
                      (Date.now() -
                        new Date(
                          puppy.birth_date
                        ).getTime()) /
                        (1000 *
                          60 *
                          60 *
                          24 *
                          7)
                    )
                  )
                : null;

            return {
              id: puppy.id,
              name: puppy.name,
              breed: breedName,
              sex: puppy.sex,
              ageWeeks,
              readyLabel:
                puppy.ready_date
                  ? "Ready to go home"
                  : "Coming soon",
              status: puppy.status,
              price: Number(
                puppy.price ?? 0
              ),
              coverImage,
              hasVideo:
                media.some(
                  (item) =>
                    item.media_type ===
                    "video"
                ),
            } as PuppyRecord;
          });

        /*
         * Preserve the user's favorite order.
         */
        const order = new Map(
          ids.map(
            (id, index) => [
              id,
              index,
            ]
          )
        );

        mapped.sort(
          (a, b) =>
            (order.get(a.id) ??
              0) -
            (order.get(b.id) ??
              0)
        );

        if (cancelled) return;

        setPuppies(mapped);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Unexpected error loading favorites:",
          err
        );

        setPuppies([]);
        setError(
          "We couldn't load your favorite puppies. Please try again."
        );
        setLoading(false);
      }
    }

    loadPuppies();

    return () => {
      cancelled = true;
    };
  }, [
    favoriteIdsKey,
    favoritesLoading,
  ]);

  return (
    <PageContainer className="py-10">
      <p className="eyebrow mb-2">
        Your Account
      </p>

      <h1 className="h1 mb-8">
        Favorites
      </h1>

      {loading ? (
        <div
          className="min-h-[240px] flex items-center justify-center"
          aria-live="polite"
        >
          <p className="small-text">
            Loading your favorites...
          </p>
        </div>
      ) : error ? (
        <div className="py-6">
          <p
            className="small-text text-red-600"
            role="alert"
          >
            {error}
          </p>
        </div>
      ) : puppies.length === 0 ? (
        <p className="small-text">
          You haven&apos;t favorited any
          puppies yet. Tap the heart icon on
          any puppy to save it here.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-7">
          {puppies.map((puppy) => (
            <PedigreeCard
              key={puppy.id}
              {...puppy}
              image={puppy.coverImage}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}