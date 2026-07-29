"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/account/login");
      } else {
        setEmail(data.user.email ?? null);
      }
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <main>
      <Navbar />
      <section className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="eyebrow mb-3">Your Account</p>
        <h1 className="font-display text-2xl text-forest mb-2">Welcome</h1>
        {email && <p className="text-ink/70 mb-8">{email}</p>}
        <button
          onClick={handleSignOut}
          className="border border-sage/30 text-forest px-6 py-2.5 rounded-full hover:border-gold"
        >
          Sign Out
        </button>
      </section>
      <Footer />
    </main>
  );
}