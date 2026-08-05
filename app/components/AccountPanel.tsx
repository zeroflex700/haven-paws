"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [firstName, setFirstName] = useState("there");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    supabase.auth.getUser().then(({ data }) => {
      const fullName = data.user?.user_metadata?.full_name as string | undefined;
      setFirstName(fullName?.split(" ")[0] ?? "there");
    });
  }, [open]);

  if (!open) return null;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/puppies?search=${encodeURIComponent(search)}`);
    onClose();
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
    <div className="fixed inset-0 z-[75] bg-cream overflow-y-auto">
      <div className="max-w-md mx-auto min-h-screen">
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <h1 className="font-display text-2xl text-forest">Hi, {firstName}!</h1>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full border border-sage/30 flex items-center justify-center"
          >
            <X size={18} className="text-ink" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="px-5 mb-5 relative">
          <Search size={16} className="absolute left-9 top-1/2 -translate-y-1/2 text-sage" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a breed"
            className="w-full border border-sage/30 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold"
          />
        </form>

        <div className="px-5">
          {MENU_ITEMS.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 py-3 text-ink"
            >
              <Icon size={18} className="text-forest" strokeWidth={1.5} />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-3 text-ink w-full text-left"
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
                onClick={onClose}
                className="flex items-center gap-3 py-4 border-b border-sage/10"
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
              onClick={onClose}
              className="flex items-center justify-between py-3.5 border-b border-sage/10 text-sm text-ink"
            >
              {link.label}
              <ChevronRight size={16} className="text-sage" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}