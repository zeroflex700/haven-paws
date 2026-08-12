import Link from "next/link";
import { Star } from "lucide-react";

export default function ReviewsTrustSummary({
  avgRating,
  reviewCount,
}: {
  avgRating: number | null;
  reviewCount: number;
}) {
  if (!avgRating || reviewCount === 0) return null;

  return (
    <Link
      href="/reviews"
      className="flex items-center gap-2 text-sm text-ink/80 hover:text-forest mb-4"
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < Math.round(avgRating) ? "fill-gold text-gold" : "text-sage/40"}
          />
        ))}
      </div>
      <span>
        {avgRating} · {reviewCount} verified review{reviewCount !== 1 ? "s" : ""}
      </span>
    </Link>
  );
}