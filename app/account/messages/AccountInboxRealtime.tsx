"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

/*
 * Keeps the customer messages inbox (app/account/messages/page.tsx) live.
 *
 * That page is a Server Component — it fetches conversations once,
 * on load, and has no way to know about new activity on its own.
 *
 * This component renders nothing. It listens for any change to the
 * current customer's own conversation rows (a new message updates
 * last_message_at / last_message_preview) and asks Next.js to
 * silently re-run the server fetch and patch the DOM, without a
 * full page reload or losing scroll position.
 *
 * Debounced so a burst of messages doesn't trigger a refresh storm.
 */
export default function AccountInboxRealtime() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) {
        setUserId(data.user?.id ?? null);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id ?? null);
      }
    );

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    function scheduleRefresh() {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        router.refresh();
      }, 400);
    }

    let isMounted = true;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    function setupChannel() {
      channel = supabase
        .channel(`account-inbox-conversations:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversations",
            filter: `customer_id=eq.${userId}`,
          },
          () => {
            scheduleRefresh();
          }
        )
        .subscribe((status, err) => {
          if (!isMounted) return;

          if (
            status === "CHANNEL_ERROR" ||
            status === "TIMED_OUT" ||
            status === "CLOSED"
          ) {
            console.error(
              "Account inbox realtime channel disrupted, retrying:",
              status,
              err
            );

            if (retryTimeout) clearTimeout(retryTimeout);

            retryTimeout = setTimeout(() => {
              if (!isMounted) return;

              if (channel) {
                void supabase.removeChannel(channel);
              }

              setupChannel();
            }, 2000);
          }
        });
    }

    setupChannel();

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        scheduleRefresh();
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      isMounted = false;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (retryTimeout) clearTimeout(retryTimeout);

      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [userId, router]);

  return null;
}
