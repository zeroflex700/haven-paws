"use client";

import { useState } from "react";
import { Plus, Minus, Check } from "lucide-react";
import { cldOptimized } from "@/lib/cloudinary";

type StandardItem = {
  title: string;
  image: string | null;
  checklist: string[];
};

export default function StandardsAccordion({ items }: { items: StandardItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.title}
            className={`rounded-lg border overflow-hidden ${
              isOpen ? "border-gold" : "border-sage/20"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className={`w-full flex items-center justify-between px-5 py-4 text-left ${
                isOpen ? "bg-gold/20" : "bg-white"
              }`}
            >
              <span className="font-display text-lg text-forest">{item.title}</span>
              {isOpen ? <Minus size={18} className="text-sage" /> : <Plus size={18} className="text-sage" />}
            </button>
            {isOpen && (
              <div className="bg-white px-5 pb-5">
                {item.image && (
                  <div className="aspect-video rounded-lg overflow-hidden mb-4 mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cldOptimized(item.image, 700)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <ul className="space-y-2">
                  {item.checklist.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-ink/80">
                      <Check size={16} className="text-gold shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}