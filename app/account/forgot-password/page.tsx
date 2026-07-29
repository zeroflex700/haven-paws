"use client";

import { useState } from "react";
import { PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/login`,
    });
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <PawPrint size={22} className="text-gold" strokeWidth={1.5} />
          <span className="font-display text-xl text-forest">Reset your password</span>
        </div>

        {sent ? (
          <p className="text-center text-ink/80">
            If an account exists for that email, a reset link has been sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-sage/30 rounded-md px-4 py-3 mb-6 focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="w-full bg-forest text-cream py-3 rounded-full hover:bg-forest-light transition-colors"
            >
              Send reset link
            </button>
          </form>
        )}
      </div>
    </main>
  );
}