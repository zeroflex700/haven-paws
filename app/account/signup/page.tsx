"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getSafeRedirect } from "@/lib/auth/safe-redirect";
import GoogleAuthButton from "@/app/components/auth/GoogleAuthButton";

const RETURN_URL_KEY = "haven_paws_login_return_url";

export default function CustomerSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState("/account");

  // Same "next" resolution as the login page, so switching between
  // sign-in and sign-up never loses the original destination.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryNext = params.get("next");

    if (queryNext) {
      const safe = getSafeRedirect(queryNext);
      setNext(safe);
      sessionStorage.setItem(RETURN_URL_KEY, safe);
      return;
    }

    const saved = sessionStorage.getItem(RETURN_URL_KEY);
    if (saved) {
      setNext(getSafeRedirect(saved));
    }
  }, []);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    const destination = getSafeRedirect(next);
    sessionStorage.removeItem(RETURN_URL_KEY);

    router.push(destination);
    router.refresh();
  }

  const loginHref = `/account/login?next=${encodeURIComponent(next)}`;

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <PawPrint size={22} className="text-gold" strokeWidth={1.5} />
          <span className="font-display text-xl text-forest">Create your account</span>
        </div>

        <GoogleAuthButton label="Sign up with Google" nextPath={next} />

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-sage/20" />
          <span className="text-xs text-ink/50 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-sage/20" />
        </div>

        <form onSubmit={handleSignup}>
          <input
            required
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-sage/30 rounded-md px-4 py-3 mb-3 focus:outline-none focus:border-gold"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-sage/30 rounded-md px-4 py-3 mb-3 focus:outline-none focus:border-gold"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-sage/30 rounded-md px-4 py-3 mb-6 focus:outline-none focus:border-gold"
          />

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest text-cream py-3 rounded-full hover:bg-forest-light transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/70 mt-6">
          Already have an account?{" "}
          <Link href={loginHref} className="text-forest underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}