"use client";

import { useEffect, useState } from "react";
import { getSafeRedirect } from "@/lib/auth/safe-redirect";

const NEXT_STORAGE_KEY = "haven_paws_auth_next";

/**
 * Resolves the destination to return to after auth, in this priority:
 * 1. ?next= on the current URL (pathname + search, already encoded)
 * 2. Previously saved value in sessionStorage (survives sign-in <-> sign-up switch)
 * 3. "/" if nothing valid exists
 */
export function useAuthNext(): string {
  const [next, setNext] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryNext = params.get("next");

    if (queryNext) {
      const safe = getSafeRedirect(queryNext, "/");
      setNext(safe);
      sessionStorage.setItem(NEXT_STORAGE_KEY, safe);
      return;
    }

    const saved = sessionStorage.getItem(NEXT_STORAGE_KEY);
    if (saved) {
      setNext(getSafeRedirect(saved, "/"));
    }
  }, []);

  return next;
}

export function buildAuthHref(basePath: string, next: string): string {
  if (!next || next === "/") return basePath;
  return `${basePath}?next=${encodeURIComponent(next)}`;
}