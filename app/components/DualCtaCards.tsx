import Link from "next/link";
import { ArrowRight, HeartHandshake, Home } from "lucide-react";

export default function DualCtaCards() {
  return (
    <section className="hp-section hp-section-lavender py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-2 gap-5">
          <Link
            href="/contact#breeder-application"
            className="group relative overflow-hidden rounded-[28px] bg-blue p-7 sm:p-9 block interactive-card border border-white/50"
          >
            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/35" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-7">
                <Home size={21} className="text-forest" />
              </div>

              <p className="eyebrow mb-2">For Breeders</p>

              <h3 className="font-display text-2xl text-forest mb-3">
                Are you a breeder?
              </h3>

              <p className="text-sm text-ink/70 leading-relaxed max-w-md mb-6">
                Partner with Haven Paws to connect your puppies with loving,
                screened families.
              </p>

              <span className="inline-flex items-center gap-2 text-sm text-forest font-semibold">
                Learn more
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>

          <Link
            href="/contact"
            className="group relative overflow-hidden rounded-[28px] bg-navy p-7 sm:p-9 block interactive-card"
          >
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gold flex items-center justify-center mb-7">
                <HeartHandshake size={21} className="text-forest" />
              </div>

              <p className="eyebrow text-white/45 mb-2">
                For Shelters &amp; Rescues
              </p>

              <h3 className="font-display text-2xl text-white mb-3">
                Are you a shelter or rescue?
              </h3>

              <p className="text-sm text-white/65 leading-relaxed max-w-md mb-6">
                We&apos;d love to explore how Haven Paws can support your
                organization&apos;s mission.
              </p>

              <span className="inline-flex items-center gap-2 text-sm text-white font-semibold">
                Learn more
                <ArrowRight
                  size={15}
                  className="text-gold transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}