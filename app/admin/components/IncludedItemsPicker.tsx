"use client";

import type { IncludedItemKey } from "@/lib/includedItems";
import { ALL_INCLUDED_ITEMS } from "@/lib/includedItems";

export default function IncludedItemsPicker({
  selected,
  onChange,
}: {
  selected: IncludedItemKey[];
  onChange: (next: IncludedItemKey[]) => void;
}) {
  function toggle(key: IncludedItemKey) {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  }

  return (
    <div className="space-y-3 mt-3">
      {ALL_INCLUDED_ITEMS.map((item) => {
        const checked = selected.includes(item.key);

        return (
          <label
            key={item.key}
            className="flex items-center gap-3 rounded-md border border-sage/20 px-4 py-3 cursor-pointer hover:bg-sage/5"
          >
            <input
              type="checkbox"
              name="included_items"
              value={item.key}
              checked={checked}
              onChange={() => toggle(item.key)}
              className="w-4 h-4"
            />

            <span className="text-sm text-ink/80">{item.label}</span>
          </label>
        );
      })}
    </div>
  );
}