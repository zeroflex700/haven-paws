import { MapPin } from "lucide-react";
import { ProtectedImage } from "./ProtectedMedia";
import type { LocationCard } from "@/lib/queries/homepageCollections";

export default function LocationCardsRow({
  cards,
}: {
  cards: LocationCard[];
}) {
  if (cards.length === 0) return null;

  return (
    <section className="hp-section hp-section-cream py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-9">
          <p className="eyebrow mb-2">Across the Country</p>

          <h2 className="font-display text-3xl text-forest">
            Explore trusted breeders near you
          </h2>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-3 -mx-6 px-6 snap-x no-scrollbar">
          {cards.map((c, index) => (
            <div
              key={c.id}
              className="w-48 shrink-0 snap-start group"
            >
              <div
                className={`aspect-square rounded-[24px] overflow-hidden mb-3 p-1 ${
                  index % 3 === 0
                    ? "bg-blue"
                    : index % 3 === 1
                    ? "bg-peach"
                    : "bg-yellow"
                }`}
              >
                <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-white">
                  {c.imageUrl && (
                    <ProtectedImage
                      src={c.imageUrl}
                      alt={c.cityName}
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-[11px] text-forest font-medium shadow-sm">
                      <MapPin size={12} />
                      {c.cityName}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-forest font-semibold text-sm text-center">
                {c.cityName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}