import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllGuidedBreeds } from "@/lib/queries/breedGuides";
import { cldOptimized } from "@/lib/cloudinary";

export default async function BreedGuidesIndexPage() {
  const breeds = await getAllGuidedBreeds();

  return (
    <main>
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 py-14">
        <p className="eyebrow mb-3">For Puppy Parents</p>
        <h1 className="font-display text-3xl text-forest mb-8">Breed Guides</h1>

        {breeds.length === 0 ? (
          <p className="text-sage">No breed guides published yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {breeds.map((b) => (
              <Link key={b.id} href={`/breed-guides/${b.slug}`}>
                <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt mb-2">
                  {b.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cldOptimized(b.imageUrl, 300)} alt={b.name} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <p className="text-forest font-medium text-center">{b.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}