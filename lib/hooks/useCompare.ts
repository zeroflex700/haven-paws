"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "havenpaws_compare";
const MAX_COMPARE = 3;

function readLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeLocal(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readLocal());
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((current) => {
      let updated: string[];
      if (current.includes(id)) {
        updated = current.filter((x) => x !== id);
      } else {
        if (current.length >= MAX_COMPARE) return current;
        updated = [...current, id];
      }
      writeLocal(updated);
      return updated;
    });
  }, []);

  const clear = useCallback(() => {
    writeLocal([]);
    setIds([]);
  }, []);

  const isComparing = useCallback((id: string) => ids.includes(id), [ids]);

  return { compareIds: ids, isComparing, toggle, clear, maxReached: ids.length >= MAX_COMPARE };
}