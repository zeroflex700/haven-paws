"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const STEPS = [
  {
    title: "Tell us what you're looking for",
    body: "Share your ideal breed, size, and lifestyle, and we'll help narrow down puppies that fit.",
  },
  {
    title: "Meet your breeder",
    body: "Connect directly with a screened, responsible breeder before you commit — ask questions, request photos, get to know your puppy.",
  },
  {
    title: "Bring your puppy home",
    body: "Choose the delivery option that works for you, and our team stays with you through every step of the journey.",
  },
];

function ChatMockup() {
  return (
    <div className="bg-white rounded-2xl border border-sage/20 p-4 max-w-xs mx-auto">
      <div className="flex justify-start mb-3">
        <div className="bg-cream-alt rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-ink max-w-[80%]">
          Hi! Just checking in — how&apos;s Willow settling in? 🐾
        </div>
      </div>
      <div className="flex justify-end mb-3">
        <div className="bg-forest text-cream rounded-2xl rounded-br-sm px-4 py-2 text-sm max-w-[80%]">
          She&apos;s doing great, already sleeping through the night!
        </div>
      </div>
      <div className="flex justify-start">
        <div className="bg-cream-alt rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-ink max-w-[80%]">
          So happy to hear that 💛
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <h2 className="font-display text-2xl text-forest text-center mb-2">
        Finding your puppy should feel good from the start
      </h2>
      <p className="text-ink/70 text-center mb-10">
        A guided process, real breeders, and support the whole way through.
      </p>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isOpen = open === i;
            return (
              <div key={step.title} className="border border-sage/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left bg-white"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-gold font-display text-lg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-forest font-medium">{step.title}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-sage" />
                  ) : (
                    <ChevronDown size={18} className="text-sage" />
                  )}
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm text-ink/70 leading-relaxed">{step.body}</p>
                )}
              </div>
            );
          })}
        </div>

        <ChatMockup />
      </div>
    </section>
  );
}