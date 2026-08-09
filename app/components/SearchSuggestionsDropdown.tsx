"use client";

import { Search, Clock, X } from "lucide-react";
import { matchBreeds } from "@/lib/breedSearch";

export default function SearchSuggestionsDropdown({
  query,
  history,
  onSelect,
  onClearHistory,
}: {
  query: string;
  history: string[];
  onSelect: (term: string) => void;
  onClearHistory?: () => void;
}) {
  const suggestions = matchBreeds(query);
  const showHistory = query.trim().length === 0 && history.length > 0;

  if (suggestions.length === 0 && !showHistory) return null;

  return (
    <div className="absolute left-0 right-0 mt-2 bg-white border border-sage/20 rounded-lg shadow-lg z-30 py-2 max-h-72 overflow-y-auto">
      {showHistory && (
        <>
          <div className="flex items-center justify-between px-4 py-1.5">
            <p className="text-[11px] uppercase tracking-wider text-sage">Recent searches</p>
            {onClearHistory && (
              <button onClick={onClearHistory} className="text-[11px] text-sage underline">
                Clear
              </button>
            )}
          </div>
          {history.map((term) => (
            <button
              key={term}
              onClick={() => onSelect(term)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ink text-left hover:bg-cream-alt transition-colors"
            >
              <Clock size={14} className="text-sage shrink-0" />
              {term}
            </button>
          ))}
        </>
      )}

      {suggestions.length > 0 && (
        <>
          {showHistory && <div className="border-t border-sage/10 my-1" />}
          <p className="text-[11px] uppercase tracking-wider text-sage px-4 py-1.5">Breeds</p>
          {suggestions.map((s) => (
            <button
              key={s.breed}
              onClick={() => onSelect(s.breed)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ink text-left hover:bg-cream-alt transition-colors"
            >
              <Search size={14} className="text-sage shrink-0" />
              {s.breed}
            </button>
          ))}
        </>
      )}
    </div>
  );
}