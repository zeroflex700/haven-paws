"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

type FaqItem = { question: string; answer: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-sage/20">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left gap-4"
            >
              <span className="font-display text-lg text-forest">{item.question}</span>
              {isOpen ? (
                <Minus size={20} className="text-sage shrink-0" />
              ) : (
                <Plus size={20} className="text-sage shrink-0" />
              )}
            </button>
            {isOpen && (
              <p className="text-ink/80 leading-relaxed pb-5 whitespace-pre-line">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}