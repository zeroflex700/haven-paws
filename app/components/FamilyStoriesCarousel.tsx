import Link from "next/link";
import { Star } from "lucide-react";
import { cldOptimized } from "@/lib/cloudinary";
import type { Review } from "@/lib/queries/testimonials";

export default function FamilyStoriesCarousel({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-cream-alt py-14">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-display text-2xl text-forest text-center mb-8">
          Stories from Haven Paws families
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
          {reviews.map((r) => (
            <div key={r.id} className="w-64 shrink-0 snap-start bg-white rounded-lg border border-sage/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                {r.photoUrl && (
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-cream-alt shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cldOptimized(r.photoUrl, 100)}
                      alt={r.customerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm text-forest font-medium">{r.customerName}</p>
                  {r.rating && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={11} className="fill-gold text-gold" />
                      ))}
                    </div>
                  )}
                </div>
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