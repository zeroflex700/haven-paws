import { ShieldCheck, Star, Lock } from "lucide-react";
import Link from "next/link";

export default function TrustBadgeRow({
  hasBreederProfile,
  avgRating,
  reviewCount,
}: {
  hasBreederProfile: boolean;
  avgRating: number | null;
  reviewCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink/70 mb-4">
      {hasBreederProfile && (
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-gold" strokeWidth={1.5} />
          Vetted Haven Paws breeder
        </span>
      )}
      {avgRating && reviewCount > 0 && (
        <Link href="/reviews" className="flex items-center gap-1.5 hover:text-forest">
          <Star size={13} className="fill-gold text-gold" />
          {avgRating} ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
        </Link>
      )}
      <span className="flex items-center gap-1.5">
        <Lock size={13} className="text-gold" strokeWidth={1.5} />
        Secure checkout
      </span>
    </div>
  );
}