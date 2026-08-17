import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import OptimizedImage from "../components/OptimizedImage";
import { getAllGuidedBreeds } from "@/lib/queries/breedGuides";

export default async function BreedGuidesIndexPage() {
  const breeds = (await getAllGuidedBreeds()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  return (
    <main>
      <Navbar />

      <PageContainer className="py-10">
        <p className="eyebrow mb-2">For Puppy Parents</p>
        <h1 className="h1 mb-8">Breed Guides</h1>

        {breeds.length === 0 ? (
          <p className="small-text">
            No breed guides published yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {breeds.map((b) => (
              <Link key={b.id} href={`/breed-guides/${b.slug}`}>
                <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt mb-2">
                  <OptimizedImage
                    src={b.imageUrl}
                    alt={b.name}
                    sizes="(max-width: 640px) 45vw, 200px"
                  />
                </div>

                <p className="text-sm text-forest font-medium text-center">
                  {b.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>

      <Footer />
    </main>
  );
}