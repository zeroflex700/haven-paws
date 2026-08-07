"use client";

import { useCallback, useEffect, useState } from "react";
import { useCloudSync } from "./useCloudSync";

type RecentItem = {
  id: string;
  type: "puppy" | "breed";
  name: string;
  image: string | null;
  href: string;
  viewedAt: number;
};

const KEY = "havenpaws_recently_viewed";
const MAX_ITEMS = 8;
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

function readLocal(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const items: RecentItem[] = JSON.parse(raw);
    const now = Date.now();
    return items.filter((i) => now - i.viewedAt < TTL_MS);
  } catch {
    return [];
  }
}

function writeLocal(items: RecentItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // storage unavailable (private browsing) — silently no-op
  }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);
  const cloud = useCloudSync<RecentItem[]>("recently_viewed", { read: readLocal, write: writeLocal });

  useEffect(() => {
    cloud.load().then((data) => {
      if (data) setItems(data.filter((i) => Date.now() - i.viewedAt < TTL_MS));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloud.isLoggedIn]);

  const addItem = useCallback(
    (item: Omit<RecentItem, "viewedAt">) => {
      const current = readLocal().filter((i) => i.id !== item.id);
      const updated = [{ ...item, viewedAt: Date.now() }, ...current].slice(0, MAX_ITEMS);
      cloud.save(updated);
      setItems(updated);
    },
    [cloud]
  );

  return { items, addItem };
}