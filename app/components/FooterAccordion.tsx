"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

type Section = {
  title: string;
  links: { label: string; href: string }[];
};

const SECTIONS: Section[] = [
  {
    title: "Explore",
    links: [
      { label: "Browse All Puppies", href: "/puppies" },
      { label: "Explore Available Breeds", href: "/breeds" },
      { label: "Explore by Lifestyle", href: "/lifestyle" },
    ],
  },
  {
    title: "For Puppy Parents",
    links: [
      { label: "Log In or Sign Up", href: "/account/login" },
      { label: "AKC Registration", href: "/akc-registration" },
      { label: "AKC Benefits", href: "/akc-benefits" },
      { label: "Fetch Insurance", href: "/fetch-insurance" },
      { label: "Haven Paws Reviews", href: "/reviews" },
    ],
  },
  {
    title: "For Breeders",
    links: [{ label: "Breeder Standards", href: "/breeder-standards" }],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Help Center", href: "/help-center" },
      { label: "FAQs", href: "/faqs" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
  {
    title: "About Haven Paws",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "About Us", href: "/about" },
      { label: "Our Promise", href: "/our-promise" },
      { label: "Our Delivery Programs", href: "/delivery" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
];

export default function FooterAccordion() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-6">
      {SECTIONS.map((section) => {
        const isOpen = open === section.title;
        return (
          <div key={section.title} className="border-b border-sage/20">
            <button
              onClick={() => setOpen(isOpen ? null : section.title)}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="font-display text-lg text-forest">{section.title}</span>
              {isOpen ? (
                <ChevronUp size={18} className="text-sage" />
              ) : (
                <ChevronDown size={18} className="text-sage" />
              )}
            </button>
            {isOpen && (
              <div className="pb-4 space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-ink/70 hover:text-forest"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}