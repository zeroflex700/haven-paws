import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewsListClient from "../components/ReviewsListClient";
import ReviewCard from "../components/ReviewCard";
import {
  getAllReviews,
  getSpotlightReview,
  getReviewsCount,
} from "@/lib/queries/testimonials";
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

  const reviewLabel = `${count} ${count === 1 ? "family story" : "family stories"}`;

  return (
    <main className="overflow-hidden bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-cream-alt">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-cream opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sage/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sage/20 bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-sage shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-sage" />
              Real Haven Paws Families
            </div>

            <h1 className="font-display text-4xl leading-tight text-forest sm:text-5xl lg:text-6xl">
              Loved at Home.
              <span className="block italic text-sage">Remembered Forever.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
              Families have shared heartwarming stories of how a puppy has brought
              joy, companionship, laughter, and unforgettable moments into their
              lives.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-full border border-forest/10 bg-white px-5 py-2.5 shadow-sm">
                <span className="text-sm font-medium text-forest">
                  {reviewLabel}
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-full border border-forest/10 bg-white px-5 py-2.5 shadow-sm">
                <span className="text-sm tracking-wide text-[#d6a84b]">★★★★★</span>
                <span className="ml-1 text-sm font-medium text-forest">
                  Family love
                </span>
              </div>
            </div>
          </div>

          {/* VIDEO */}
          {heroVideo && (
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="relative rounded-[2rem] border border-white/80 bg-white p-2 shadow-[0_20px_70px_rgba(35,68,52,0.12)]">
                <div className="overflow-hidden rounded-[1.6rem] bg-forest/5">
                  <video
                    src={heroVideo}
                    controls
                    playsInline
                    className="aspect-video w-full object-cover"
                  />
                </div>
              </div>

              <p className="mt-4 text-center text-sm text-ink/50">
                A glimpse into the moments that make a house feel like home.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-forest/5 bg-white">
        <div className="mx-auto grid max-w-6xl divide-y divide-forest/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-6 py-7 text-center">
            <p className="font-display text-3xl text-forest">{count}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-ink/45">
              Shared Stories
            </p>
          </div>

          <div className="px-6 py-7 text-center">
            <p className="font-display text-3xl text-forest">★★★★★</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-ink/45">
              Moments Worth Sharing
            </p>
          </div>

          <div className="px-6 py-7 text-center">
            <p className="font-display text-3xl text-forest">∞</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-ink/45">
              Memories Made
            </p>
          </div>
        </div>
      </section>

      {/* SPOTLIGHT */}
      {spotlight && (
        <section className="relative bg-[#f8f6f1] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="eyebrow mb-3">Puppy Parent Spotlight</p>

              <h2 className="font-display text-3xl text-forest sm:text-4xl">
                One family. One story.
                <span className="block italic text-sage">A lifetime of love.</span>
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
                Every Haven Paws journey begins with a puppy, but the stories that
                follow become part of a family forever.
              </p>
            </div>

            <div className="relative mx-auto max-w-2xl">
              {/* Accent */}
              <div className="absolute -left-3 top-8 hidden h-24 w-1 rounded-full bg-sage/30 sm:block" />

              <div className="rounded-2xl bg-white shadow-[0_18px_60px_rgba(35,68,52,0.08)] ring-1 ring-forest/5">
                <ReviewCard review={spotlight} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ALL STORIES */}
      <section className="relative bg-white py-16 sm:py-20">
        <div className="pointer-events-none absolute left-0 top-0 h-64 w-full bg-gradient-to-b from-cream-alt/40 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center">
            <p className="eyebrow mb-3">From Our Families</p>

            <h2 className="font-display text-3xl text-forest sm:text-4xl">
              Stories that start with
              <span className="block italic text-sage">four little paws.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
              Explore the experiences, memories, and heartfelt moments shared by
              families who welcomed a Haven Paws puppy into their lives.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-px w-10 bg-sage/30" />
              <span className="text-xs uppercase tracking-[0.18em] text-sage">
                {count} {count === 1 ? "Review" : "Reviews"}
              </span>
              <span className="h-px w-10 bg-sage/30" />
            </div>
          </div>

          <div className="mx-auto max-w-4xl">
            <ReviewsListClient reviews={reviews} />
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-forest px-6 py-14 text-center sm:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cream/60">
            More Than a Puppy
          </p>

          <h2 className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl">
            The best stories are the ones
            <span className="block italic text-cream">you get to live yourself.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            A puppy can change the rhythm of a home in the most beautiful ways —
            filling ordinary days with companionship, personality, and love.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}