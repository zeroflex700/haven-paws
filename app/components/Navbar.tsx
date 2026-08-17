"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PawPrint, Menu, User } from "lucide-react";
import MobileMenu from "./MobileMenu";
import AccountPanel from "./AccountPanel";
import HeaderNavDropdown from "./HeaderNavDropdown";
import { supabase } from "@/lib/supabase/client";
import { useScrollDirection } from "@/lib/hooks/useScrollDirection";
import { useStickyNavigation } from "@/lib/hooks/useStickyNavigation";
import { buildNavSections } from "@/lib/navSections";

type Thumbnails = {
  how_it_works: string | null;
  learning_center: string | null;
  our_standards: string | null;
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [thumbnails, setThumbnails] = useState<Thumbnails>({
    how_it_works: null,
    learning_center: null,
    our_standards: null,
  });

  const scrollDirection = useScrollDirection();
  const scrolled = useStickyNavigation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase
      .from("page_content")
      .select("extra_images")
      .eq("slug", "account-menu")
      .single()
      .then(({ data }) => {
        const images =
          (data?.extra_images as Record<string, string>) ?? {};

        setThumbnails({
          how_it_works: images.how_it_works ?? null,
          learning_center: images.learning_center ?? null,
          our_standards: images.our_standards ?? null,
        });
      });
  }, []);

  const navSections = buildNavSections(loggedIn);

  return (
    <>
      <header
        className={`sticky top-0 z-50 backdrop-blur border-b transition-all duration-300 ${
          scrolled
            ? "bg-cream/95 border-sage/20 shadow-sm"
            : "bg-cream/80 border-transparent"
        } ${
          scrollDirection === "down"
            ? "-translate-y-full"
            : "translate-y-0"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-3">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">

            {/* MOBILE MENU BUTTON
                This is ONLY visible on mobile/tablet. */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden active:scale-90 transition-transform"
              aria-label="Open menu"
              type="button"
            >
              <Menu
                size={20}
                className="text-forest"
              />
            </button>

            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Haven Paws home"
            >
              <PawPrint
                size={19}
                className="text-gold"
                strokeWidth={1.5}
              />

              <span className="font-display text-lg text-forest tracking-tight">
                Haven Paws
              </span>
            </Link>
          </div>

          {/* DESKTOP NAVIGATION ONLY */}
          <nav
            className="hidden md:flex items-center gap-5 lg:gap-6 xl:gap-7"
            aria-label="Main navigation"
          >
            {navSections.map((section) => (
              <HeaderNavDropdown
                key={section.title}
                section={section}
              />
            ))}
          </nav>

          {/* ACCOUNT */}
          {loggedIn ? (
            <button
              onClick={() => setAccountOpen(true)}
              aria-label="Account"
              type="button"
              className="w-9 h-9 rounded-full bg-cream-alt border border-sage/30 flex items-center justify-center hover:border-gold active:scale-95 transition-all"
            >
              <User
                size={16}
                className="text-forest"
                strokeWidth={1.5}
              />
            </button>
          ) : (
            <Link
              href="/account/login"
              aria-label="Account"
              className="w-9 h-9 rounded-full bg-cream-alt border border-sage/30 flex items-center justify-center hover:border-gold active:scale-95 transition-all"
            >
              <User
                size={16}
                className="text-forest"
                strokeWidth={1.5}
              />
            </Link>
          )}
        </div>
      </header>

      {/* EXISTING MOBILE MENU */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* ACCOUNT PANEL */}
      <AccountPanel
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        thumbnails={thumbnails}
      />
    </>
  );
}