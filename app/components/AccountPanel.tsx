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
  Sparkles,
  BookOpen,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cldOptimized } from "@/lib/cloudinary";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { useDismissableOverlay } from "@/lib/hooks/useDismissableOverlay";
import { useMountedTransition } from "@/lib/hooks/useMountedTransition";
import { useSearchHistory } from "@/lib/hooks/useSearchHistory";
import SearchSuggestionsDropdown from "./SearchSuggestionsDropdown";

type Thumbnails = {
  how_it_works: string | null;
  learning_center: string | null;
  our_standards: string | null;
};

const MENU_ITEMS = [
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/account/messages",
    description: "Your conversations with our Breeders",
  },
  {
    icon: FileText,
    label: "Applications",
    href: "/account/applications",
    description: "Track your applications",
  },
  {
    icon: PawPrint,
    label: "Your Puppy",
    href: "/account/your-puppy",
    description: "Your puppy journey",
  },
  {
    icon: Heart,
    label: "Favorites",
    href: "/account/favorites",
    description: "Puppies you've saved",
  },
  {
    icon: CreditCard,
    label: "Payments",
    href: "/account/payments",
    description: "Orders and payments",
  },
  {
    icon: Settings,
    label: "Account Settings",
    href: "/account/settings",
    description: "Manage your account",
  },
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
      const fullName = data.user?.user_metadata?.full_name as
        | string
        | undefined;

      setFirstName(fullName?.split(" ")[0] ?? "there");
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) return null;

  function goSearch(term: string) {
    const cleanTerm = term.trim();

    if (cleanTerm) {
      addTerm(cleanTerm);
    }

    router.push(`/puppies?search=${encodeURIComponent(cleanTerm)}`);

    setSuggestOpen(false);
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
    {
      key: "how_it_works",
      label: "How It Works",
      href: "/how-it-works",
      eyebrow: "Start here",
      icon: PawPrint,
    },
    {
      key: "learning_center",
      label: "Visit the Learning Center",
      href: "/faqs",
      eyebrow: "Learn more",
      icon: BookOpen,
    },
    {
      key: "our_standards",
      label: "Learn About Our Standards",
      href: "/breeder-standards",
      eyebrow: "Our promise",
      icon: ShieldCheck,
    },
  ] as const;

  const footerLinks = [
    { label: "About Us", href: "/about" },
    { label: "Find a Puppy", href: "/puppies" },
    {
      label: "For Breeders",
      href: "/contact#breeder-application",
    },
    { label: "Terms & Privacy", href: "/terms" },
  ];

  return (
    <div
      className="fixed inset-0 z-[75]"
      role="dialog"
      aria-modal="true"
      aria-label="Account menu"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-[#102c27]/55 backdrop-blur-[3px] transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        tabIndex={-1}
        className={`absolute right-0 top-0 h-[100dvh] w-full bg-[#fbf8f1] text-ink outline-none shadow-[-20px_0_70px_rgba(25,59,53,0.14)] transition-transform duration-300 ease-out md:max-w-[470px] ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* Header */}
          <div className="shrink-0 border-b border-[#193b35]/[0.07]">
            <div className="flex items-center justify-between px-5 pb-4 pt-4 sm:px-7 sm:pt-5">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b9c95]">
                  Haven Paws
                </p>

                <h1 className="font-display text-[27px] leading-none tracking-[-0.025em] text-[#193b35]">
                  Hi, {firstName}!
                </h1>
              </div>

              <button
                onClick={onClose}
                aria-label="Close account menu"
                type="button"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#193b35]/10 bg-white/70 text-[#193b35] shadow-sm transition-all duration-200 hover:border-[#d7a94b]/60 hover:bg-white active:scale-90"
              >
                <X
                  size={18}
                  strokeWidth={1.7}
                  className="transition-transform duration-200 group-hover:rotate-90"
                />
              </button>
            </div>

            {/* Search */}
            <div
              ref={searchBoxRef}
              className="relative px-5 pb-5 sm:px-7"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search
                  size={17}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#799089]"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSuggestOpen(true)}
                  placeholder="Search a breed or puppy"
                  aria-label="Search a breed or puppy"
                  className="h-12 w-full rounded-full border border-[#193b35]/10 bg-white px-11 pr-12 text-[14px] text-[#193b35] shadow-[0_4px_20px_rgba(25,59,53,0.035)] outline-none placeholder:text-[#93a09b] transition-all duration-200 focus:border-[#d7a94b]/70 focus:bg-white focus:shadow-[0_6px_24px_rgba(25,59,53,0.07)]"
                />

                {search.trim() && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#f2eee4] text-[#657771] transition-colors hover:bg-[#e9e3d5]"
                  >
                    <X size={13} />
                  </button>
                )}
              </form>

              {suggestOpen && (
                <div className="absolute left-5 right-5 top-[calc(100%-0.5rem)] z-30 sm:left-7 sm:right-7">
                  <SearchSuggestionsDropdown
                    query={search}
                    history={terms}
                    onSelect={(term) => {
                      setSuggestOpen(false);
                      goSearch(term);
                    }}
                    onClearHistory={clearHistory}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {/* Account navigation */}
            <section className="px-5 pb-5 pt-6 sm:px-7">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b9c95]">
                    Your account
                  </p>
                  <p className="mt-1 text-xs text-[#7a8984]">
                    Everything in one place
                  </p>
                </div>

                <Sparkles
                  size={15}
                  strokeWidth={1.6}
                  className="text-[#c89b43]"
                />
              </div>

              <div className="overflow-hidden rounded-[20px] border border-[#193b35]/[0.07] bg-white shadow-[0_8px_30px_rgba(25,59,53,0.045)]">
                {MENU_ITEMS.map(
                  ({ icon: Icon, label, href, description }, index) => {
                    const active =
                      pathname === href ||
                      (href !== "/account" && pathname.startsWith(`${href}/`));

                    return (
                      <Link
                        key={label}
                        href={href}
                        className={`group relative flex items-center gap-3.5 px-4 py-3.5 transition-all duration-200 ${
                          index !== MENU_ITEMS.length - 1
                            ? "border-b border-[#193b35]/[0.055]"
                            : ""
                        } ${
                          active
                            ? "bg-[#f4efe4]"
                            : "hover:bg-[#faf8f2] active:bg-[#f4efe4]"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] transition-all duration-200 ${
                            active
                              ? "bg-[#193b35] text-white shadow-[0_5px_15px_rgba(25,59,53,0.16)]"
                              : "bg-[#f2eee5] text-[#315950] group-hover:bg-[#e9e4d8]"
                          }`}
                        >
                          <Icon size={18} strokeWidth={1.55} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-[14px] font-medium ${
                              active ? "text-[#193b35]" : "text-[#243b37]"
                            }`}
                          >
                            {label}
                          </span>

                          <span className="mt-0.5 block truncate text-[11px] text-[#8a9792]">
                            {description}
                          </span>
                        </span>

                        <ChevronRight
                          size={16}
                          strokeWidth={1.6}
                          className={`shrink-0 transition-all duration-200 ${
                            active
                              ? "translate-x-0 text-[#193b35]"
                              : "text-[#a3aea9] group-hover:translate-x-0.5 group-hover:text-[#193b35]"
                          }`}
                        />
                      </Link>
                    );
                  }
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  type="button"
                  className="group flex w-full items-center gap-3.5 border-t border-[#193b35]/[0.07] px-4 py-3.5 text-left transition-colors hover:bg-[#fff9f2] active:bg-[#f7eee3]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#f7eee7] text-[#8c6847] transition-colors group-hover:bg-[#f2e6d8]">
                    <LogOut size={18} strokeWidth={1.55} />
                  </span>

                  <span className="flex-1">
                    <span className="block text-[14px] font-medium text-[#4b4038]">
                      Log Out
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#9a8f86]">
                      Sign out of this account
                    </span>
                  </span>

                  <ChevronRight
                    size={16}
                    strokeWidth={1.6}
                    className="text-[#b2a59b] transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </section>

            {/* Learn / discover */}
            <section className="border-t border-[#193b35]/[0.06] bg-[#f5f0e6] px-5 py-6 sm:px-7">
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b9c95]">
                  Discover Haven Paws
                </p>

                <h2 className="mt-1 font-display text-[21px] leading-tight text-[#193b35]">
                  Helpful places to begin
                </h2>
              </div>

              <div className="space-y-3">
                {featuredCards.map((card, index) => {
                  const thumb = thumbnails[card.key];
                  const Icon = card.icon;

                  return (
                    <Link
                      key={card.key}
                      href={card.href}
                      className="group relative flex min-h-[78px] overflow-hidden rounded-[18px] border border-[#193b35]/[0.07] bg-white shadow-[0_5px_20px_rgba(25,59,53,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,59,53,0.08)] active:scale-[0.985]"
                    >
                      <div className="relative h-[78px] w-[86px] shrink-0 overflow-hidden bg-[#e7eee5]">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cldOptimized(thumb, 180)}
                            alt=""
                            aria-hidden="true"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#e8efe6]">
                            <Icon
                              size={23}
                              strokeWidth={1.4}
                              className="text-[#6f8a81]"
                            />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/[0.04]" />
                      </div>

                      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4">
                        <div className="min-w-0">
                          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9a9e91]">
                            {card.eyebrow}
                          </p>

                          <p className="text-[13px] font-medium leading-snug text-[#243b37]">
                            {card.label}
                          </p>
                        </div>

                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3efe6] text-[#315950] transition-all duration-200 group-hover:bg-[#193b35] group-hover:text-white">
                          <ArrowUpRight
                            size={14}
                            strokeWidth={1.6}
                          />
                        </span>
                      </div>

                      {index === 0 && (
                        <span className="absolute left-0 top-0 h-full w-[2px] bg-[#d7a94b]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Secondary navigation */}
            <section className="px-5 pb-10 pt-6 sm:px-7">
              <div className="mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b9c95]">
                  More from Haven Paws
                </p>
              </div>

              <div className="overflow-hidden rounded-[18px] border border-[#193b35]/[0.07] bg-white">
                {footerLinks.map((link, index) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`group flex items-center justify-between px-4 py-4 transition-colors duration-200 hover:bg-[#faf8f2] active:bg-[#f4efe4] ${
                      index !== footerLinks.length - 1
                        ? "border-b border-[#193b35]/[0.055]"
                        : ""
                    }`}
                  >
                    <span className="text-[13px] font-medium text-[#334741]">
                      {link.label}
                    </span>

                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f0e7] text-[#8b9993] transition-all duration-200 group-hover:bg-[#193b35] group-hover:text-white">
                      <ChevronRight
                        size={14}
                        strokeWidth={1.6}
                      />
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-[#9aa49f]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d7a94b]" />
                <span>Thoughtful puppy placement, every step of the way</span>
              </div>
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}