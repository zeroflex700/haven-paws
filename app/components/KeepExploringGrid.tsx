import Link from "next/link";
import { ArrowRight } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import { getCategoryColor } from "@/lib/categoryColors";
import type { ExploringCard } from "@/lib/queries/homepageCollections";

type Breed = {
  id: string;
  name: string;
  image_url: string | null;
};

export default function KeepExploringGrid({
  cards,
  breeds,
}: {
  cards: ExploringCard[];
  breeds: Breed[];
}) {
  return (
    <section className="hp-section hp-section-cream py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
          <div>
            <p className="eyebrow mb-2">Discover More</p>
            <h2 className="h2">Keep exploring</h2>
          </div>

          <Link
            href="/faqs"
            className="inline-flex items-center gap-2 text-sm text-forest font-medium"
          >
            Learning Center — View all
            <ArrowRight size={15} />
          </Link>
        </div>

        {cards.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {cards.map((c, i) => (
              <Link
                key={c.id}
                href={c.linkHref}
                className="group tap-feedback"
              >
                <div
                  className={`aspect-square rounded-[24px] overflow-hidden mb-3 p-1 ${getCategoryColor(
                    i
                  )}`}
                >
                  <div className="w-full h-full rounded-[20px] overflow-hidden bg-white">
                    <OptimizedImage
                      src={c.imageUrl}
                      alt={c.caption}
                      sizes="(max-width: 768px) 50vw, 240px"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 px-1">
                  <p className="text-xs sm:text-sm text-ink/75">
                    {c.caption}
                  </p>

                  <ArrowRight
                    size={13}
                    className="text-forest opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="rounded-[28px] bg-blue p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="h3 mb-1">Learn about popular breeds</h3>

            <p className="small-text">
              Get to know the temperaments and traits behind our most-loved
              breeds.
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x no-scrollbar">
            {breeds.slice(0, 8).map((b) => (
              <Link
                key={b.id}
                href={`/puppies?breed=${encodeURIComponent(b.name)}`}
                className="w-32 shrink-0 snap-start group"
              >
                <div className="aspect-square rounded-[20px] overflow-hidden bg-white mb-2">
                  <OptimizedImage
                    src={b.image_url}
                    alt={b.name}
                    sizes="128px"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <p className="text-sm text-forest font-semibold text-center">
                  {b.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}