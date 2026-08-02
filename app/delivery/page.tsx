import Link from "next/link";
import { getPageImages } from "@/lib/queries/pageContent";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DeliveryTiers from "../components/DeliveryTiers";
import { ProtectedVideo } from "../components/ProtectedMedia";

export default async function DeliveryPage() {
  const content = await getPageImages("delivery-programs");

  return (
    <>
      <Navbar />

      <main className="bg-cream min-h-screen">
        <section className="max-w-2xl mx-auto px-4 pt-10 pb-6 text-center">
          <p className="eyebrow text-gold">Delivery Programs</p>
          <h1 className="font-display text-3xl text-ink mt-2">
            Bringing Your Puppy Home, Safely
          </h1>
          <p className="text-sage mt-3 leading-relaxed">
            You&apos;ve found your new companion — now it&apos;s time to choose
            the option that works best for you. Every Haven Paws delivery is
            handled by trusted, experienced transportation partners who put
            your puppy&apos;s comfort and wellbeing first.
          </p>
        </section>

        <section className="max-w-2xl mx-auto px-4 pb-10">
          <DeliveryTiers images={content.extraImages} />
        </section>

        <section className="bg-cream-alt py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-display text-2xl text-ink">
              Safe Nationwide Delivery, Wherever You Are
            </h2>
            <p className="text-sage mt-3 leading-relaxed">
              No matter where you live in the U.S., Haven Paws can bring your
              new puppy home safely. We work only with experienced, licensed
              transportation partners who prioritize your puppy&apos;s health
              and comfort at every step of the journey.
            </p>
            <p className="text-sage mt-3 leading-relaxed">
              From departure to arrival, every delivery is carefully
              coordinated to keep travel time short and the experience calm
              and stress-free.
            </p>

            {content.heroVideo && (
              <div className="mt-6">
                <p className="text-ink font-semibold mb-3">
                  Watch Haven Paws families welcome their puppies home
                </p>
                <ProtectedVideo
                  src={content.heroVideo}
                  className="w-full rounded-lg aspect-video"
                />
              </div>
            )}
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-4 py-12 text-center">
          <h2 className="font-display text-2xl text-ink">
            Keep Exploring Puppies
          </h2>
          <Link
            href="/puppies"
            className="inline-block mt-4 bg-forest text-cream px-8 py-3 rounded-full font-semibold hover:bg-forest-light transition"
          >
            Browse All Puppies
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}