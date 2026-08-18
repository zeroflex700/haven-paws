import LifestyleIcon from "./LifestyleIcon";
import BreedCarousel from "./BreedCarousel";
import { ProtectedImage } from "./ProtectedMedia";
import type { LifestyleCategory } from "../data/lifestyleCategories";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
className={"scroll-mt-24 border-b border-sage/10 py-16 md:py-20 lg:py-24 ${ alt ? "bg-cream-alt" : "bg-white" }"}
>
<div className="mx-auto max-w-6xl px-6 lg:px-10">
<div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
{/* TEXT */}
<div className="lg:sticky lg:top-28">
<div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-forest/5">
<LifestyleIcon categoryKey={category.key} />
</div>

        <p className="eyebrow mb-2">
          Lifestyle
        </p>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.025em] text-forest sm:text-4xl">
          {category.title}
        </h2>

        <p className="mt-5 whitespace-pre-line text-sm leading-7 text-sage sm:text-base">
          {category.description}
        </p>

        <Link
          href="/puppies"
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-forest transition-colors hover:text-sage"
        >
          Explore available puppies
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* VISUAL + BREEDS */}
      <div>
        {heroImage ? (
          <div className="group relative mb-8 aspect-[16/9] overflow-hidden rounded-[28px] bg-cream-alt shadow-xl shadow-forest/5">
            <ProtectedImage
              src={heroImage}
              alt={category.title}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        ) : (
          <div className="mb-8 flex aspect-[16/9] items-center justify-center rounded-[28px] bg-cream-alt">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">
                {category.title}
              </p>
              <p className="mt-1 text-xs text-sage/60">
                Lifestyle image coming soon
              </p>
            </div>
          </div>
        )}

        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">
              Recommended breeds
            </p>

            <p className="mt-1 text-sm text-ink/60">
              Explore breeds that may fit this lifestyle.
            </p>
          </div>

          <span className="hidden rounded-full bg-forest/5 px-3 py-1.5 text-[10px] font-semibold text-forest sm:block">
            {category.breeds.length} breeds
          </span>
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