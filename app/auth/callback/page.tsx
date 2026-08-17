"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const DEFAULT_REDIRECT = "/";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    async function handleCallback() {
      /*
       * Read the destination directly from the browser URL.
       *
       * Example:
       * /auth/callback?code=xxxxx&next=%2Fpuppies
       *
       * We don't use useSearchParams() here because this page
       * is intentionally kept browser-only.
       */
      const params = new URLSearchParams(
        window.location.search
      );

      const requestedNext = params.get("next");

      /*
       * Also check sessionStorage.
       *
       * This protects the destination in cases where the OAuth
       * provider doesn't preserve the "next" query parameter.
       */
      const storedNext =
        sessionStorage.getItem("haven_paws_login_redirect");

      const destination = getSafeRedirect(
        requestedNext || storedNext
      );

      /*
       * Clean up the stored redirect now that we've captured it.
       */
      sessionStorage.removeItem(
        "haven_paws_login_redirect"
      );

      /*
       * Supabase OAuth normally returns with a "code".
       *
       * Exchange that code for the user's session.
       */
      const code = params.get("code");

      if (code) {
        const { error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (cancelled) return;

        if (error) {
          console.error(
            "OAuth callback error:",
            error
          );

          router.replace(
            `/account/login?error=oauth`
          );

          return;
        }

        router.replace(destination);
        router.refresh();

        return;
      }

      /*
       * If there is no code, check whether Supabase has
       * already restored the session in the browser.
       */
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      if (session) {
        router.replace(destination);
        router.refresh();

        return;
      }

      /*
       * Wait for Supabase's auth state event.
       *
       * This handles cases where the browser client restores
       * the OAuth session slightly after the callback page loads.
       */
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          if (cancelled) return;

          if (
            currentSession &&
            (
              event === "SIGNED_IN" ||
              event === "INITIAL_SESSION"
            )
          ) {
            subscription.unsubscribe();

            if (timeoutId) {
              window.clearTimeout(timeoutId);
            }

            router.replace(destination);
            router.refresh();
          }
        }
      );

      /*
       * Safety timeout.
       *
       * Don't send the user to /account here.
       * Send them back to login because authentication
       * was not successfully completed.
       */
      timeoutId = window.setTimeout(() => {
        subscription.unsubscribe();

        if (!cancelled) {
          router.replace("/account/login");
        }
      }, 10000);
    }

    handleCallback();

    return () => {
      cancelled = true;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
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

/**
 * Only allow internal redirects.
 *
 * Valid:
 * /puppies
 * /puppies?breed=Golden%20Retriever
 * /breed-guides/golden-retriever
 * /reviews
 *
 * Invalid:
 * https://example.com
 * //example.com
 */
function getSafeRedirect(path: string | null) {
  if (!path) {
    return DEFAULT_REDIRECT;
  }

  if (
    !path.startsWith("/") ||
    path.startsWith("//")
  ) {
    return DEFAULT_REDIRECT;
  }

  return path;
}