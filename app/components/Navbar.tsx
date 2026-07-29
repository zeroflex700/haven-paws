"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PawPrint, Menu, User } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-sage/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="md:hidden" aria-label="Open menu">
              <Menu size={22} className="text-forest" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <PawPrint size={22} className="text-gold" strokeWidth={1.5} />
              <span className="font-display text-xl text-forest tracking-tight">
                Haven Paws
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-ink">
            <Link href="/puppies" className="hover:text-forest">Available Puppies</Link>
            <Link href="/how-it-works" className="hover:text-forest">How It Works</Link>
            <Link href="/about" className="hover:text-forest">About</Link>
          </nav>
          <Link
            href={loggedIn ? "/account" : "/account/login"}
            aria-label="Account"
            className="w-10 h-10 rounded-full bg-cream-alt border border-sage/30 flex items-center justify-center hover:border-gold transition-colors"
          >
            <User size={18} className="text-forest" strokeWidth={1.5} />
          </Link>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}