"use client";

import { useState, useRef } from "react";
import { Scale } from "lucide-react";
import { useCompare } from "@/lib/hooks/useCompare";

export default function CompareToggle({ puppyId, className = "" }: { puppyId: string; className?: string }) {
  const { isComparing, toggle, maxCompare } = useCompare();
  const active = isComparing(puppyId);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const result = toggle(puppyId);
    if (result === "limit-reached") {
      setShowLimitMessage(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowLimitMessage(false), 2200);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        aria-pressed={active}
        aria-label={active ? "Remove from comparison" : "Add to comparison"}
        className={`w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform ${
          active ? "bg-forest text-cream" : "bg-white/90 text-forest"
        } ${className}`}
      >
        <Scale size={13} />
      </button>

      {showLimitMessage && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[160px] bg-forest text-cream text-[10px] leading-tight px-2.5 py-1.5 rounded-lg text-center z-10">
          You can compare up to {maxCompare} puppies — remove one to add another.
        </div>
      )}
    </div>
  );
}