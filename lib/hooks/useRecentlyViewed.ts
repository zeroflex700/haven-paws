"use client";

import { useCallback, useEffect, useState } from "react";

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

function read(): RecentItem[] {
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

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    setItems(read());
  }, []);

  const addItem = useCallback((item: Omit<RecentItem, "viewedAt">) => {
    const current = read().filter((i) => i.id !== item.id);
    const updated = [{ ...item, viewedAt: Date.now() }, ...current].slice(0, MAX_ITEMS);
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable (private browsing) — silently no-op
    }
    setItems(updated);
  }, []);

  return { items, addItem };
}