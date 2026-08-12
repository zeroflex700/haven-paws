"use client";

import { useTransition } from "react";
import { updateInquiryStatus } from "../inquiries/actions";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-gold/15 text-forest",
  contacted: "bg-blue-50 text-blue-700",
  closed: "bg-cream-alt text-ink/50",
};

export default function InquiryStatusSelect({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateInquiryStatus(id, e.target.value))}
      className={`text-[11px] uppercase tracking-wider px-2 py-1 rounded-full border-0 ${
        STATUS_STYLES[status] ?? "bg-cream-alt text-ink"
      }`}
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="closed">Closed</option>
    </select>
  );
}