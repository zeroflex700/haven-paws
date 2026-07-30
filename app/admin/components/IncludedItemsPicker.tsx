"use client";

import { ALL_INCLUDED_ITEMS, type IncludedItemKey } from "@/lib/includedItems";

export default function IncludedItemsPicker({
  selected,
}: {
  selected: IncludedItemKey[];
}) {
  return (
    <div className="mt-2">
      {ALL_INCLUDED_ITEMS.map((item) => (
        <label key={item.key} className="flex items-center gap-2 py-1.5">
          <input
            type="checkbox"
            name="included_items"
            value={item.key}
            defaultChecked={selected.includes(item.key)}
            className="w-4 h-4"
          />
          <span className="text-sm text-ink/80">{item.label}</span>
        </label>
      ))}
    </div>
  );
}