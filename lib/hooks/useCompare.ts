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

  // Returns "added" | "removed" | "limit-reached" so callers can show
  // appropriate feedback without duplicating limit logic.
  const toggle = useCallback((id: string): "added" | "removed" | "limit-reached" => {
    let result: "added" | "removed" | "limit-reached" = "added";
    setIds((current) => {
      if (current.includes(id)) {
        result = "removed";
        const updated = current.filter((x) => x !== id);
        writeLocal(updated);
        return updated;
      }
      if (current.length >= MAX_COMPARE) {
        result = "limit-reached";
        return current;
      }
      const updated = [...current, id];
      writeLocal(updated);
      return updated;
    });
    return result;
  }, []);

  const clear = useCallback(() => {
    writeLocal([]);
    setIds([]);
  }, []);

  const isComparing = useCallback((id: string) => ids.includes(id), [ids]);

  return {
    compareIds: ids,
    isComparing,
    toggle,
    clear,
    maxReached: ids.length >= MAX_COMPARE,
    maxCompare: MAX_COMPARE,
  };
}