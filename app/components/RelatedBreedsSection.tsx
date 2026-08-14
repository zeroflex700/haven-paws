import Link from "next/link";
import OptimizedImage from "./OptimizedImage";

type RelatedBreed = { id: string; name: string; image_url: string | null };

export default function RelatedBreedsSection({ breeds }: { breeds: RelatedBreed[] }) {
  if (breeds.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <p className="eyebrow mb-3">Explore More</p>
      <h2 className="h2 mb-6">Related Breeds You Might Like</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
        {breeds.map((b) => (
          <Link key={b.id} href={`/puppies?breed=${encodeURIComponent(b.name)}`} className="w-36 shrink-0 snap-start">
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt mb-2">
              <OptimizedImage src={b.image_url} alt={b.name} sizes="144px" />
            </div>
            <p className="text-sm text-forest font-medium text-center">{b.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}