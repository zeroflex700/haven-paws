import Link from "next/link";
import OptimizedImage from "./OptimizedImage";
import type { BreedInfo } from "@/lib/queries/breedInfo";

export default function BreedGuideCard({
  breed,
}: {
  breed: BreedInfo | null;
}) {
  if (!breed || !breed.guideUrl) return null;

  return (
    <section className="border border-sage/20 rounded-lg overflow-hidden mb-6">
      {breed.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <OptimizedImage
            src={breed.imageUrl}
            alt={`${breed.name} breed guide`}
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>
      )}

      <div className="p-4">
        <p className="eyebrow mb-2">Breed Guide</p>

        <h3 className="font-display text-xl text-forest mb-2">
          {breed.name} Breed Guide
        </h3>

        {breed.blurb && (
          <p className="text-sm text-ink/75 leading-relaxed mb-4">
            {breed.blurb}
          </p>
        )}

        <Link
          href={breed.guideUrl}
          className="inline-block text-sm text-forest border-b border-gold pb-0.5"
        >
          View the {breed.name} Breed Guide →
        </Link>
      </div>
    </section>
  );
}