"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export type FaqItem = { question: string; answer: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-sage/15 border-t border-b border-sage/15">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-sm font-medium text-ink">{item.question}</span>
              <span className="shrink-0 w-6 h-6 rounded-full bg-cream-alt flex items-center justify-center transition-transform duration-300">
                {isOpen ? <Minus size={13} className="text-forest" /> : <Plus size={13} className="text-forest" />}
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-line pb-4">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}