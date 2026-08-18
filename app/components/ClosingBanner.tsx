import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProtectedImage } from "./ProtectedMedia";

export default function ClosingBanner({
  image,
}: {
  image: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-forest py-16 md:py-24">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full border border-white/20" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full border border-white/10" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <p className="eyebrow text-white/45 mb-3">
            Your Next Chapter
          </p>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight text-white mb-4">
            Everything you need, in one place
          </h2>

          <p className="text-white/65 max-w-md leading-relaxed mb-7">
            Browse, connect, and bring your puppy home — all from Haven Paws.
          </p>

          <Link
            href="/puppies"
            className="inline-flex items-center gap-2 bg-gold text-forest px-6 py-3.5 rounded-full font-semibold hover:bg-gold-light active:scale-95 transition-all"
          >
            Find your puppy
            <ArrowRight size={15} />
          </Link>
        </div>

        {image && (
          <div className="relative">
            <div className="absolute -inset-3 rounded-[30px] border border-white/10" />

            <div className="relative aspect-video rounded-[24px] overflow-hidden shadow-2xl">
              <ProtectedImage
                src={image}
                alt="Haven Paws"
                className="transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}