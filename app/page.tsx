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
    <main className="homepage">
      <Navbar />

      {/* HERO — warm, editorial opening */}
      <section className="hp-section hp-hero-section">
        <div className="hp-section-glow hp-glow-gold" />
        <HomeHero
          heroImage={heroImage}
          heroVideo={heroVideo}
          reviewCount={count}
          avgRating={avgRating}
        />
      </section>

      {/* BROWSING — light blue interruption */}
      <section className="hp-section hp-browsing-section">
        <div className="hp-content">
          <ContinueBrowsingBanner />
        </div>
      </section>

      {/* BREEDS — white editorial catalogue */}
      <section className="hp-section hp-breeds-section">
        <div className="hp-content hp-content-wide">
          <BreedDiscoveryRow breeds={breeds ?? []} />
        </div>
      </section>

      {/* RECENTLY VIEWED — subtle cream strip */}
      <section className="hp-section hp-recent-section">
        <div className="hp-content hp-content-wide">
          <RecentlyViewedStrip />
        </div>
      </section>

      {/* RECOMMENDED PUPPIES — pale yellow / premium showcase */}
      <section className="hp-section hp-recommended-section">
        <div className="hp-section-glow hp-glow-blue" />
        <div className="hp-content hp-content-wide">
          <RecommendedPuppies />
        </div>
      </section>

      {/* TRUST — deep navy statement section */}
      <section className="hp-section hp-trust-section">
        <div className="hp-content hp-content-wide">
          <TrustBanner />
        </div>
      </section>

      {/* VERIFICATION — white / certification feel */}
      <section className="hp-section hp-verification-section">
        <div className="hp-content hp-content-narrow">
          <VerificationBadges
            badge1={extraImages.verification_badge_1 ?? null}
            badge2={extraImages.verification_badge_2 ?? null}
            badge3={extraImages.verification_badge_3 ?? null}
            badge4={extraImages.verification_badge_4 ?? null}
          />
        </div>
      </section>

      {/* HOW IT WORKS — pale blue */}
      <section className="hp-section hp-process-section">
        <div className="hp-content hp-content-narrow">
          <HowItWorksAccordion />
        </div>
      </section>

      {/* BREEDER STORIES — dark editorial block */}
      <section className="hp-section hp-video-section">
        <div className="hp-content hp-content-wide">
          <VideoStoryCarousel stories={videoStories} />
        </div>
      </section>

      {/* LOCATIONS — warm yellow */}
      <section className="hp-section hp-location-section">
        <div className="hp-content hp-content-wide">
          <LocationCardsRow cards={locationCards} />
        </div>
      </section>

      {/* FAMILY STORIES — soft blush/cream */}
      <section className="hp-section hp-family-section">
        <div className="hp-content hp-content-wide">
          <FamilyStoriesCarousel reviews={reviews} />
        </div>
      </section>

      {/* EXPLORE — white catalogue */}
      <section className="hp-section hp-explore-section">
        <div className="hp-content hp-content-wide">
          <KeepExploringGrid
            cards={exploringCards}
            breeds={breeds ?? []}
          />
        </div>
      </section>

      {/* BREEDER / SHELTER CTA — intentionally contrasting cards */}
      <section className="hp-section hp-dual-cta-section">
        <div className="hp-content hp-content-wide">
          <DualCtaCards />
        </div>
      </section>

      {/* CLOSING — strong visual ending */}
      <section className="hp-section hp-closing-section">
        <ClosingBanner
          image={extraImages.closing_banner ?? null}
        />
      </section>

      <Footer />
    </main>
  );
}