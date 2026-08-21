import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProtectedImage } from "./ProtectedMedia";

export default function ClosingBanner({
  image,
}: {
  image: string | null;
}) {
  return (
    <section className="hp-section hp-section-cream py-12 md:py-16">
      <div className="hp-container">
        <div className="relative overflow-hidden rounded-[28px] bg-forest px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
          {/* Subtle decoration only */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-40 w-40 rounded-full border border-white/[0.06]" />

          <div
            className={`relative grid items-center gap-8 ${
              image ? "md:grid-cols-[1fr_240px]" : ""
            }`}
          >
            {/* Content */}
            <div>
              <p className="eyebrow mb-3 text-gold">
                Your Next Chapter
              </p>

              <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl">
                Ready to meet your new best friend?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                Browse available puppies and take the next step toward bringing
                the right companion home.
              </p>

              <Link
                href="/puppies"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-forest transition-all hover:bg-gold-light active:scale-95"
              >
                Find your puppy
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Optional compact image */}
            {image && (
              <div className="hidden md:block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-white/10">
                  <ProtectedImage
                    src={image}
                    alt="A happy Haven Paws puppy"
                    className="object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}