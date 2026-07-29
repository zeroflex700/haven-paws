"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function CustomerSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    router.push("/account");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <PawPrint size={22} className="text-gold" strokeWidth={1.5} />
          <span className="font-display text-xl text-forest">Create your account</span>
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
          <Link href="/account/login" className="text-forest underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}