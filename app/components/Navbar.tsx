"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PawPrint, Menu, User } from "lucide-react";
import MobileMenu from "./MobileMenu";
import AccountPanel from "./AccountPanel";
import { supabase } from "@/lib/supabase/client";

type Thumbnails = { how_it_works: string | null; learning_center: string | null; our_standards: string | null };

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [thumbnails, setThumbnails] = useState<Thumbnails>({
    how_it_works: null,
    learning_center: null,
    our_standards: null,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase
      .from("page_content")
      .select("extra_images")
      .eq("slug", "account-menu")
      .single()
      .then(({ data }) => {
        const images = (data?.extra_images as Record<string, string>) ?? {};
        setThumbnails({
          how_it_works: images.how_it_works ?? null,
          learning_center: images.learning_center ?? null,
          our_standards: images.our_standards ?? null,
        });
      });
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-sage/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="md:hidden" aria-label="Open menu">
              <Menu size={20} className="text-forest" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <PawPrint size={19} className="text-gold" strokeWidth={1.5} />
              <span className="font-display text-lg text-forest tracking-tight">
                Haven Paws
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-ink">
            <Link href="/puppies" className="hover:text-forest">Available Puppies</Link>
            <Link href="/how-it-works" className="hover:text-forest">How It Works</Link>
            <Link href="/about" className="hover:text-forest">About</Link>
          </nav>

          {loggedIn ? (
            <button
              onClick={() => setAccountOpen(true)}
              aria-label="Account"
              className="w-9 h-9 rounded-full bg-cream-alt border border-sage/30 flex items-center justify-center hover:border-gold transition-colors"
            >
              <User size={16} className="text-forest" strokeWidth={1.5} />
            </button>
          ) : (
            <Link
              href="/account/login"
              aria-label="Account"
              className="w-9 h-9 rounded-full bg-cream-alt border border-sage/30 flex items-center justify-center hover:border-gold transition-colors"
            >
              <User size={16} className="text-forest" strokeWidth={1.5} />
            </Link>
          )}
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <AccountPanel open={accountOpen} onClose={() => setAccountOpen(false)} thumbnails={thumbnails} />
    </>
  );
}