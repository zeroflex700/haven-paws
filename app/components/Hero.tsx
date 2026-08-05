import Link from "next/link";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-16 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <p className="eyebrow mb-3">A Curated Home for Every Puppy</p>
        <h1 className="font-display text-3xl md:text-4xl text-forest leading-[1.15] mb-5">
          Every puppy deserves a beginning as good as their future.
        </h1>
        <p className="text-ink/80 text-base mb-7 max-w-md">
          Health-guaranteed puppies, transparent bloodlines, and a concierge
          process from first meeting to homecoming.
        </p>
        <div className="flex gap-3">
          <Link
            href="/puppies"
            className="bg-forest text-cream text-sm px-5 py-2.5 rounded-full hover:bg-forest-light transition-colors"
          >
            Meet the Litter
          </Link>
          <Link
            href="/how-it-works"
            className="border border-forest/30 text-forest text-sm px-5 py-2.5 rounded-full hover:border-forest transition-colors"
          >
            How It Works
          </Link>
        </div>
      </div>
      <div className="relative">
        <div className="aspect-[4/5] rounded-lg bg-cream-alt border border-gold/30 flex items-center justify-center">
          <span className="text-sage text-sm">Hero photo goes here</span>
        </div>
        <div className="absolute -bottom-4 -left-4 w-full h-full rounded-lg border border-gold/40 -z-10" />
      </div>
    </section>
  );
}