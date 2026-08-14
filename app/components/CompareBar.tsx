"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCompare } from "@/lib/hooks/useCompare";

export default function CompareBar() {
  const { compareIds, clear, maxCompare, maxReached } = useCompare();
  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-forest text-cream px-5 py-3 flex items-center justify-between">
      <span className="text-sm">
        {compareIds.length} of {maxCompare} selected
        {maxReached ? " — remove one to add another" : ""}
      </span>
      <div className="flex items-center gap-3">
        {compareIds.length >= 2 && (
          <Link
            href={`/compare?ids=${compareIds.join(",")}`}
            className="bg-gold text-forest text-sm px-4 py-2 rounded-full font-medium"
          >
            Compare
          </Link>
        )}
        <button onClick={clear} aria-label="Clear comparison" className="active:scale-90 transition-transform">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}