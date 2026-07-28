export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="eyebrow mb-4">A Curated Home for Every Puppy</p>
        <h1 className="font-display text-4xl md:text-5xl text-forest leading-[1.1] mb-6">
          Every puppy deserves a beginning as good as their future.
        </h1>
        <p className="text-ink/80 text-lg mb-8 max-w-md">
          Health-guaranteed puppies, transparent bloodlines, and a concierge
          process from first meeting to homecoming.
        </p>
        <div className="flex gap-4">
          <a
            href="/puppies"
            className="bg-forest text-cream px-6 py-3 rounded-full hover:bg-forest-light transition-colors"
          >
            Meet the Litter
          </a>
          <a
            href="/how-it-works"
            className="border border-forest/30 text-forest px-6 py-3 rounded-full hover:border-forest transition-colors"
          >
            How It Works
          </a>
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