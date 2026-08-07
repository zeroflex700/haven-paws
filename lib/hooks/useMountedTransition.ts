"use client";

import { useEffect, useState } from "react";

export function useMountedTransition(open: boolean, exitDurationMs = 250) {
  const [mounted, setMounted] = useState(open);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(id);
    }
    setEntered(false);
    const timeout = setTimeout(() => setMounted(false), exitDurationMs);
    return () => clearTimeout(timeout);
  }, [open, exitDurationMs]);

  return { mounted, entered };
}