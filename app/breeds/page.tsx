import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BREEDS } from "../data/breeds";

export default function BreedsPage() {
  return (
    <main>
      <Navbar />
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="eyebrow mb-3">Explore</p>
        <h1 className="font-display text-3xl text-forest mb-8">Available Breeds</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BREEDS.map((b) => (
            <Link
              key={b}
              href={`/puppies?breed=${encodeURIComponent(b)}`}
              className="text-sm text-ink/80 hover:text-forest border border-sage/20 rounded-lg px-3 py-2"
            >
              {b}
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}