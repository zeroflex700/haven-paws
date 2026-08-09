"use client";

import { useCallback, useEffect, useState } from "react";
import { useCloudSync } from "./useCloudSync";

type FavoriteEntry = { id: string; addedAt: number };

const KEY = "havenpaws_favorites";

function readLocal(): FavoriteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(items: FavoriteEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const cloud = useCloudSync<FavoriteEntry[]>("favorites", { read: readLocal, write: writeLocal });

  useEffect(() => {
    cloud.load().then((data) => {
      if (data) setIds(new Set(data.map((f) => f.id)));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloud.isLoggedIn]);

  const toggle = useCallback(
    (puppyId: string) => {
      const current = readLocal();
      const exists = current.some((f) => f.id === puppyId);
      const updated = exists
        ? current.filter((f) => f.id !== puppyId)
        : [...current, { id: puppyId, addedAt: Date.now() }];
      cloud.save(updated);
      setIds(new Set(updated.map((f) => f.id)));
    },
    [cloud]
  );

  const isFavorite = useCallback((puppyId: string) => ids.has(puppyId), [ids]);

  return { favoriteIds: Array.from(ids), isFavorite, toggle };
}