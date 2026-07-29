"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/account");
    router.refresh();
  }

  async function handleOAuth(provider: "google" | "facebook") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/account` },
    });
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <PawPrint size={22} className="text-gold" strokeWidth={1.5} />
          <span className="font-display text-xl text-forest">Log in to Haven Paws</span>
        </div>

        <button
          onClick={() => handleOAuth("google")}
          className="w-full border border-sage/30 rounded-full py-3 mb-3 text-sm font-medium hover:border-gold transition-colors"
        >
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth("facebook")}
          className="w-full border border-sage/30 rounded-full py-3 mb-6 text-sm font-medium hover:border-gold transition-colors"
        >
          Continue with Facebook
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-sage/30" />
          <span className="text-xs text-sage">Or continue with email</span>
          <div className="flex-1 h-px bg-sage/30" />
        </div>

        <form onSubmit={handleLogin}>
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
            className="w-full border border-sage/30 rounded-md px-4 py-3 mb-3 focus:outline-none focus:border-gold"
          />

          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center gap-2 text-ink/70">
              <input type="checkbox" className="w-4 h-4" />
              Remember me
            </label>
            <Link href="/account/forgot-password" className="text-forest underline">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest text-cream py-3 rounded-full hover:bg-forest-light transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/70 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/account/signup" className="text-forest underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}