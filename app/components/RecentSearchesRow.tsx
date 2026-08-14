"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { useSearchHistory } from "@/lib/hooks/useSearchHistory";

export default function RecentSearchesRow() {
  const { terms } = useSearchHistory();
  if (terms.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-2">
      <div className="flex items-center gap-2 mb-2">
        <Clock size={14} className="text-sage" />
        <p className="text-xs text-sage">Recently searched</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {terms.slice(0, 6).map((t) => (
          <Link
            key={t}
            href={`/puppies?search=${encodeURIComponent(t)}`}
            className="text-xs bg-white border border-sage/20 text-ink px-3 py-1.5 rounded-full tap-feedback"
          >
            {t}
          </Link>
        ))}
      </div>
    </div>
  );
}