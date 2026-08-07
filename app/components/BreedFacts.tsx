import Link from "next/link";
import OptimizedImage from "./OptimizedImage";
import type { BreedInfo } from "@/lib/queries/breedInfo";

export default function BreedFacts({ breed }: { breed: BreedInfo | null }) {
  if (!breed || (!breed.temperament && !breed.blurb)) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 pb-16">
      {breed.imageUrl && (
        <div className="aspect-video rounded-lg overflow-hidden mb-6">
          <OptimizedImage src={breed.imageUrl} alt={breed.name} sizes="(max-width: 768px) 100vw, 700px" />
        </div>
      )}

      <p className="eyebrow mb-3">About the Breed</p>
      <h2 className="h2 mb-4">Quick facts about {breed.name}s</h2>

      {breed.blurb && <p className="body-text mb-6">{breed.blurb}</p>}

      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        {breed.temperament && (
          <div>
            <p className="text-sage text-xs uppercase tracking-wider mb-1">Temperament</p>
            <p className="text-ink">{breed.temperament}</p>
          </div>
        )}
        {breed.energyLevel && (
          <div>
            <p className="text-sage text-xs uppercase tracking-wider mb-1">Energy</p>
            <p className="text-ink">{breed.energyLevel}</p>
          </div>
        )}
        {breed.breedGroup && (
          <div>
            <p className="text-sage text-xs uppercase tracking-wider mb-1">Breed Group</p>
            <p className="text-ink">{breed.breedGroup}</p>
          </div>
        )}
      </div>

      {breed.slug && (
        <Link href={`/breed-guides/${breed.slug}`} className="inline-block text-forest border-b border-gold pb-0.5">
          View Full Breed Guide →
        </Link>
      )}
    </section>
  );
}