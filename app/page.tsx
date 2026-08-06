import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeHero from "./components/HomeHero";
import BreedDiscoveryRow from "./components/BreedDiscoveryRow";
import RecentlyViewedStrip from "./components/RecentlyViewedStrip";
import TrustBanner from "./components/TrustBanner";
import HowItWorksAccordion from "./components/HowItWorksAccordion";
import VideoStoryCarousel from "./components/VideoStoryCarousel";
import LocationCardsRow from "./components/LocationCardsRow";
import FamilyStoriesCarousel from "./components/FamilyStoriesCarousel";
import KeepExploringGrid from "./components/KeepExploringGrid";
import DualCtaCards from "./components/DualCtaCards";
import ClosingBanner from "./components/ClosingBanner";
import { getPageImages } from "@/lib/queries/pageContent";
import { getReviewStats, getReviews } from "@/lib/queries/testimonials";
import { getVideoStories, getLocationCards, getExploringCards } from "@/lib/queries/homepageCollections";
import { supabase } from "@/lib/supabase/client";

export default async function Home() {
  const { heroImage, heroVideo, extraImages } = await getPageImages("homepage");
  const { count, avgRating } = await getReviewStats();
  const reviews = await getReviews(6);
  const videoStories = await getVideoStories();
  const locationCards = await getLocationCards();
  const exploringCards = await getExploringCards();
  const { data: breeds } = await supabase
    .from("breeds")
    .select("id, name, image_url")
    .order("name");

  return (
    <main>
      <Navbar />
      <HomeHero
        heroImage={heroImage}
        heroVideo={heroVideo}
        reviewCount={count}
        avgRating={avgRating}
      />
      <BreedDiscoveryRow breeds={breeds ?? []} />
      <RecentlyViewedStrip />
      <TrustBanner />
      <HowItWorksAccordion />
      <VideoStoryCarousel stories={videoStories} />
      <LocationCardsRow cards={locationCards} />
      <FamilyStoriesCarousel reviews={reviews} />
      <KeepExploringGrid cards={exploringCards} breeds={breeds ?? []} />
      <DualCtaCards />
      <ClosingBanner image={extraImages.closing_banner ?? null} />
      <Footer />
    </main>
  );
}