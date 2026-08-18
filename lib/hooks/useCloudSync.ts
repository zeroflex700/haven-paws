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
   * Keep the local fallback functions as the actual
   * dependencies rather than depending on the wrapper
   * object itself.
   *
   * Consumers may create the { read, write } object
   * inline. The functions themselves are module-level
   * stable references.
   */
  const readLocal = localFallback.read;
  const writeLocal = localFallback.write;

  /*
   * Determine authentication state once and keep it
   * synchronized with Supabase auth events.
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
        debounceRef.current = null;
      }
    };
  }, []);

  /*
   * Load cloud data when authentication is ready.
   *
   * If there is no cloud record, fall back to localStorage.
   */
  const load = useCallback(async (): Promise<T | null> => {
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

    return readLocal();
  }, [authReady, userId, key, readLocal]);

  /*
   * Save locally immediately.
   *
   * Cloud synchronization is debounced so rapid changes
   * do not create repeated Supabase writes.
   */
  const save = useCallback(
    (value: T) => {
      writeLocal(value);

      if (!authReady || !userId) {
        return;
      }

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        try {
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
        } finally {
          debounceRef.current = null;
        }
      }, 500);
    },
    [authReady, userId, key, writeLocal]
  );

  return {
    load,
    save,
    userId,
    isLoggedIn: !!userId,
    authReady,
  };
}

The key change is that "useCloudSync()" now depends on:

localFallback.read
localFallback.write

rather than the freshly-created "localFallback" object.

I also added "authReady" to "save()", so a save cannot try to synchronize to Supabase while authentication is still being established.