import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="eyebrow mb-3">About Us</p>
        <h1 className="font-display text-3xl text-forest mb-6">
          A curated home for every puppy
        </h1>
        <p className="text-ink/80 leading-relaxed mb-4">
          Haven Paws connects families with ethically raised, health-guaranteed
          puppies through a concierge process — from first meeting to homecoming.
          Every puppy is raised with transparent bloodlines, full veterinary
          care, and genuine attention before they ever meet their new family.
        </p>
        <p className="text-ink/80 leading-relaxed">
          We believe finding a puppy should feel personal, not transactional —
          which is why every listing includes real health records, parent
          information, and direct communication with our team.
        </p>
      </section>
      <Footer />
    </main>
  );
}