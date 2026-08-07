"use client";

import { useEffect, useRef } from "react";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";

export type SectionTab = { id: string; label: string };

export default function SectionTabs({
  sections,
  topOffset = 57,
}: {
  sections: SectionTab[];
  topOffset?: number;
}) {
  const activeId = useScrollSpy(sections.map((s) => s.id));
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const underlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tab = tabRefs.current[activeId];
    const container = scrollRef.current;
    const underline = underlineRef.current;
    if (!tab || !container || !underline) return;

    const tabRect = tab.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const left = tabRect.left - containerRect.left + container.scrollLeft;

    underline.style.width = `${tabRect.width}px`;
    underline.style.transform = `translateX(${left}px)`;

    const targetScroll = left - container.clientWidth / 2 + tabRect.width / 2;
    container.scrollTo({ left: Math.max(0, targetScroll), behavior: "smooth" });
  }, [activeId]);

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (sections.length === 0) return null;

  return (
    <div
      className="sticky z-30 bg-cream/95 backdrop-blur border-b border-sage/20"
      style={{ top: topOffset }}
    >
      <nav aria-label="Section navigation">
        <div
          ref={scrollRef}
          className="relative flex gap-6 overflow-x-auto px-6 py-3 max-w-3xl mx-auto no-scrollbar"
        >
          {sections.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[s.id] = el;
                }}
                onClick={() => jumpTo(s.id)}
                aria-current={isActive ? "true" : undefined}
                className={`shrink-0 text-sm whitespace-nowrap pb-1 transition-all duration-200 ${
                  isActive ? "text-forest font-medium" : "text-ink/60 hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            );
          })}
          <div
            ref={underlineRef}
            className="absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300 ease-out"
            style={{ width: 0 }}
          />
        </div>
      </nav>
    </div>
  );
}