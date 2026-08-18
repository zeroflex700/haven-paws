"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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

  const pathname = usePathname();

  const scrollDirection = useScrollDirection();
  const scrolled = useStickyNavigation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setLoggedIn(!!session);
      });

    return () => {
      listener.subscription.unsubscribe();
    };
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

  function getLoginUrl() {
    const currentPath =
      pathname && pathname !== "/account/login"
        ? pathname
        : "/";

    return `/account/login?redirectTo=${encodeURIComponent(
      currentPath
    )}`;
  }

  return (
    <>
      <header
        className={`
          sticky top-0 z-50
          border-b
          transition-all duration-500
          ${
            scrolled
              ? "bg-[#fbf7ef]/94 border-[#193b35]/10 shadow-[0_8px_30px_rgba(25,59,53,0.07)]"
              : "bg-[#fbf7ef]/80 border-transparent"
          }
          ${
            scrollDirection === "down"
              ? "-translate-y-full"
              : "translate-y-0"
          }
        `}
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="h-[68px] flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-3">

              <button
                onClick={() => setMenuOpen(true)}
                className="
                  md:hidden
                  w-10 h-10
                  rounded-full
                  flex items-center justify-center
                  border border-[#193b35]/10
                  bg-white/50
                  text-[#193b35]
                  hover:bg-white
                  hover:border-[#d7a94b]/60
                  active:scale-90
                  transition-all
                "
                aria-label="Open menu"
                type="button"
              >
                <Menu
                  size={19}
                  strokeWidth={1.6}
                />
              </button>

              <Link
                href="/"
                className="
                  group
                  flex items-center gap-2.5
                  shrink-0
                "
                aria-label="Haven Paws home"
              >
                <span
                  className="
                    w-9 h-9
                    rounded-full
                    bg-[#193b35]
                    flex items-center justify-center
                    shadow-[0_5px_15px_rgba(25,59,53,0.15)]
                    group-hover:bg-[#d7a94b]
                    transition-colors duration-300
                  "
                >
                  <PawPrint
                    size={18}
                    className="text-white group-hover:text-[#193b35] transition-colors"
                    strokeWidth={1.5}
                  />
                </span>

                <span
                  className="
                    font-display
                    text-[19px]
                    text-[#193b35]
                    tracking-[-0.025em]
                  "
                >
                  Haven Paws
                </span>
              </Link>
            </div>

            {/* DESKTOP NAV */}
            <nav
              className="
                hidden md:flex
                items-center
                gap-1
                lg:gap-2
                px-2 py-1
                rounded-full
                bg-white/45
                border border-[#193b35]/[0.06]
              "
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
                className="
                  w-10 h-10
                  rounded-full
                  bg-[#193b35]
                  border border-[#193b35]
                  flex items-center justify-center
                  hover:bg-[#d7a94b]
                  hover:border-[#d7a94b]
                  hover:text-[#193b35]
                  active:scale-95
                  transition-all duration-300
                "
              >
                <User
                  size={16}
                  className="text-white"
                  strokeWidth={1.6}
                />
              </button>
            ) : (
              <Link
                href={getLoginUrl()}
                aria-label="Account"
                className="
                  w-10 h-10
                  rounded-full
                  bg-white/65
                  border border-[#193b35]/10
                  flex items-center justify-center
                  hover:bg-[#193b35]
                  hover:border-[#193b35]
                  active:scale-95
                  transition-all duration-300
                  group
                "
              >
                <User
                  size={16}
                  className="
                    text-[#193b35]
                    group-hover:text-white
                    transition-colors
                  "
                  strokeWidth={1.6}
                />
              </Link>
            )}
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <AccountPanel
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        thumbnails={thumbnails}
      />
    </>
  );
}