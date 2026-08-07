"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X, Search } from "lucide-react";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { useDismissableOverlay } from "@/lib/hooks/useDismissableOverlay";
import { useMountedTransition } from "@/lib/hooks/useMountedTransition";

const NAV_LINKS = [
  { label: "Available Puppies", href: "/puppies" },
  { label: "Explore Available Breeds", href: "/breeds" },
  { label: "Explore by Lifestyle", href: "/lifestyle" },
  { label: "Breed Guides", href: "/breed-guides" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Delivery Programs", href: "/delivery" },
  { label: "Contact Us", href: "/contact" },
];

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { mounted, entered } = useMountedTransition(open);
  const panelRef = useDismissableOverlay(open, onClose);
  useBodyScrollLock(open);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-forest/50 transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={`absolute inset-y-0 left-0 w-[85%] max-w-sm bg-cream overflow-y-auto outline-none transition-transform duration-300 ease-out ${
          entered ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <span className="font-display text-lg text-forest">Haven Paws</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full border border-sage/30 flex items-center justify-center active:scale-90 transition-transform"
          >
            <X size={18} className="text-ink" />
          </button>
        </div>

        <div className="px-5 mb-4 relative">
          <Search size={16} className="absolute left-9 top-1/2 -translate-y-1/2 text-sage" />
          <Link
            href="/puppies"
            className="block w-full border border-sage/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-sage"
          >
            Search a breed or puppy
          </Link>
        </div>

        <nav className="px-5 pb-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-ink text-[15px] border-b border-sage/10 active:bg-cream-alt transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}