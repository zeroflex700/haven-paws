import Link from "next/link";
import { cldOptimized } from "@/lib/cloudinary";
import type { BreedInfo } from "@/lib/queries/breedInfo";

export default function BreedFacts({ breed }: { breed: BreedInfo | null }) {
  if (!breed || (!breed.temperament && !breed.blurb)) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 pb-16">
      {breed.imageUrl && (
        <div className="aspect-video rounded-lg overflow-hidden mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cldOptimized(breed.imageUrl, 800)}
            alt={breed.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <p className="eyebrow mb-3">About the Breed</p>
      <h2 className="font-display text-2xl text-forest mb-4">
        Quick facts about {breed.name}s
      </h2>

      {breed.blurb && (
        <p className="text-ink/80 leading-relaxed mb-6">{breed.blurb}</p>
      )}

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
        <Link
          href={`/breed-guides/${breed.slug}`}
          className="inline-block text-forest border-b border-gold pb-0.5"
        >
          View Full Breed Guide →
        </Link>
      )}
    </section>
  );
}