"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCloudSync } from "./useCloudSync";

type FavoriteEntry = {
  id: string;
  addedAt: number;
};

const KEY = "havenpaws_favorites";

function readLocal(): FavoriteEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is FavoriteEntry =>
        typeof item?.id === "string" &&
        typeof item?.addedAt === "number"
    );
  } catch {
    return [];
  }
}

function writeLocal(items: FavoriteEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      KEY,
      JSON.stringify(items)
    );
  } catch {
    // Ignore localStorage errors.
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<Set<string>>(
    new Set()
  );

  const cloud = useCloudSync<FavoriteEntry[]>(
    "favorites",
    {
      read: readLocal,
      write: writeLocal,
    }
  );

  const {
    load,
    save,
    isLoggedIn,
    authReady,
  } = cloud;

  /*
   * Load favorites exactly when the authentication state
   * becomes known.
   *
   * We deliberately don't load anything before authReady.
   * This prevents:
   *
   * local favorites
   *       ↓
   * cloud favorites
   *
   * from causing the Favorites page to visibly jump.
   */
  useEffect(() => {
    let cancelled = false;

    if (!authReady) {
      return () => {
        cancelled = true;
      };
    }

    async function loadFavorites() {
      const data = await load();

      if (cancelled) return;

      if (Array.isArray(data)) {
        setIds(
          new Set(
            data
              .filter(
                (favorite) =>
                  favorite &&
                  typeof favorite.id === "string"
              )
              .map(
                (favorite) => favorite.id
              )
          )
        );
      } else {
        setIds(new Set());
      }
    }

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [authReady, isLoggedIn, load]);

  /*
   * Toggle a favorite.
   */
  const toggle = useCallback(
    (puppyId: string) => {
      const current = readLocal();

      const exists = current.some(
        (favorite) =>
          favorite.id === puppyId
      );

      const updated = exists
        ? current.filter(
            (favorite) =>
              favorite.id !== puppyId
          )
        : [
            ...current,
            {
              id: puppyId,
              addedAt: Date.now(),
            },
          ];

      /*
       * Update the UI immediately.
       */
      setIds(
        new Set(
          updated.map(
            (favorite) => favorite.id
          )
        )
      );

      /*
       * Save locally and to cloud.
       */
      save(updated);
    },
    [save]
  );

  const isFavorite = useCallback(
    (puppyId: string) =>
      ids.has(puppyId),
    [ids]
  );

  /*
   * Keep the returned array stable when the actual
   * favorite IDs haven't changed.
   */
  const favoriteIds = useMemo(
    () => Array.from(ids),
    [ids]
  );

  return {
    favoriteIds,
    isFavorite,
    toggle,
    loading: !authReady,
    isLoggedIn,
  };
}