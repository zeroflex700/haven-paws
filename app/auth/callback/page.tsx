"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState("");

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/account";

      // Only allow internal redirects.
      const safeNext =
        next.startsWith("/") && !next.startsWith("//")
          ? next
          : "/account";

      if (!code) {
        setError("Unable to complete sign in.");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("OAuth callback error:", error);
        setError("Unable to complete sign in. Please try again.");
        return;
      }

      router.replace(safeNext);
      router.refresh();
    }

    handleCallback();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <PawPrint
            size={22}
            className="text-gold"
            strokeWidth={1.5}
          />

          <span className="font-display text-xl text-forest">
            Haven Paws
          </span>
        </div>

        {error ? (
          <>
            <p className="text-sm text-red-600 mb-5">
              {error}
            </p>

            <button
              type="button"
              onClick={() => router.replace("/account/login")}
              className="rounded-full bg-forest text-cream px-6 py-3 text-sm font-medium hover:bg-forest-light transition-colors"
            >
              Return to login
            </button>
          </>
        ) : (
          <p className="text-sm text-ink/60">
            Signing you in...
          </p>
        )}
      </div>
    </main>
  );
}