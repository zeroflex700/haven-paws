"use client";

import { useCallback, useEffect, useState } from "react";
import { useCloudSync } from "./useCloudSync";

const KEY = "havenpaws_search_history";
const MAX_ITEMS = 8;

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

export function useSearchHistory() {
  const [terms, setTerms] = useState<string[]>([]);
  const cloud = useCloudSync<string[]>("search_history", { read: readLocal, write: writeLocal });

  useEffect(() => {
    cloud.load().then((data) => {
      if (data) setTerms(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloud.isLoggedIn]);

  const addTerm = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      const current = readLocal().filter((t) => t.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...current].slice(0, MAX_ITEMS);
      cloud.save(updated);
      setTerms(updated);
    },
    [cloud]
  );

  const clearHistory = useCallback(() => {
    cloud.save([]);
    setTerms([]);
  }, [cloud]);

  return { terms, addTerm, clearHistory };
}