"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      /*
       * Supabase restores the OAuth session automatically in the browser.
       * Wait briefly for the auth state to become available.
       */
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      /*
       * Read the "next" destination directly from the browser URL.
       *
       * We deliberately don't use useSearchParams() here because
       * Next.js requires additional Suspense handling for it during
       * production prerendering.
       */
      const params = new URLSearchParams(window.location.search);
      const requestedNext = params.get("next");

      const destination = getSafeRedirect(requestedNext);

      if (session) {
        router.replace(destination);
        router.refresh();
        return;
      }

      /*
       * If Supabase hasn't restored the session yet, wait for the
       * auth event before redirecting.
       */
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, currentSession) => {
        if (cancelled) return;

        if (
          currentSession &&
          (event === "SIGNED_IN" || event === "INITIAL_SESSION")
        ) {
          subscription.unsubscribe();
          router.replace(destination);
          router.refresh();
        }
      });

      /*
       * Safety fallback.
       */
      const timeout = window.setTimeout(() => {
        subscription.unsubscribe();

        if (!cancelled) {
          router.replace("/account/login");
        }
      }, 10000);

      return () => {
        window.clearTimeout(timeout);
        subscription.unsubscribe();
      };
    }

    handleCallback();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="flex items-center gap-2 text-forest">
        <PawPrint
          size={22}
          className="text-gold"
          strokeWidth={1.5}
        />

        <span className="font-display text-lg">
          Haven Paws
        </span>
      </div>
    </main>
  );
}

function getSafeRedirect(path: string | null) {
  /*
   * No destination supplied.
   */
  if (!path) {
    return "/account";
  }

  /*
   * Only permit internal paths.
   *
   * This prevents someone from manipulating:
   *
   * /auth/callback?next=https://malicious-site.com
   *
   * into an external redirect.
   */
  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/account";
  }

  return path;
}