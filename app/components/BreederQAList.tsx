"use client";

import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";
import type { BreederQA } from "@/lib/queries/breeders";

function AnswerRow({ answer }: { answer: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = answer.length > 220;

  return (
    <div>
      <p className={`text-sm text-ink/80 leading-relaxed ${!expanded && isLong ? "line-clamp-4" : ""}`}>
        {answer}
      </p>
      {isLong && (
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-forest underline mt-1">
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

export default function BreederQAList({ breederName, items }: { breederName: string; items: BreederQA[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircleQuestion size={18} className="text-gold" strokeWidth={1.5} />
        <h2 className="h2">Q. &amp; A. with {breederName}</h2>
      </div>
      <div className="space-y-5">
        {items.map((qa) => (
          <div key={qa.id}>
            <p className="text-sm font-medium text-forest mb-1">{qa.question}</p>
            <AnswerRow answer={qa.answer} />
          </div>
        ))}
      </div>
    </section>
  );
}