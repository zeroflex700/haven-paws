"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { X, GraduationCap, Phone, Users2 } from "lucide-react";
import { Star } from "lucide-react";
import type { Review } from "@/lib/queries/testimonials";
import HavenLogo from "./HavenLogo";

type PopupContextType = { open: () => void };
const PopupContext = createContext<PopupContextType>({ open: () => {} });

export function useTrainingPopup() {
  return useContext(PopupContext);
}

export default function TrainingPopupProvider({
  children,
  intro,
  testimonial,
}: {
  children: React.ReactNode;
  intro: string;
  testimonial: Review | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  function open() {
    setIsOpen(true);
  }

  function handleGetStarted() {
    setIsOpen(false);
    router.push("/puppy-training/access");
  }

  return (
    <PopupContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[80] bg-forest/60 backdrop-blur-sm flex items-center justify-center px-6 overflow-y-auto py-10">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 text-sage"
            >
              <X size={18} />
            </button>

            <div className="flex justify-center mb-4">
              <HavenLogo size={40} />
            </div>

            <h2 className="font-display text-xl text-forest text-center mb-3">
              Puppy Training Program, brought to you by Haven Paws
            </h2>
            <p className="text-sm text-ink/70 text-center mb-5">{intro}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-ink/80">
                <GraduationCap size={18} className="text-gold" strokeWidth={1.5} />
                Online Classes
              </div>
              <div className="flex items-center gap-3 text-sm text-ink/80">
                <Phone size={18} className="text-gold" strokeWidth={1.5} />
                Weekly Coaching Calls
              </div>
              <div className="flex items-center gap-3 text-sm text-ink/80">
                <Users2 size={18} className="text-gold" strokeWidth={1.5} />
                Private Community Group
              </div>
            </div>

            <button
              onClick={handleGetStarted}
              className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light transition-colors"
            >
              Get Started
            </button>

            {testimonial && (
              <div className="mt-6 pt-5 border-t border-sage/20">
                {testimonial.rating && (
                  <div className="flex gap-0.5 mb-2 justify-center">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-gold text-gold" />
                    ))}
                  </div>
                )}
                <p className="text-sm text-ink/70 italic text-center mb-2">
                  &quot;{testimonial.reviewText}&quot;
                </p>
                <p className="text-xs text-sage text-center">
                  {testimonial.customerName} — Puppy Training Program student
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
}