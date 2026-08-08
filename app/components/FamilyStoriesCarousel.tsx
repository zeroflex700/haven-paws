import Link from "next/link";
import { Star } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import type { Review } from "@/lib/queries/testimonials";

export default function FamilyStoriesCarousel({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-cream-alt py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="h2 text-center mb-8">Stories from Haven Paws families</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="w-64 shrink-0 snap-start bg-white rounded-lg border border-sage/20 p-4 interactive-card"
            >
              <div className="flex items-center gap-3 mb-2">
                {r.photoUrl && (
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-cream-alt shrink-0">
                    <OptimizedImage src={r.photoUrl} alt={r.customerName} sizes="36px" />
                  </div>
                )}
                {r.rating && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={11} className="fill-gold text-gold" />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-ink/70 line-clamp-4 mb-2">{r.reviewText}</p>
              <Link href="/reviews" className="text-xs text-forest border-b border-gold pb-0.5">
                Read more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}