"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

/*
 * Keeps the admin inbox list (app/admin/messages/page.tsx) live.
 *
 * That page is a Server Component — it fetches conversations once,
 * on load, and has no way to know about new activity on its own.
 *
 * This component renders nothing. It just listens for any change
 * to the conversations table (a new message updates last_message_at /
 * last_message_preview on the relevant row) and asks Next.js to
 * silently re-run the server fetch and patch the DOM, without a
 * full page reload or losing scroll position.
 *
 * Debounced so a burst of messages doesn't trigger a refresh storm.
 */
export default function AdminInboxRealtime() {
  const router = useRouter();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
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
        .channel("admin-inbox-conversations")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversations",
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
              "Admin inbox realtime channel disrupted, retrying:",
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
  }, [router]);

  return null;
}
