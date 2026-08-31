import Link from "next/link";
import PedigreeCard from "./PedigreeCard";
import { getPublishedPuppies } from "@/lib/queries/puppies";

export default async function FeaturedLitter() {
  const puppies = await getPublishedPuppies();
  const featured = puppies.filter((p) => p.status === "available").slice(0, 3);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <p className="eyebrow mb-3">Meet the Litter</p>
      <h2 className="font-display text-2xl text-forest mb-10">
        Puppies available now
      </h2>
      {featured.length === 0 ? (
        <p className="text-sage">No published puppies yet — add some in Supabase.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featured.map((p) => (
            <PedigreeCard key={p.id} {...p} image={p.coverImage} />
          ))}
        </div>
      )}
      <Link
        href="/puppies"
        className="inline-block mt-8 text-forest border-b border-gold pb-0.5 hover:text-forest-light"
      >
        View all available puppies →
      </Link>
    </section>
  );
}