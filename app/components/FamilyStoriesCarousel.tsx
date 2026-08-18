import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import type { Review } from "@/lib/queries/testimonials";

export default function FamilyStoriesCarousel({
  reviews,
}: {
  reviews: Review[];
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="hp-section hp-section-peach py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-9">
          <div>
            <p className="eyebrow mb-2">Real Families</p>

            <h2 className="h2">
              Stories from Haven Paws families
            </h2>
          </div>

          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-sm text-forest font-medium"
          >
            Read all stories
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-3 -mx-6 px-6 snap-x no-scrollbar">
          {reviews.map((r, index) => (
            <div
              key={r.id}
              className={`w-72 shrink-0 snap-start rounded-[24px] p-5 interactive-card ${
                index % 3 === 0
                  ? "bg-white"
                  : index % 3 === 1
                  ? "bg-yellow"
                  : "bg-sky"
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  {r.photoUrl && (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white shrink-0 ring-2 ring-white">
                      <OptimizedImage
                        src={r.photoUrl}
                        alt={r.customerName}
                        sizes="40px"
                      />
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-forest">
                      {r.customerName}
                    </p>
                    <p className="text-[10px] text-sage">
                      Haven Paws family
                    </p>
                  </div>
                </div>

                {r.rating && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className="fill-gold text-gold"
                      />
                    ))}
                  </div>
                )}
              </div>

              <p className="text-sm text-ink/75 leading-relaxed line-clamp-5 mb-5">
                {r.reviewText}
              </p>

              <Link
                href="/reviews"
                className="inline-flex items-center gap-1 text-xs text-forest font-medium"
              >
                Read more
                <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}