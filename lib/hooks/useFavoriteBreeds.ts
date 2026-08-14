"use client";

import { useCallback, useEffect, useState } from "react";
import { useCloudSync } from "./useCloudSync";

const KEY = "havenpaws_favorite_breeds";

function readLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeLocal(items: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function useFavoriteBreeds() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const cloud = useCloudSync<string[]>("favorite_breeds", { read: readLocal, write: writeLocal });

  useEffect(() => {
    cloud.load().then((data) => {
      if (data) setBreeds(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloud.isLoggedIn]);

  const toggle = useCallback(
    (breed: string) => {
      const current = readLocal();
      const updated = current.includes(breed) ? current.filter((b) => b !== breed) : [...current, breed];
      cloud.save(updated);
      setBreeds(updated);
    },
    [cloud]
  );

  const isFavorite = useCallback((breed: string) => breeds.includes(breed), [breeds]);

  return { favoriteBreeds: breeds, isFavorite, toggle };
}