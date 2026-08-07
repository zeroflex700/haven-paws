import Link from "next/link";
import OptimizedImage from "./OptimizedImage";
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
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="h2">Keep exploring</h2>
        <Link href="/faqs" className="text-sm text-forest border-b border-gold pb-0.5">
          Learning Center — View all
        </Link>
      </div>

      {cards.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-12">
          {cards.map((c, i) => (
            <Link key={c.id} href={c.linkHref} className="text-center">
              <div className={`aspect-square rounded-lg overflow-hidden mb-2 ${getCategoryColor(i)}`}>
                <OptimizedImage src={c.imageUrl} alt={c.caption} sizes="120px" />
              </div>
              <p className="text-xs text-ink/70">{c.caption}</p>
            </Link>
          ))}
        </div>
      )}

      <h3 className="h3 mb-1">Learn about popular breeds</h3>
      <p className="small-text mb-6">Get to know the temperaments and traits behind our most-loved breeds.</p>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
        {breeds.slice(0, 8).map((b) => (
          <Link key={b.id} href={`/puppies?breed=${encodeURIComponent(b.name)}`} className="w-32 shrink-0 snap-start">
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt mb-2">
              <OptimizedImage src={b.image_url} alt={b.name} sizes="128px" />
            </div>
            <p className="text-sm text-forest font-medium text-center">{b.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}