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
      className={`scroll-mt-20 py-14 ${alt ? "bg-cream-alt" : ""}`}
    >
      <div className="max-w-2xl mx-auto px-6">
        {heroImage && (
          <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-5">
            <ProtectedImage src={heroImage} alt={category.title} />
          </div>
        )}

        <LifestyleIcon categoryKey={category.key} />

        <h2 className="font-display text-2xl text-forest mt-4 mb-3">
          {category.title}
        </h2>

        <p className="text-sage leading-relaxed whitespace-pre-line mb-6">
          {category.description}
        </p>

        <BreedCarousel
          breeds={category.breeds}
          imageMap={imageMap}
        />
      </div>
    </section>
  );
}