"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Section = {
  title: string;
  links: { label: string; href: string }[];
};

function buildSections(loggedIn: boolean): Section[] {
  return [
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
        {
          label: loggedIn ? "My Account" : "Log In or Sign Up",
          href: loggedIn ? "/account" : "/account/login",
        },
        { label: "Breed Guides", href: "/breed-guides" },
        { label: "Puppy Training Program", href: "/puppy-training" },
        { label: "AKC Registration", href: "/akc-registration" },
        { label: "AKC Benefits", href: "/akc-benefits" },
        { label: "Fetch Insurance", href: "/fetch-insurance" },
        { label: "Haven Paws Reviews", href: "/reviews" },
      ],
    },
    {
      title: "For Breeders",
      links: [
        { label: "New Breeder Application", href: "/contact#breeder-application" },
        { label: "Breeder Standards", href: "/breeder-standards" },
      ],
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
}

export default function FooterAccordion() {
  const [open, setOpen] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const sections = buildSections(loggedIn);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      {sections.map((section) => {
        const isOpen = open === section.title;
        return (
          <div key={section.title} className="border-b border-sage/20">
            <button
              onClick={() => setOpen(isOpen ? null : section.title)}
              className="w-full flex items-center justify-between py-3.5 text-left"
            >
              <span className="font-display text-base text-forest">{section.title}</span>
              {isOpen ? (
                <ChevronUp size={16} className="text-sage" />
              ) : (
                <ChevronDown size={16} className="text-sage" />
              )}
            </button>
            {isOpen && (
              <div className="pb-4 space-y-2.5">
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