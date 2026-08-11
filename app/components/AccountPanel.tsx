"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  X,
  Search,
  MessageSquare,
  FileText,
  PawPrint,
  Heart,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cldOptimized } from "@/lib/cloudinary";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { useDismissableOverlay } from "@/lib/hooks/useDismissableOverlay";
import { useMountedTransition } from "@/lib/hooks/useMountedTransition";
import { useSearchHistory } from "@/lib/hooks/useSearchHistory";
import SearchSuggestionsDropdown from "./SearchSuggestionsDropdown";

type Thumbnails = { how_it_works: string | null; learning_center: string | null; our_standards: string | null };

const MENU_ITEMS = [
  { icon: MessageSquare, label: "Messages", href: "/account/messages" },
  { icon: FileText, label: "Applications", href: "/account/applications" },
  { icon: PawPrint, label: "Your Puppy", href: "/account/your-puppy" },
  { icon: Heart, label: "Favorites", href: "/account/favorites" },
  { icon: CreditCard, label: "Payments", href: "/account/payments" },
  { icon: Settings, label: "Account Settings", href: "/account/settings" },
];

export default function AccountPanel({
  open,
  onClose,
  thumbnails,
}: {
  open: boolean;
  onClose: () => void;
  thumbnails: Thumbnails;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [firstName, setFirstName] = useState("there");
  const [search, setSearch] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const { terms, addTerm, clearHistory } = useSearchHistory();
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const { mounted, entered } = useMountedTransition(open);
  const panelRef = useDismissableOverlay(open, onClose);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    supabase.auth.getUser().then(({ data }) => {
      const fullName = data.user?.user_metadata?.full_name as string | undefined;
      setFirstName(fullName?.split(" ")[0] ?? "there");
    });
  }, [open]);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSuggestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  function goSearch(term: string) {
    if (term.trim()) addTerm(term.trim());
    router.push(`/puppies?search=${encodeURIComponent(term)}`);
    onClose();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    goSearch(search);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    onClose();
    router.push("/");
    router.refresh();
  }

  const featuredCards = [
    { key: "how_it_works", label: "How It Works", href: "/how-it-works" },
    { key: "learning_center", label: "Visit the Learning Center", href: "/faqs" },
    { key: "our_standards", label: "Learn About Our Standards", href: "/breeder-standards" },
  ] as const;

  const footerLinks = [
    { label: "About Us", href: "/about" },
    { label: "Find a Puppy", href: "/puppies" },
    { label: "For Breeders", href: "/contact#breeder-application" },
    { label: "Terms & Privacy", href: "/terms" },
  ];

  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Account menu">
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-forest/40 transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={`absolute inset-0 bg-cream overflow-y-auto outline-none transition-all duration-300 ease-out ${
          entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <div className="max-w-md mx-auto min-h-screen" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          <div
            className="flex items-center justify-between px-5 pb-4"
            style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1.5rem)" }}
          >
            <h1 className="font-display text-2xl text-forest">Hi, {firstName}!</h1>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full border border-sage/30 flex items-center justify-center active:scale-90 transition-transform"
            >
              <X size={18} className="text-ink" />
            </button>
          </div>

          <div ref={searchBoxRef} className="px-5 mb-5 relative">
            <form onSubmit={handleSearch} className="relative">
              <Search size={16} className="absolute left-9 top-1/2 -translate-y-1/2 text-sage" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSuggestOpen(true)}
                placeholder="Search a breed"
                className="w-full border border-sage/30 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold"
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

          <div className="px-5">
            {MENU_ITEMS.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 py-3 text-ink active:bg-cream-alt -mx-2 px-2 rounded-lg transition-colors"
              >
                <Icon size={18} className="text-forest" strokeWidth={1.5} />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 py-3 text-ink w-full text-left active:bg-cream-alt -mx-2 px-2 rounded-lg transition-colors"
            >
              <LogOut size={18} className="text-forest" strokeWidth={1.5} />
              <span className="text-sm">Log Out</span>
            </button>
          </div>

          <div className="border-t border-sage/20 mt-2 px-5">
            {featuredCards.map((card) => {
              const thumb = thumbnails[card.key];
              return (
                <Link
                  key={card.key}
                  href={card.href}
                  className="flex items-center gap-3 py-4 border-b border-sage/10 active:bg-cream-alt -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream-alt shrink-0">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cldOptimized(thumb, 100)}
                        alt={card.label}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="text-sm text-ink">{card.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="px-5 mt-2 pb-10">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center justify-between py-3.5 border-b border-sage/10 text-sm text-ink active:bg-cream-alt -mx-2 px-2 rounded-lg transition-colors"
              >
                {link.label}
                <ChevronRight size={16} className="text-sage" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}