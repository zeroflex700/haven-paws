import LifestyleIcon from "./LifestyleIcon";
import BreedCarousel from "./BreedCarousel";
import { ProtectedImage } from "./ProtectedMedia";
import type { LifestyleCategory } from "../data/lifestyleCategories";

export default function LifestyleCategorySection({
  category,
  heroImage,
  imageMap,
  alt,
}: {
  category: LifestyleCategory;
  heroImage: string | null;
  imageMap: Record<string, string>;
  alt: boolean;
}) {
  return (
    <section
      id={category.key}
      className={`scroll-mt-24 border-b border-sage/10 py-12 md:py-14 ${
        alt ? "bg-cream-alt" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          {/* Category image */}
          {heroImage && (
            <div className="relative w-full max-w-2xl mx-auto aspect-[16/9] rounded-[20px] overflow-hidden mb-7 bg-cream-alt shadow-sm ring-1 ring-black/5">
              <ProtectedImage
                src={heroImage}
                alt={category.title}
              />
            </div>
          )}

          {/* Category introduction */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <LifestyleIcon categoryKey={category.key} />
            </div>

            <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] text-forest mb-3">
              {category.title}
            </h2>

            <div className="mx-auto h-px w-10 bg-gold/70 mb-5" />

            <p className="text-sm md:text-[15px] text-sage leading-7 whitespace-pre-line max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>

          {/* Breed recommendations */}
          <div className="mt-8 md:mt-10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gold">
                  Recommended breeds
                </p>
                <p className="text-xs text-sage mt-1">
                  Explore breeds that may fit this lifestyle.
                </p>
              </div>
            </div>

            <BreedCarousel
              breeds={category.breeds}
              imageMap={imageMap}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

And do not change "lifestyleCategories.ts", "OptimizedImage.tsx", or the testimonial files for this rollback.

What this fixes

- Keeps the hero images compact with "max-w-2xl".
- Uses "aspect-[16/9]" so images can't become excessively tall.
- Restores the familiar centered page structure.
- Keeps alternating cream/white sections.
- Preserves every category, description, and breed.
- Keeps "#family", "#active", "#apartment", etc. working.
- Adds a subtle premium divider and hierarchy without overwhelming the page.
- Avoids the template-string syntax error from the previous deployment.
- Doesn't introduce any new dependencies.

After replacing the file, run:

npm run build

If that passes, deploy it.