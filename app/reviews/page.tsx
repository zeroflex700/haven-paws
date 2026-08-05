import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewsListClient from "../components/ReviewsListClient";
import ReviewCard from "../components/ReviewCard";
import { getAllReviews, getSpotlightReview, getReviewsCount } from "@/lib/queries/testimonials";
import { supabase } from "@/lib/supabase/client";

export default async function ReviewsPage() {
  const [reviews, spotlight, count] = await Promise.all([
    getAllReviews(),
    getSpotlightReview(),
    getReviewsCount(),
  ]);

  const { data: pageData } = await supabase
    .from("page_content")
    .select("hero_video_url")
    .eq("slug", "reviews")
    .single();

  const heroVideo = pageData?.hero_video_url ?? null;

  return (
    <main>
      <Navbar />

      <section className="bg-cream-alt py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="font-display text-2xl text-forest mb-4">Haven Paws Reviews</h1>
          <p className="text-ink/70 leading-relaxed mb-8">
            Families have shared heartwarming stories of how a puppy has brought joy into
            their lives.
          </p>

          {heroVideo && (
            <video src={heroVideo} controls className="w-full max-w-sm mx-auto rounded-lg mb-6" />
          )}

          <p className="text-sm text-sage">{count} review{count !== 1 ? "s" : ""}</p>
        </div>
      </section>

      {spotlight && (
        <section className="max-w-xl mx-auto px-6 py-12">
          <p className="eyebrow mb-3 text-center">Puppy Parent Spotlight</p>
          <ReviewCard review={spotlight} />
        </section>
      )}

      <section className="max-w-2xl mx-auto px-6 py-12">
        <ReviewsListClient reviews={reviews} />
      </section>

      <Footer />
    </main>
  );
}