import Link from "next/link";
import { cldOptimized } from "@/lib/cloudinary";
import type { RelatedPuppy } from "@/lib/queries/relatedPuppies";

const statusColor: Record<string, string> = {
  available: "bg-gold text-forest",
  reserved: "bg-sage text-cream",
  sold: "border border-ink/40 text-ink/60",
};

export default function RelatedPuppies({
  puppies,
  breedName,
}: {
  puppies: RelatedPuppy[];
  breedName: string;
}) {
  if (puppies.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <p className="eyebrow mb-3">You Might Also Love</p>
      <h2 className="font-display text-2xl text-forest mb-6">
        Other {breedName} Puppies
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
        {puppies.map((p) => (
          <Link
            key={p.id}
            href={`/puppies/${p.id}`}
            className="block w-40 shrink-0 snap-start"
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt relative">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cldOptimized(p.image, 400)}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sage text-xs">
                  Photo
                </div>
              )}
              <span
                className={`absolute top-2 right-2 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColor[p.status]}`}
              >
                {p.status}
              </span>
            </div>
            <p className="text-forest font-medium mt-2 text-sm">{p.name}</p>
            <p className="text-xs text-sage">{p.breed}</p>
            <p className="text-xs text-ink/60 capitalize">
              {p.sex}
              {p.ageWeeks !== null ? ` · ${p.ageWeeks} weeks` : ""}
            </p>
            <p className="text-sm text-ink font-medium mt-1">
              ${p.price.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}