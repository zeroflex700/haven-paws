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
          transition-all duration-500 ease-out
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
        <div
          className={`
            mx-auto
            transition-all duration-500 ease-out
            ${
              scrolled
                ? "max-w-[78rem] px-3 sm:px-5 lg:px-6 pt-2"
                : "max-w-7xl px-0 sm:px-3 lg:px-4 pt-0"
            }
          `}
        >
          <div
            className={`
              relative
              flex items-center justify-between
              min-h-[64px]
              px-4 sm:px-5 lg:px-6
              border
              transition-all duration-500
              ${
                scrolled
                  ? `
                    rounded-2xl
                    bg-white/88
                    backdrop-blur-2xl
                    border-forest/10
                    shadow-[0_12px_40px_rgba(48,70,93,0.08)]
                  `
                  : `
                    bg-white/75
                    backdrop-blur-xl
                    border-transparent
                  `
              }
            `}
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(true)}
                className="
                  md:hidden
                  flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  border border-forest/10
                  bg-white/70
                  text-forest
                  transition-all
                  hover:border-gold/40
                  hover:bg-white
                  active:scale-90
                "
                aria-label="Open menu"
                type="button"
              >
                <Menu
                  size={19}
                  strokeWidth={1.7}
                />
              </button>

              <Link
                href="/"
                className="
                  group
                  flex items-center gap-2.5
                  rounded-full
                  py-2
                  pr-2
                  text-forest
                "
                aria-label="Haven Paws home"
              >
                <span
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-full
                    bg-forest
                    shadow-sm
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                >
                  <PawPrint
                    size={16}
                    className="text-white"
                    strokeWidth={1.6}
                  />
                </span>

                <span
                  className="
                    font-display
                    text-[18px]
                    tracking-[-0.02em]
                    text-forest
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
                absolute left-1/2
                -translate-x-1/2
                items-center
                gap-1
                lg:gap-2
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
            <div className="flex items-center">
              {loggedIn ? (
                <button
                  onClick={() => setAccountOpen(true)}
                  aria-label="Account"
                  type="button"
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-full
                    border border-forest/10
                    bg-white
                    text-forest
                    shadow-sm
                    transition-all
                    hover:border-gold/50
                    hover:shadow-md
                    active:scale-95
                  "
                >
                  <User
                    size={17}
                    strokeWidth={1.5}
                  />
                </button>
              ) : (
                <Link
                  href={getLoginUrl()}
                  aria-label="Account"
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-full
                    border border-forest/10
                    bg-white
                    text-forest
                    shadow-sm
                    transition-all
                    hover:border-gold/50
                    hover:shadow-md
                    active:scale-95
                  "
                >
                  <User
                    size={17}
                    strokeWidth={1.5}
                  />
                </Link>
              )}
            </div>
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