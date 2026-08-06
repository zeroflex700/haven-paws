import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import LifestyleFilterDropdown from "../components/LifestyleFilterDropdown";
import LifestyleCategorySection from "../components/LifestyleCategorySection";
import { getPageImages } from "@/lib/queries/pageContent";
import { getBreedImageMap } from "@/lib/queries/breedImages";
import { LIFESTYLE_CATEGORIES } from "../data/lifestyleCategories";

export default async function LifestylePage() {
  const { extraImages } = await getPageImages("lifestyle");
  const breedImages = await getBreedImageMap();

  return (
    <main>
      <Navbar />

      <PageContainer className="max-w-2xl pt-8">
        <p className="eyebrow mb-2 text-center">Explore</p>
        <h1 className="h1 text-center mb-2">Browse by Lifestyle</h1>
      </PageContainer>

      <LifestyleFilterDropdown categories={LIFESTYLE_CATEGORIES} />

      {LIFESTYLE_CATEGORIES.map((category, i) => (
        <LifestyleCategorySection
          key={category.key}
          category={category}
          heroImage={extraImages[`hero_${category.key}`] ?? null}
          imageMap={breedImages}
          alt={i % 2 === 1}
        />
      ))}

      <Footer />
    </main>
  );
}