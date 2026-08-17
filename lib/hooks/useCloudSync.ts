"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabase/client";

export function useCloudSync<T>(
  key: string,
  localFallback: {
    read: () => T | null;
    write: (value: T) => void;
  }
) {
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const debounceRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * Determine the current authentication state once,
   * then keep it synchronized with Supabase auth events.
   */
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setUserId(session?.user?.id ?? null);
      setAuthReady(true);
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        setUserId(session?.user?.id ?? null);
        setAuthReady(true);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  /*
   * Load cloud data when logged in.
   *
   * If there is no cloud record, fall back to localStorage.
   */
  const load = useCallback(async (): Promise<T | null> => {
    /*
     * Authentication hasn't finished initializing yet.
     */
    if (!authReady) {
      return null;
    }

    if (userId) {
      const { data, error } = await supabase
        .from("session_recovery")
        .select("value")
        .eq("user_id", userId)
        .eq("key", key)
        .maybeSingle();

      if (!error && data?.value != null) {
        return data.value as T;
      }
    }

    return localFallback.read();
  }, [authReady, userId, key, localFallback]);

  /*
   * Save locally immediately.
   *
   * If the user is logged in, synchronize to Supabase
   * after a short debounce.
   */
  const save = useCallback(
    (value: T) => {
      localFallback.write(value);

      if (!userId) {
        return;
      }

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        await supabase
          .from("session_recovery")
          .upsert(
            {
              user_id: userId,
              key,
              value: value as unknown as object,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id,key",
            }
          );

        debounceRef.current = null;
      }, 500);
    },
    [userId, key, localFallback]
  );

  return {
    load,
    save,
    userId,
    isLoggedIn: !!userId,
    authReady,
  };
}