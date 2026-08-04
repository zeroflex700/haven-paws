"use client";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "appearance", label: "Appearance & Grooming" },
  { id: "temperament", label: "Temperament & Characteristics" },
  { id: "health", label: "Health" },
  { id: "history", label: "History" },
  { id: "faqs", label: "FAQs" },
];

export default function BreedGuideTabs() {
  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="sticky top-[64px] z-30 bg-cream/95 backdrop-blur border-b border-sage/20">
      <div className="flex gap-6 overflow-x-auto px-6 py-3 max-w-3xl mx-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => jumpTo(tab.id)}
            className="text-sm text-ink/70 hover:text-forest whitespace-nowrap shrink-0"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}