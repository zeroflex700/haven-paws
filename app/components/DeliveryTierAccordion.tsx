"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { ProtectedImage } from "./ProtectedMedia";

type Tier = {
  title: string;
  price: string;
  summary: string;
  image: string | null;
  body: string;
  checklist?: string[];
};

export default function DeliveryTierAccordion({ tiers }: { tiers: Tier[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {tiers.map((tier, i) => {
        const isOpen = open === i;
        return (
          <div
            key={tier.title}
            className={`rounded-lg border overflow-hidden ${isOpen ? "border-gold" : "border-sage/20"}`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className={`w-full flex items-center justify-between px-5 py-4 text-left ${
                isOpen ? "bg-gold/10" : "bg-white"
              }`}
            >
              <div>
                <p className="font-display text-lg text-forest">{tier.title}</p>
                <p className="text-sm text-sage">{tier.summary}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-forest font-medium">{tier.price}</span>
                {isOpen ? <Minus size={18} className="text-sage" /> : <Plus size={18} className="text-sage" />}
              </div>
            </button>
            {isOpen && (
              <div className="bg-white px-5 pb-5">
                {tier.image && (
                  <div className="aspect-video rounded-lg overflow-hidden mb-4 mt-1">
                    <ProtectedImage src={tier.image} alt={tier.title} />
                  </div>
                )}
                <p className="text-ink/80 leading-relaxed whitespace-pre-line mb-3">{tier.body}</p>
                {tier.checklist && (
                  <ul className="list-disc pl-5 text-sm text-ink/80 space-y-1">
                    {tier.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}