import { Star } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import type { Review } from "@/lib/queries/testimonials";

export default function Testimonials({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-cream-alt py-16">
      <div className="max-w-5xl mx-auto px-6">
        <p className="eyebrow mb-3">Families Who Found Their Puppy</p>
        <h2 className="h2 mb-8">What families are saying</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-lg border border-sage/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                {r.photoUrl && (
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-cream-alt shrink-0">
                    <OptimizedImage src={r.photoUrl} alt={r.customerName} sizes="36px" />
                  </div>
                )}
                {r.rating && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-gold text-gold" />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-ink/80 mb-3 leading-relaxed">{r.reviewText}</p>
              <p className="text-xs text-sage">
                {r.customerName}
                {r.location ? ` · ${r.location}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}