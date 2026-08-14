import Link from "next/link";
import OptimizedImage from "./OptimizedImage";
import type { RelatedPuppy } from "@/lib/queries/relatedPuppies";

const statusColor: Record<string, string> = {
  available: "bg-gold text-forest",
  reserved: "bg-sage text-cream",
  sold: "border border-ink/40 text-ink/60",
};

export default function RelatedPuppies({
  puppies,
  breedName,
  eyebrow = "You Might Also Love",
  title,
}: {
  puppies: RelatedPuppy[];
  breedName: string;
  eyebrow?: string;
  title?: string;
}) {
  if (puppies.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="h2 mb-6">{title ?? `Other ${breedName} Puppies`}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
        {puppies.map((p) => (
          <Link key={p.id} href={`/puppies/${p.id}`} className="block w-40 shrink-0 snap-start group">
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt relative transition-shadow duration-200 group-hover:shadow-md group-active:scale-[0.98] transition-transform">
              <OptimizedImage
                src={p.image}
                alt={p.name}
                sizes="160px"
                className="transition-transform duration-500 group-hover:scale-105"
              />
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
            <p className="text-sm text-ink font-medium mt-1">${p.price.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}