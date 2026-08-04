import Link from "next/link";
import { cldOptimized } from "@/lib/cloudinary";

type RelatedBreed = { id: string; name: string; slug: string; image_url: string | null };

export default function BreedGuideRelated({ breeds }: { breeds: RelatedBreed[] }) {
  if (breeds.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="font-display text-2xl text-forest mb-6">Related Breeds</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
        {breeds.map((b) => (
          <Link key={b.id} href={`/breed-guides/${b.slug}`} className="w-40 shrink-0 snap-start">
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt mb-2">
              {b.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cldOptimized(b.image_url, 300)} alt={b.name} className="w-full h-full object-cover" />
              ) : null}
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