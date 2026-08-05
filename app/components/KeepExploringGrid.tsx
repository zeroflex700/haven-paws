import Link from "next/link";
import { cldOptimized } from "@/lib/cloudinary";
import { getCategoryColor } from "@/lib/categoryColors";
import type { ExploringCard } from "@/lib/queries/homepageCollections";

type Breed = { id: string; name: string; image_url: string | null };

export default function KeepExploringGrid({
  cards,
  breeds,
}: {
  cards: ExploringCard[];
  breeds: Breed[];
}) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-display text-2xl text-forest">Keep exploring</h2>
        <Link href="/faqs" className="text-sm text-forest border-b border-gold pb-0.5">
          Learning Center — View all
        </Link>
      </div>

      {cards.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-12">
          {cards.map((c, i) => (
            <Link key={c.id} href={c.linkHref} className="text-center">
              <div
                className={`aspect-square rounded-lg overflow-hidden mb-2 flex items-center justify-center ${getCategoryColor(i)}`}
              >
                {c.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cldOptimized(c.imageUrl, 200)}
                    alt={c.caption}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <p className="text-xs text-ink/70">{c.caption}</p>
            </Link>
          ))}
        </div>
      )}

      <h3 className="font-display text-xl text-forest mb-1">Learn about popular breeds</h3>
      <p className="text-ink/70 text-sm mb-6">
        Get to know the temperaments and traits behind our most-loved breeds.
      </p>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
        {breeds.slice(0, 8).map((b) => (
          <Link key={b.id} href={`/puppies?breed=${encodeURIComponent(b.name)}`} className="w-32 shrink-0 snap-start">
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt mb-2">
              {b.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cldOptimized(b.image_url, 250)}
                  alt={b.name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <p className="text-sm text-forest font-medium text-center">{b.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}