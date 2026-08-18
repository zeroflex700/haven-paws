import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import LifestyleFilterDropdown from "../components/LifestyleFilterDropdown";
import LifestyleCategorySection from "../components/LifestyleCategorySection";
import { getPageImages } from "@/lib/queries/pageContent";
import { getBreedImageMap } from "@/lib/queries/breedImages";
import { LIFESTYLE_CATEGORIES } from "../data/lifestyleCategories";
import Link from "next/link";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";

export default async function LifestylePage() {
const { extraImages } = await getPageImages("lifestyle");
const breedImages = await getBreedImageMap();

const familyCategory = LIFESTYLE_CATEGORIES.find(
(category) => category.key === "family"
);

const otherCategories = LIFESTYLE_CATEGORIES.filter(
(category) => category.key !== "family"
);

return (
<main className="min-h-screen bg-cream">
<Navbar />

  {/* HERO */}
  <section className="relative overflow-hidden bg-forest text-cream">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full border border-white/10" />
      <div className="absolute -top-20 -right-12 h-64 w-64 rounded-full border border-white/10" />
      <div className="absolute bottom-[-180px] left-[-100px] h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
    </div>

    <PageContainer className="relative max-w-6xl py-16 md:py-24 lg:py-28">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
          <Sparkles size={14} className="text-gold" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">
            Find your perfect match
          </span>
        </div>

        <p className="eyebrow mt-7 mb-3 text-gold">
          Explore
        </p>

        <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.035em] text-white sm:text-6xl md:text-7xl">
          Browse by
          <span className="block text-gold">Lifestyle</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          Discover puppy breeds that naturally fit the way you live,
          from active adventures and apartment living to family life,
          low-shedding companions, and more.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#family"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-forest transition-all hover:bg-gold-light active:scale-[0.98]"
          >
            Explore family breeds
            <ArrowRight size={15} />
          </Link>

          <Link
            href="/puppies"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/15"
          >
            Browse all puppies
          </Link>
        </div>
      </div>

      <div className="mt-14 flex items-center gap-3 text-white/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15">
          <ArrowDown size={15} />
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em]">
          Explore your lifestyle
        </span>
      </div>
    </PageContainer>
  </section>

  {/* CATEGORY NAVIGATION */}
  <section className="sticky top-0 z-30 border-b border-sage/10 bg-cream/95 backdrop-blur-xl">
    <PageContainer className="max-w-6xl py-3">
      <LifestyleFilterDropdown categories={LIFESTYLE_CATEGORIES} />
    </PageContainer>
  </section>

  {/* FAMILY FEATURE */}
  {familyCategory && (
    <section
      id="family"
      className="scroll-mt-24 border-b border-sage/10 bg-white"
    >
      <PageContainer className="max-w-6xl py-14 md:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gold/15 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-forest">
              <Sparkles size={13} />
              Featured lifestyle
            </div>

            <p className="eyebrow mb-3">
              Family
            </p>

            <h2 className="font-display text-4xl leading-tight tracking-[-0.025em] text-forest sm:text-5xl">
              Family-friendly
              <span className="block text-sage">
                puppy breeds
              </span>
            </h2>

            <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-8 text-ink/70">
              {familyCategory.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {familyCategory.breeds.slice(0, 4).map((breed) => (
                <span
                  key={breed.name}
                  className="rounded-full border border-sage/15 bg-cream px-4 py-2 text-xs font-medium text-forest"
                >
                  {breed.name}
                </span>
              ))}
            </div>

            <Link
              href="/puppies"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest transition-colors hover:text-sage"
            >
              Find available family puppies
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="relative">
            {extraImages.hero_family ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-cream-alt shadow-2xl shadow-forest/10">
                <img
                  src={extraImages.hero_family}
                  alt="Family-friendly puppy breeds"
                  className="h-full w-full object-cover"
                  loading="eager"
                />

                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-forest/80 p-5 text-white backdrop-blur-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                    A thoughtful match
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/80">
                    Find a companion whose temperament and energy naturally
                    complement your home.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center rounded-[32px] bg-cream-alt text-sm text-sage">
                Family image coming soon
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </section>
  )}

  {/* OTHER LIFESTYLE CATEGORIES */}
  <section className="bg-cream">
    {otherCategories.map((category, index) => (
      <LifestyleCategorySection
        key={category.key}
        category={category}
        heroImage={extraImages[`hero_${category.key}`] ?? null}
        imageMap={breedImages}
        alt={index % 2 === 0}
      />
    ))}
  </section>

  {/* CLOSING CTA */}
  <section className="bg-forest text-cream">
    <PageContainer className="max-w-5xl py-16 text-center md:py-20">
      <p className="eyebrow mb-3 text-gold">
        Your next chapter
      </p>

      <h2 className="font-display text-4xl tracking-[-0.025em] text-white sm:text-5xl">
        The right puppy starts
        <span className="block text-gold">with the right fit.</span>
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
        Explore available puppies and find a companion whose personality,
        energy, and lifestyle can become part of your everyday life.
      </p>

      <Link
        href="/puppies"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-forest transition-all hover:bg-gold-light active:scale-[0.98]"
      >
        Browse All Puppies
        <ArrowRight size={15} />
      </Link>
    </PageContainer>
  </section>

  <Footer />
</main>

);
}