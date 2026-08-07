"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

export type StandardItem = {
  title: string;
  checklist: string[];
  image?: string | null;
};

export default function StandardsAccordion({ items }: { items: StandardItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.title}
            className={`rounded-lg border overflow-hidden transition-colors duration-200 ${
              isOpen ? "border-gold" : "border-sage/20"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200 ${
                isOpen ? "bg-gold/10" : "bg-white"
              }`}
            >
              <span className="text-forest font-medium text-sm">{item.title}</span>
              <ChevronDown
                size={16}
                className={`text-sage transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="bg-white px-5 pb-5">
                  {item.image && (
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 mt-1">
                      <OptimizedImage src={item.image} alt={item.title} sizes="(max-width: 768px) 100vw, 700px" />
                    </div>
                  )}
                  <ul className="space-y-2">
                    {item.checklist.map((point) => (
                      <li key={point} className="text-sm text-ink/70 flex gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}