import Link from "next/link";
import { cldOptimized } from "@/lib/cloudinary";
import type { Sibling } from "@/lib/queries/siblings";

const statusColor: Record<string, string> = {
  available: "bg-gold text-forest",
  reserved: "bg-sage text-cream",
  sold: "border border-ink/40 text-ink/60",
};

export default function PuppySiblings({
  puppyName,
  siblings,
}: {
  puppyName: string;
  siblings: Sibling[];
}) {
  if (siblings.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <p className="eyebrow mb-3">Litter</p>
      <h2 className="font-display text-2xl text-forest mb-6">
        {puppyName}&apos;s Siblings
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {siblings.map((s) => (
          <Link key={s.id} href={`/puppies/${s.id}`} className="block relative">
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt">
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cldOptimized(s.image, 400)}
                  alt={s.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sage text-xs">
                  Photo
                </div>
              )}
            </div>
            <span
              className={`absolute top-2 right-2 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColor[s.status]}`}
            >
              {s.status}
            </span>
            <p className="text-forest font-medium mt-2 text-sm">{s.name}</p>
            <p className="text-xs text-sage capitalize">{s.sex}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}