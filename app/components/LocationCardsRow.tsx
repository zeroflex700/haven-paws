import { ProtectedImage } from "./ProtectedMedia";
import type { LocationCard } from "@/lib/queries/homepageCollections";

export default function LocationCardsRow({ cards }: { cards: LocationCard[] }) {
  if (cards.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <h2 className="font-display text-2xl text-forest text-center mb-8">
        Explore trusted breeders near you
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
        {cards.map((c) => (
          <div key={c.id} className="w-44 shrink-0 snap-start text-center">
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt mb-2">
              {c.imageUrl && <ProtectedImage src={c.imageUrl} alt={c.cityName} />}
            </div>
            <p className="text-forest font-medium text-sm">{c.cityName}</p>
          </div>
        ))}
      </div>
    </section>
  );
}