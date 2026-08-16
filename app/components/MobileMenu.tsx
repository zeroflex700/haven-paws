"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  X,
  Search,
  ChevronDown,
  PawPrint,
} from "lucide-react";

import { BREEDS } from "../data/breeds";
import { supabase } from "@/lib/supabase/client";
import { buildNavSections } from "@/lib/navSections";

import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { useDismissableOverlay } from "@/lib/hooks/useDismissableOverlay";
import { useMountedTransition } from "@/lib/hooks/useMountedTransition";
import { useSearchHistory } from "@/lib/hooks/useSearchHistory";

import SearchSuggestionsDropdown from "./SearchSuggestionsDropdown";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [breedsOpen, setBreedsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const { terms, addTerm, clearHistory } = useSearchHistory();

  const searchBoxRef = useRef<HTMLDivElement>(null);

  const { mounted, entered } = useMountedTransition(open);

  const panelRef = useDismissableOverlay(open, onClose);

  useBodyScrollLock(open);

  /*
   * Keep authentication state in sync.
   * This is important because buildNavSections()
   * changes "Log In or Sign Up" into "My Account"
   * when the user is logged in.
   */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /*
   * Close the mobile menu whenever navigation occurs.
   */
  useEffect(() => {
    onClose();

    // We intentionally only react to pathname changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /*
   * Close search suggestions when tapping outside
   * the search box.
   */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setSuggestOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  /*
   * Use the exact same navigation data as:
   * - FooterAccordion
   * - Navbar desktop dropdowns
   */
  const sections = buildNavSections(loggedIn);

  function goSearch(term: string) {
    const trimmed = term.trim();

    if (trimmed) {
      addTerm(trimmed);
    }

    router.push(
      `/puppies?search=${encodeURIComponent(trimmed)}`
    );

    onClose();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    goSearch(search);
  }

  function toggleSection(title: string) {
    setOpenSection((current) =>
      current === title ? null : title
    );
  }

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className={`fixed inset-0 z-[60] bg-cream overflow-y-auto outline-none transition-opacity duration-250 ease-out ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* ─────────────────────────────────────────
          MOBILE MENU HEADER
      ───────────────────────────────────────── */}

      <div className="sticky top-0 z-10 bg-cream border-b border-sage/20">
        <div className="flex items-center justify-between px-5 py-4">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-alt active:scale-90 transition-all"
          >
            <X
              size={23}
              className="text-ink"
              strokeWidth={1.6}
            />
          </button>

          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <PawPrint
              size={20}
              className="text-gold"
              strokeWidth={1.5}
            />

            <span className="font-display text-lg text-forest">
              Haven Paws
            </span>
          </Link>

          <div className="w-9" />
        </div>
      </div>

      {/* ─────────────────────────────────────────
          CONTENT
      ───────────────────────────────────────── */}

      <div className="px-5 py-6">
        {/* SEARCH */}

        <div
          ref={searchBoxRef}
          className="relative mb-8"
        >
          <form
            onSubmit={handleSearch}
            className="relative"
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sage"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSuggestOpen(true)}
              placeholder="Search by breed or puppy name"
              aria-label="Search by breed or puppy name"
              className="w-full border border-sage/30 rounded-full pl-11 pr-4 py-3.5 text-sm bg-white/60 focus:outline-none focus:border-gold"
            />
          </form>

          {suggestOpen && (
            <SearchSuggestionsDropdown
              query={search}
              history={terms}
              onSelect={(term) => {
                setSuggestOpen(false);
                goSearch(term);
              }}
              onClearHistory={clearHistory}
            />
          )}
        </div>

        {/* ─────────────────────────────────────────
            FOOTER NAVIGATION — SAME DATA SOURCE
        ───────────────────────────────────────── */}

        <div className="space-y-0">
          {sections.map((section) => {
            const isOpen =
              openSection === section.title;

            return (
              <div
                key={section.title}
                className="border-b border-sage/20"
              >
                <button
                  type="button"
                  onClick={() =>
                    toggleSection(section.title)
                  }
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="font-display text-xl text-forest">
                    {section.title}
                  </span>

                  <ChevronDown
                    size={20}
                    className={`text-sage transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{
                    gridTemplateRows: isOpen
                      ? "1fr"
                      : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="pb-5 space-y-1">
                      {section.links.map((link) => (
                        <Link
                          key={`${section.title}-${link.href}`}
                          href={link.href}
                          onClick={onClose}
                          className="block py-2.5 pl-1 text-sm text-ink/75 hover:text-forest transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─────────────────────────────────────────
            BREED BROWSER
           
            This is extra functionality that exists
            in the old mobile menu but isn't part of
            the footer navigation.
        ───────────────────────────────────────── */}

        <div className="border-b border-sage/20">
          <button
            type="button"
            onClick={() =>
              setBreedsOpen(!breedsOpen)
            }
            aria-expanded={breedsOpen}
            className="w-full flex items-center justify-between py-5 text-left"
          >
            <span className="font-display text-xl text-forest">
              Browse by Breed
            </span>

            <ChevronDown
              size={20}
              className={`text-sage transition-transform duration-300 ${
                breedsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className="grid transition-[grid-template-rows] duration-300 ease-out"
            style={{
              gridTemplateRows: breedsOpen
                ? "1fr"
                : "0fr",
            }}
          >
            <div className="overflow-hidden">
              <div className="max-h-72 overflow-y-auto pb-5 space-y-1">
                {BREEDS.map((breed) => (
                  <Link
                    key={breed}
                    href={`/puppies?breed=${encodeURIComponent(
                      breed
                    )}`}
                    onClick={onClose}
                    className="block py-2.5 pl-1 text-sm text-ink/75 hover:text-forest transition-colors"
                  >
                    {breed}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────
            DIRECT CONTACT
        ───────────────────────────────────────── */}

        <Link
          href="/contact"
          onClick={onClose}
          className="block font-display text-xl text-forest py-5"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}