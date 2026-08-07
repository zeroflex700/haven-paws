"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function useCloudSync<T>(
  key: string,
  localFallback: { read: () => T | null; write: (v: T) => void }
) {
  const [userId, setUserId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const load = useCallback(async (): Promise<T | null> => {
    if (userId) {
      const { data } = await supabase
        .from("session_recovery")
        .select("value")
        .eq("user_id", userId)
        .eq("key", key)
        .single();
      if (data?.value) return data.value as T;
    }
    return localFallback.read();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, key]);

  const save = useCallback(
    (value: T) => {
      localFallback.write(value);
      if (!userId) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        supabase
          .from("session_recovery")
          .upsert({
            user_id: userId,
            key,
            value: value as unknown as object,
            updated_at: new Date().toISOString(),
          })
          .then(() => {});
      }, 800);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, key]
  );

  return { load, save, isLoggedIn: !!userId };
}