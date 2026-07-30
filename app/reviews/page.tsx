import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import { getReviews } from "@/lib/queries/testimonials";

export default async function ReviewsPage() {
  const reviews = await getReviews(20);

  return (
    <main>
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="eyebrow mb-3">About Haven Paws</p>
        <h1 className="font-display text-3xl text-forest mb-4">Haven Paws Reviews</h1>
        <p className="text-ink/70">
          {reviews.length === 0
            ? "No reviews yet — check back soon."
            : "Hear from families who found their puppy with us."}
        </p>
      </section>
      <Testimonials reviews={reviews} />
      <Footer />
    </main>
  );
}