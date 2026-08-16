"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  X,
  Search,
  ChevronRight,
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
  const [suggestOpen, setSuggestOpen] = useState(false);

  // Tracks which main navigation section is open
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Authentication state
  const [loggedIn, setLoggedIn] = useState(false);

  const { terms, addTerm, clearHistory } = useSearchHistory();

  const searchBoxRef = useRef<HTMLDivElement>(null);

  const { mounted, entered } = useMountedTransition(open);
  const panelRef = useDismissableOverlay(open, onClose);

  useBodyScrollLock(open);

  /*
   * Close the mobile menu whenever the route changes.
   */
  useEffect(() => {
    onClose();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /*
   * Get authentication state.
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

    return () => listener.subscription.unsubscribe();
  }, []);

  /*
   * Close search suggestions when clicking outside
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

  if (!mounted) return null;

  /*
   * Build the exact same navigation sections used
   * by the desktop header and footer.
   */
  const navSections = buildNavSections(loggedIn);

  function goSearch(term: string) {
    if (term.trim()) {
      addTerm(term.trim());
    }

    router.push(`/puppies?search=${encodeURIComponent(term)}`);

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
      {/* =========================================================
          MOBILE MENU HEADER
      ========================================================= */}

      <div className="flex items-center justify-between px-5 py-4 border-b border-sage/20">
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="active:scale-90 transition-transform"
        >
          <X size={24} className="text-ink" />
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

        <div className="w-6" />
      </div>

      <div className="px-5 py-6">

        {/* =======================================================
            SEARCH
        ======================================================= */}

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
              className="w-full border border-sage/30 rounded-full pl-11 pr-4 py-3 text-sm bg-white/50 focus:outline-none focus:border-gold"
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

        {/* =======================================================
            MAIN NAVIGATION
        ======================================================= */}

        <p className="eyebrow mb-3">
          Explore Haven Paws
        </p>

        <div className="border-t border-sage/20">

          {navSections.map((section) => {
            const isOpen = openSection === section.title;

            return (
              <div
                key={section.title}
                className="border-b border-sage/20"
              >
                {/* SECTION BUTTON */}

                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between py-4 text-left"
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

                {/* SECTION LINKS */}

                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{
                    gridTemplateRows: isOpen
                      ? "1fr"
                      : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="pb-4 pl-2">

                      {section.links.map((link) => (
                        <Link
                          key={`${section.title}-${link.href}`}
                          href={link.href}
                          onClick={onClose}
                          className="flex items-center justify-between py-3 text-base text-ink/80 hover:text-forest transition-colors"
                        >
                          <span>{link.label}</span>

                          <ChevronRight
                            size={17}
                            className="text-sage"
                          />
                        </Link>
                      ))}

                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* =======================================================
            BREED BROWSER
        ======================================================= */}

        <div className="mt-8">

          <p className="eyebrow mb-3">
            Browse by breed
          </p>

          <button
            type="button"
            onClick={() => setBreedsOpen(!breedsOpen)}
            aria-expanded={breedsOpen}
            className="w-full flex items-center justify-between font-display text-xl text-forest py-4 border-b border-sage/20"
          >
            <span>Breed directory</span>

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

              <div className="max-h-72 overflow-y-auto py-2 border-b border-sage/20">

                {BREEDS.map((breed) => (
                  <Link
                    key={breed}
                    href={`/puppies?breed=${encodeURIComponent(
                      breed
                    )}`}
                    onClick={onClose}
                    className="flex items-center justify-between py-2.5 text-sm text-ink/80 hover:text-forest transition-colors"
                  >
                    <span>{breed}</span>

                    <ChevronRight
                      size={15}
                      className="text-sage"
                    />
                  </Link>
                ))}

              </div>

            </div>
          </div>

        </div>

        {/* =======================================================
            QUICK SEARCH LINK
        ======================================================= */}

        <Link
          href="/puppies"
          onClick={onClose}
          className="mt-8 flex items-center justify-between font-display text-xl text-forest py-4 border-b border-sage/20"
        >
          <span>Browse all puppies</span>

          <ChevronRight size={20} />
        </Link>

        {/* =======================================================
            FOOTER-STYLE CONTACT SHORTCUT
        ======================================================= */}

        <Link
          href="/contact"
          onClick={onClose}
          className="block text-ink/80 mt-8 py-2"
        >
          Contact Us
        </Link>

      </div>
    </div>
  );
}