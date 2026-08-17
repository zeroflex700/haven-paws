import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeHero from "./components/HomeHero";
import VerificationBadges from "./components/VerificationBadges";
import BreedDiscoveryRow from "./components/BreedDiscoveryRow";
import ContinueBrowsingBanner from "./components/ContinueBrowsingBanner";
import RecentlyViewedStrip from "./components/RecentlyViewedStrip";
import RecommendedPuppies from "./components/RecommendedPuppies";
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
import {
  getVideoStories,
  getLocationCards,
  getExploringCards,
} from "@/lib/queries/homepageCollections";
import { supabase } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: "Haven Paws — A Curated Home for Every Puppy",
  description:
    "Ethically bred, health-guaranteed puppies matched with families through a concierge adoption process. Trusted breeders, nationwide delivery, and support the whole way through.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const { heroImage, heroVideo, extraImages } =
    await getPageImages("homepage");

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
    <main className="home-page">
      <Navbar />

      <div className="home-hero-shell">
        <HomeHero
          heroImage={heroImage}
          heroVideo={heroVideo}
          reviewCount={count}
          avgRating={avgRating}
        />
      </div>

      <section className="home-section home-section--floating">
        <ContinueBrowsingBanner />
      </section>

      <section className="home-section home-section--breeds">
        <BreedDiscoveryRow breeds={breeds ?? []} />
      </section>

      <section className="home-section home-section--quiet">
        <RecentlyViewedStrip />
      </section>

      <section className="home-section home-section--featured">
        <RecommendedPuppies />
      </section>

      <section className="home-section home-section--trust">
        <TrustBanner />
      </section>

      <section className="home-section home-section--verification">
        <VerificationBadges
          badge1={extraImages.verification_badge_1 ?? null}
          badge2={extraImages.verification_badge_2 ?? null}
          badge3={extraImages.verification_badge_3 ?? null}
          badge4={extraImages.verification_badge_4 ?? null}
        />
      </section>

      <section className="home-section home-section--process">
        <HowItWorksAccordion />
      </section>

      <section className="home-section home-section--stories">
        <VideoStoryCarousel stories={videoStories} />
      </section>

      <section className="home-section home-section--locations">
        <LocationCardsRow cards={locationCards} />
      </section>

      <section className="home-section home-section--families">
        <FamilyStoriesCarousel reviews={reviews} />
      </section>

      <section className="home-section home-section--explore">
        <KeepExploringGrid
          cards={exploringCards}
          breeds={breeds ?? []}
        />
      </section>

      <section className="home-section home-section--cta">
        <DualCtaCards />
      </section>

      <section className="home-closing">
        <ClosingBanner
          image={extraImages.closing_banner ?? null}
        />
      </section>

      <Footer />
    </main>
  );
}