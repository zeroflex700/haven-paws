import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";

export default function BreederAttributionCard({
  puppyName,
  breederName,
  breederSlug,
}: {
  puppyName: string;
  breederName: string | null;
  breederSlug: string | null;
}) {
  if (!breederSlug) return null;

  return (
    <Link
      href={`/breeders/${breederSlug}`}
      className="flex items-center justify-between gap-3 border border-sage/20 rounded-lg px-4 py-3 mb-6 hover:border-gold transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0">
        <ShieldCheck size={16} className="text-gold shrink-0" strokeWidth={1.5} />
        <div className="min-w-0">
          <p className="text-sm text-forest font-medium truncate">
            Meet {puppyName}&apos;s breeder
          </p>
          {breederName && <p className="text-xs text-sage truncate">{breederName}</p>}
        </div>
      </div>
      <ChevronRight size={16} className="text-sage shrink-0" />
    </Link>
  );
}