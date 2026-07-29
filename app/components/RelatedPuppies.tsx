import PedigreeCard from "./PedigreeCard";
import type { RelatedPuppy } from "@/lib/queries/relatedPuppies";

export default function RelatedPuppies({
  puppies,
  breedName,
}: {
  puppies: RelatedPuppy[];
  breedName: string;
}) {
  if (puppies.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <p className="eyebrow mb-3">You Might Also Love</p>
      <h2 className="font-display text-2xl text-forest mb-6">
        Other {breedName} Puppies
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {puppies.map((p) => (
          <PedigreeCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}