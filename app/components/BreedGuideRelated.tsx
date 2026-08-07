import Link from "next/link";
import OptimizedImage from "./OptimizedImage";

type RelatedBreed = { id: string; name: string; slug: string; image_url: string | null };

export default function BreedGuideRelated({ breeds }: { breeds: RelatedBreed[] }) {
  if (breeds.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="h2 mb-6">Related Breeds</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
        {breeds.map((b) => (
          <Link key={b.id} href={`/breed-guides/${b.slug}`} className="w-40 shrink-0 snap-start">
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt mb-2">
              <OptimizedImage src={b.image_url} alt={b.name} sizes="160px" />
            </div>
            <p className="text-sm text-forest font-medium">{b.name}</p>
            <p className="text-xs text-forest border-b border-gold pb-0.5 inline-block mt-1">
              Learn about {b.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}