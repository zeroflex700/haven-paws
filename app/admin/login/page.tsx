"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
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

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white rounded-lg border border-sage/20 p-8">
        <h1 className="font-display text-2xl text-forest mb-1">Haven Paws</h1>
        <p className="eyebrow mb-6">Admin Sign In</p>

        <label className="block text-sm text-ink/80 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-sage/30 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-gold"
        />

        <label className="block text-sm text-ink/80 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-sage/30 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-gold"
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}