import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function TrustBanner() {
  return (
    <section className="hp-section hp-section-yellow py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mx-auto mb-5 w-12 h-12 rounded-2xl bg-white/70 border border-gold/30 flex items-center justify-center">
          <ShieldCheck size={23} className="text-forest" />
        </div>

        <p className="eyebrow mb-3">Why We&apos;re Different</p>

        <h2 className="font-display text-3xl sm:text-4xl text-forest leading-tight max-w-3xl mx-auto mb-6">
          We bring trusted breeders, honest screening, and real support
          together in one place.
        </h2>

        <Link
          href="/breeder-standards"
          className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-full font-medium hover:bg-forest-light active:scale-95 transition-all shadow-lg shadow-forest/10"
        >
          Our Standards &amp; Screening
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}