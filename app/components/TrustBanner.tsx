export default function TrustBanner() {
  return (
    <section className="bg-cream-alt py-14 text-center">
      <div className="max-w-lg mx-auto px-6">
        <p className="eyebrow mb-3">Why We&apos;re Different</p>
        <h2 className="font-display text-2xl text-forest mb-6 leading-snug">
          We bring trusted breeders, honest screening, and real support together in one place.
        </h2>
        <a
          href="/breeder-standards"
          className="inline-block bg-forest text-cream px-6 py-2.5 rounded-full hover:bg-forest-light transition-colors"
        >
          Our Standards &amp; Screening
        </a>
      </div>
    </section>
  );
}