"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ExpandableSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-sage/15 first:border-t-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-3.5 text-left"
      >
        <span className="text-sm font-medium text-forest">{title}</span>
        <ChevronDown size={16} className={`text-sage transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="pb-4 text-sm text-ink/70 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}