"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { buildNavSections } from "@/lib/navSections";

export default function FooterAccordion() {
  const [open, setOpen] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const sections = buildNavSections(loggedIn);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <div className="divide-y divide-white/10 border-y border-white/10">
        {sections.map((section) => {
          const isOpen = open === section.title;

          return (
            <div key={section.title}>
              <button
                type="button"
                onClick={() =>
                  setOpen(isOpen ? null : section.title)
                }
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between py-2.5 text-left group"
              >
                <span className="font-display text-[15px] text-white/85 group-hover:text-white transition-colors">
                  {section.title}
                </span>

                <span className="w-6 h-6 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                  <ChevronDown
                    size={13}
                    className={`text-white/50 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-gold" : ""
                    }`}
                  />
                </span>
              </button>

              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden">
                  <div className="pb-3 pl-0 space-y-2">
                    {section.links.map((link) => (
                      <Link
                        key={`${section.title}-${link.href}`}
                        href={link.href}
                        className="block text-sm text-white/55 hover:text-white transition-colors"
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
    </div>
  );
}