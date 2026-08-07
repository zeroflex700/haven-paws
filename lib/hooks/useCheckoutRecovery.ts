"use client";

import { useEffect, useState, useCallback } from "react";
import { useCloudSync } from "./useCloudSync";

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

function readLocal(puppyId: string): Partial<CheckoutDraft> | null {
  try {
    const raw = localStorage.getItem(keyFor(puppyId));
    if (!raw) return null;
    const parsed: Partial<CheckoutDraft> = JSON.parse(raw);
    if (parsed.savedAt && Date.now() - parsed.savedAt < TTL_MS) return parsed;
    localStorage.removeItem(keyFor(puppyId));
    return null;
  } catch {
    return null;
  }
}

function writeLocal(puppyId: string, data: Partial<CheckoutDraft>) {
  try {
    localStorage.setItem(keyFor(puppyId), JSON.stringify(data));
  } catch {
    // ignore
  }
}

// IMPORTANT: never pass payment/card fields into `save()` — this syncs to
// plain localStorage (anonymous) or Supabase (logged-in), neither of which
// is appropriate for sensitive payment data.
export function useCheckoutRecovery(puppyId: string) {
  const [draft, setDraft] = useState<Partial<CheckoutDraft> | null>(null);
  const cloud = useCloudSync<Partial<CheckoutDraft>>(`checkout_${puppyId}`, {
    read: () => readLocal(puppyId),
    write: (v) => writeLocal(puppyId, v),
  });

  useEffect(() => {
    cloud.load().then((data) => {
      if (data?.savedAt && Date.now() - data.savedAt < TTL_MS) setDraft(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloud.isLoggedIn, puppyId]);

  const save = useCallback(
    (data: Partial<CheckoutDraft>) => {
      const withTimestamp = { ...data, savedAt: Date.now() };
      cloud.save(withTimestamp);
      setDraft(withTimestamp);
    },
    [cloud]
  );

  const clear = useCallback(() => {
    localStorage.removeItem(keyFor(puppyId));
    setDraft(null);
  }, [puppyId]);

  return { draft, save, clear };
}