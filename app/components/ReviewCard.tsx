import { Star, BadgeCheck } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import type { Review } from "@/lib/queries/testimonials";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white border border-sage/20 rounded-lg p-5">
      {review.rating && (
        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} size={16} className="fill-gold text-gold" />
          ))}
        </div>
      )}
      <p className="text-ink/80 leading-relaxed mb-3 whitespace-pre-line">{review.reviewText}</p>

      {review.photoUrl && (
        <div className="w-24 h-24 rounded-lg overflow-hidden mb-3">
          <OptimizedImage src={review.photoUrl} alt="" sizes="96px" />
        </div>
      )}

      {review.videoUrl && (
        <video src={review.videoUrl} controls className="w-full rounded-lg mb-3" />
      )}

      <div className="flex items-center gap-1.5">
        {review.verified && <BadgeCheck size={14} className="text-gold" />}
        <p className="text-sm text-ink/70">
          {review.customerName}
          {review.location ? ` · ${review.location}` : ""}
        </p>
      </div>
    </div>
  );
}