"use client";

import { useEffect, useState, useCallback } from "react";

export type CheckoutDraft = {
  step: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  deliveryMethod: "pickup" | "delivery";
  starterKit: boolean;
  healthGuarantee: boolean;
  savedAt: number;
};

const TTL_MS = 24 * 60 * 60 * 1000;

function keyFor(puppyId: string) {
  return `havenpaws_checkout_${puppyId}`;
}

// IMPORTANT: never pass payment/card fields into `save()` — this storage
// is plain localStorage and is only appropriate for non-sensitive draft data.
export function useCheckoutRecovery(puppyId: string) {
  const [draft, setDraft] = useState<Partial<CheckoutDraft> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(puppyId));
      if (!raw) return;
      const parsed: Partial<CheckoutDraft> = JSON.parse(raw);
      if (parsed.savedAt && Date.now() - parsed.savedAt < TTL_MS) {
        setDraft(parsed);
      } else {
        localStorage.removeItem(keyFor(puppyId));
      }
    } catch {
      // ignore
    }
  }, [puppyId]);

  const save = useCallback(
    (data: Partial<CheckoutDraft>) => {
      try {
        localStorage.setItem(keyFor(puppyId), JSON.stringify({ ...data, savedAt: Date.now() }));
      } catch {
        // ignore
      }
    },
    [puppyId]
  );

  const clear = useCallback(() => {
    localStorage.removeItem(keyFor(puppyId));
  }, [puppyId]);

  return { draft, save, clear };
}