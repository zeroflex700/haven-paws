"use client";

import { useState } from "react";
import { X, Bookmark, BookmarkPlus } from "lucide-react";
import { useSavedSearches } from "@/lib/hooks/useSavedSearches";
import type { Filters } from "./PuppyFilters";

function hasActiveFilters(filters: Filters) {
  return (
    filters.search.trim() !== "" ||
    filters.breed !== "all" ||
    filters.sex !== "all" ||
    filters.readyNow ||
    filters.sort !== "none"
  );
}

export default function SavedSearchesBar({
  filters,
  onApply,
}: {
  filters: Filters;
  onApply: (f: Filters) => void;
}) {
  const { searches, isLoggedIn, save, remove } = useSavedSearches();
  const [naming, setNaming] = useState(false);
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isLoggedIn) return null;

  async function handleSave() {
    if (!label.trim()) return;
    setSaving(true);
    const ok = await save(label.trim(), filters);
    setSaving(false);
    if (ok) {
      setNaming(false);
      setLabel("");
    }
  }

  return (
    <div className="mb-4">
      {searches.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {searches.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-1.5 bg-white border border-sage/30 text-ink text-xs pl-3 pr-2 py-1.5 rounded-full"
            >
              <button onClick={() => onApply(s.filters)} className="flex items-center gap-1.5">
                <Bookmark size={12} className="text-gold" />
                {s.label}
              </button>
              <button
                onClick={() => remove(s.id)}
                aria-label={`Remove saved search ${s.label}`}
                className="text-sage hover:text-ink"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {hasActiveFilters(filters) && (
        <>
          {!naming ? (
            <button
              onClick={() => setNaming(true)}
              className="flex items-center gap-1.5 text-xs text-forest underline"
            >
              <BookmarkPlus size={13} />
              Save this search
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Name this search"
                autoFocus
                className="border border-sage/30 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:border-gold"
              />
              <button
                onClick={handleSave}
                disabled={saving || !label.trim()}
                className="text-xs bg-forest text-cream px-3 py-1.5 rounded-full disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setNaming(false)} className="text-xs text-sage">
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}