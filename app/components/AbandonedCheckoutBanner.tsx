"use client";

import { useState } from "react";
import { X, Clock } from "lucide-react";
import { useCheckoutRecovery } from "@/lib/hooks/useCheckoutRecovery";

export default function AbandonedCheckoutBanner({
  puppyId,
  puppyName,
  onResume,
}: {
  puppyId: string;
  puppyName: string;
  onResume?: () => void;
}) {
  const { draft, clear } = useCheckoutRecovery(puppyId);
  const [dismissed, setDismissed] = useState(false);

  if (!draft || dismissed || !draft.step || draft.step <= 1) return null;

  return (
    <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6 flex items-start gap-3">
      <Clock size={18} className="text-gold shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-forest font-medium">Pick up where you left off</p>
        <p className="text-xs text-ink/70 mt-0.5">
          You started reserving {puppyName} but didn&apos;t finish. Your details are saved.
        </p>
        <button
          onClick={() => {
            if (onResume) onResume();
          }}
          className="text-xs text-forest underline mt-2"
        >
          Continue where you left off
        </button>
      </div>
      <button
        onClick={() => {
          clear();
          setDismissed(true);
        }}
        aria-label="Dismiss"
        className="shrink-0 text-sage"
      >
        <X size={16} />
      </button>
    </div>
  );
}