import PedigreeCard from "./PedigreeCard";

const puppies = [
  { name: "Willow", breed: "Golden Retriever", price: "$2,400", status: "available" as const },
  { name: "Bram", breed: "French Bulldog", price: "$3,100", status: "available" as const },
  { name: "Sable", breed: "Cavalier King Charles", price: "$2,800", status: "reserved" as const },
];

export default function FeaturedLitter() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <p className="eyebrow mb-3">Meet the Litter</p>
      <h2 className="font-display text-3xl text-forest mb-10">
        Puppies available now
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {puppies.map((p) => (
          <PedigreeCard key={p.name} {...p} />
        ))}
      </div>
      <a
        href="/puppies"
        className="inline-block mt-8 text-forest border-b border-gold pb-0.5 hover:text-forest-light"
      >
        View all available puppies →
      </a>
    </section>
  );
}