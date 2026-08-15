import Link from "next/link";
import { BadgeCheck, ChevronRight, ShieldCheck } from "lucide-react";
import { cldOptimized } from "@/lib/cloudinary";

export default function BreederAttributionCard({
  puppyName,
  breederName,
  breederSlug,
  breederPhotoUrl,
}: {
  puppyName: string;
  breederName: string | null;
  breederSlug: string | null;
  breederPhotoUrl: string | null;
}) {
  if (!breederSlug) return null;

  return (
    <section
      aria-label={`Meet ${puppyName}'s breeder`}
      className="mb-6"
    >
      <Link
        href={`/breeders/${breederSlug}`}
        className="group block border border-sage/20 rounded-xl p-4 hover:border-gold transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-cream-alt shrink-0">
            {breederPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cldOptimized(breederPhotoUrl, 120)}
                alt={breederName ?? "Breeder"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShieldCheck
                  size={22}
                  className="text-gold"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider text-sage mb-0.5">
              Meet {puppyName}&apos;s breeder
            </p>

            <p className="text-sm text-forest font-medium truncate">
              {breederName ?? "Meet the breeder"}
            </p>

            <div className="flex items-center gap-1 mt-1">
              <BadgeCheck
                size={13}
                className="text-gold shrink-0"
                strokeWidth={1.5}
              />

              <span className="text-xs text-ink/60">
                Reviewed and approved by Haven Paws
              </span>
            </div>
          </div>

          <ChevronRight
            size={18}
            className="text-sage shrink-0 group-hover:text-gold transition-colors"
          />
        </div>

        <div className="mt-3 pt-3 border-t border-sage/10">
          <span className="text-xs text-forest font-medium">
            View breeder profile →
          </span>
        </div>
      </Link>
    </section>
  );
}