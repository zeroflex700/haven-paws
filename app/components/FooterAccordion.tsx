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

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const sections = buildNavSections(loggedIn);

  const sectionColors = [
    {
      background: "bg-[#1B354B]",
      accent: "text-[#D9B75D]",
    },
    {
      background: "bg-[#203D54]",
      accent: "text-[#8FBBD1]",
    },
    {
      background: "bg-[#1E384D]",
      accent: "text-[#D9B75D]",
    },
    {
      background: "bg-[#24435A]",
      accent: "text-[#9DC6D8]",
    },
    {
      background: "bg-[#1B354B]",
      accent: "text-[#D9B75D]",
    },
    {
      background: "bg-[#203D54]",
      accent: "text-[#8FBBD1]",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3">
      {sections.map((section, index) => {
        const isOpen = open === section.title;
        const palette = sectionColors[index % sectionColors.length];

        return (
          <div
            key={section.title}
            className={`border-b border-white/8 md:border-r ${
              index % 2 === 0 ? "lg:border-r" : ""
            } ${palette.background}`}
          >
            <button
              type="button"
              onClick={() =>
                setOpen(isOpen ? null : section.title)
              }
              aria-expanded={isOpen}
              className="group flex min-h-[68px] w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-white/[0.035] sm:px-6"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${palette.accent} bg-current transition-transform duration-300 ${
                    isOpen ? "scale-150" : ""
                  }`}
                />

                <span className="font-display text-base text-white/90 transition-colors group-hover:text-white">
                  {section.title}
                </span>
              </span>

              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 ${
                  isOpen
                    ? "border-[#D9B75D]/30 bg-[#D9B75D]/10"
                    : ""
                }`}
              >
                <ChevronDown
                  size={15}
                  className={`text-white/50 transition-transform duration-300 ${
                    isOpen
                      ? "rotate-180 text-[#D9B75D]"
                      : ""
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
                <div className="px-6 pb-5 pt-0">
                  <div className="space-y-2 border-l border-white/10 pl-4">
                    {section.links.map((link) => (
                      <Link
                        key={`${section.title}-${link.href}`}
                        href={link.href}
                        className="group/link block py-1 text-sm text-white/55 transition-colors hover:text-white"
                      >
                        <span className="transition-transform duration-200 group-hover/link:translate-x-1">
                          {link.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}