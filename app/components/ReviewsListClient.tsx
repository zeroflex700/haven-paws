"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard";
import type { Review } from "@/lib/queries/testimonials";

const PER_PAGE = 10;

export default function ReviewsListClient({ reviews }: { reviews: Review[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(reviews.length / PER_PAGE));
  const visible = reviews.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (reviews.length === 0) {
    return <p className="text-sage text-center py-12">No reviews yet — check back soon.</p>;
  }

  return (
    <div>
      <div className="space-y-4">
        {visible.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm border border-sage/30 rounded-full disabled:opacity-30"
          >
            ←
          </button>
          <span className="text-sm text-ink/70">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-sm border border-sage/30 rounded-full disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}