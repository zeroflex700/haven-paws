"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

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
    <div className="relative">
      <div className="absolute -inset-5 rounded-[32px] bg-white/40 blur-2xl" />

      <div className="relative bg-white rounded-[28px] border border-forest/10 p-5 max-w-sm mx-auto shadow-xl shadow-forest/10">
        <div className="flex items-center gap-3 border-b border-forest/10 pb-4 mb-5">
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center">
            <Sparkles size={16} className="text-forest" />
          </div>

          <div>
            <p className="text-sm font-semibold text-forest">
              Haven Paws Support
            </p>
            <p className="text-[11px] text-sage">Here for the journey</p>
          </div>
        </div>

        <div className="flex justify-start mb-3">
          <div className="bg-cream-alt rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-ink max-w-[82%]">
            Hi! Just checking in — how&apos;s Willow settling in? 🐾
          </div>
        </div>

        <div className="flex justify-end mb-3">
          <div className="bg-forest text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm max-w-[82%]">
            She&apos;s doing great, already sleeping through the night!
          </div>
        </div>

        <div className="flex justify-start">
          <div className="bg-yellow rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-ink max-w-[82%]">
            So happy to hear that 💛
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="hp-section hp-section-lavender py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow mb-3">A Guided Beginning</p>

          <h2 className="font-display text-3xl sm:text-4xl text-forest leading-tight mb-3">
            Finding your puppy should feel good from the start
          </h2>

          <p className="text-ink/70">
            A guided process, real breeders, and support the whole way through.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-3">
            {STEPS.map((step, i) => {
              const isOpen = open === i;

              return (
                <div
                  key={step.title}
                  className={`rounded-[20px] overflow-hidden border transition-all ${
                    isOpen
                      ? "bg-white border-forest/10 shadow-lg shadow-forest/5"
                      : "bg-white/55 border-forest/10"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-5 text-left"
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-display text-sm ${
                          isOpen
                            ? "bg-gold text-forest"
                            : "bg-forest text-white"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="text-forest font-semibold">
                        {step.title}
                      </span>
                    </span>

                    {isOpen ? (
                      <ChevronUp size={18} className="text-sage" />
                    ) : (
                      <ChevronDown size={18} className="text-sage" />
                    )}
                  </button>

                  {isOpen && (
                    <p className="px-5 pb-5 pl-[68px] text-sm text-ink/70 leading-relaxed">
                      {step.body}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <ChatMockup />
        </div>
      </div>
    </section>
  );
}