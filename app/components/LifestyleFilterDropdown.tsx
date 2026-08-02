"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import type { LifestyleCategory } from "../data/lifestyleCategories";

export default function LifestyleFilterDropdown({
  categories,
}: {
  categories: LifestyleCategory[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(key: string, title: string) {
    setSelected(title);
    setOpen(false);
    document.getElementById(key)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-8 pb-4 relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white border border-sage/30 rounded-full px-5 py-3 text-sm text-ink"
      >
        {selected ?? "All"}
        {open ? <ChevronUp size={18} className="text-sage" /> : <ChevronDown size={18} className="text-sage" />}
      </button>

      {open && (
        <div className="absolute left-6 right-6 mt-2 bg-white border border-sage/20 rounded-lg shadow-lg z-20 py-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => handleSelect(c.key, c.title)}
              className="w-full flex items-center justify-between px-5 py-3 text-left text-sm text-ink hover:bg-cream-alt"
            >
              {c.title}
              {selected === c.title && <Check size={16} className="text-gold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}