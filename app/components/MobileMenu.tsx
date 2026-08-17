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

  const { terms, addTerm, clearHistory } = useSearchHistory();

  const searchBoxRef = useRef<HTMLDivElement>(null);

  const { mounted, entered } = useMountedTransition(open);
  const panelRef = useDismissableOverlay(open, onClose);

  useBodyScrollLock(open);

  useEffect(() => {
    onClose();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setSuggestOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  if (!mounted) {
    return null;
  }

  function goSearch(term: string) {
    if (term.trim()) {
      addTerm(term.trim());
    }

    router.push(
      `/puppies?search=${encodeURIComponent(term)}`
    );

    onClose();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    goSearch(search);
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
      {/* MOBILE HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-sage/20">
        <button
          onClick={onClose}
          aria-label="Close menu"
          type="button"
          className="active:scale-90 transition-transform"
        >
          <X
            size={24}
            className="text-ink"
          />
        </button>

        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2"
          aria-label="Haven Paws home"
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
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onFocus={() =>
                setSuggestOpen(true)
              }
              placeholder="Search by breed or puppy name"
              className="w-full border border-sage/30 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gold"
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

        {/* BROWSE */}
        <p className="eyebrow mb-3">
          Browse available puppies by
        </p>

        {/* HOME */}
        <Link
          href="/"
          onClick={onClose}
          className="block font-display text-xl text-forest py-3 border-b border-sage/20"
        >
          Home
        </Link>

        {/* BROWSE ALL PUPPIES */}
        <Link
          href="/puppies"
          onClick={onClose}
          className="block font-display text-xl text-forest py-3 border-b border-sage/20"
        >
          Browse all puppies
        </Link>

        {/* BREEDS */}
        <button
          onClick={() =>
            setBreedsOpen(!breedsOpen)
          }
          aria-expanded={breedsOpen}
          type="button"
          className="w-full flex items-center justify-between font-display text-xl text-forest py-3 border-b border-sage/20"
        >
          Breed

          <ChevronDown
            size={20}
            className={`transition-transform duration-250 ${
              breedsOpen
                ? "rotate-180"
                : ""
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
            <div className="max-h-64 overflow-y-auto py-2 border-b border-sage/20">
              {BREEDS.map((breed) => (
                <Link
                  key={breed}
                  href={`/puppies?breed=${encodeURIComponent(
                    breed
                  )}`}
                  onClick={onClose}
                  className="block text-sm text-ink/80 py-2"
                >
                  {breed}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <p className="eyebrow mt-8 mb-3">
          How it works
        </p>

        <Link
          href="/about"
          onClick={onClose}
          className="flex items-center justify-between font-display text-xl text-forest py-3 border-b border-sage/20"
        >
          About Us
          <ChevronRight size={20} />
        </Link>

        <Link
          href="/delivery"
          onClick={onClose}
          className="flex items-center justify-between font-display text-xl text-forest py-3 border-b border-sage/20"
        >
          Delivery &amp; Care
          <ChevronRight size={20} />
        </Link>

        {/* CONTACT */}
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