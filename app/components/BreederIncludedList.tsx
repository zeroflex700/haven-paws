"use client";

import { useState } from "react";
import { CATEGORY_META, CATEGORY_ORDER, ICON_MAP, type IconKey } from "@/lib/breederIcons";
import { getCategoryColor } from "@/lib/categoryColors";
import type { BreederIncludedItem } from "@/lib/queries/breeders";

function CategoryBlock({
  category,
  items,
  colorIndex,
}: {
  category: string;
  items: BreederIncludedItem[];
  colorIndex: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[category];
  const Icon = ICON_MAP[meta.icon as IconKey];
  const visible = expanded ? items : items.slice(0, 6);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-7 h-7 rounded-full flex items-center justify-center ${getCategoryColor(colorIndex)}`}>
          <Icon size={14} strokeWidth={1.5} />
        </span>
        <p className="text-sm font-medium text-forest">{meta.label}</p>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {visible.map((item) => (
          <li key={item.id} className="text-sm text-ink/70">
            {item.label}
          </li>
        ))}
      </ul>
      {items.length > 6 && (
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-forest underline mt-2">
          {expanded ? "See less" : `See ${items.length - 6} more`}
        </button>
      )}
    </div>
  );
}

export default function BreederIncludedList({ items }: { items: BreederIncludedItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="h2 mb-5">What&apos;s included</h2>
      {CATEGORY_ORDER.map((cat, i) => {
        const catItems = items.filter((it) => it.category === cat);
        if (catItems.length === 0) return null;
        return <CategoryBlock key={cat} category={cat} items={catItems} colorIndex={i} />;
      })}
    </section>
  );
}