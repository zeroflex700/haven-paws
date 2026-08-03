import { ArrowRight } from "lucide-react";

export default function DualCtaCards() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-5">
      <div className="bg-cream-alt rounded-lg p-6">
        <h3 className="font-display text-lg text-forest mb-2">Are you a breeder?</h3>
        <p className="text-sm text-ink/70 mb-4">
          Partner with Haven Paws to connect your puppies with loving, screened families.
        </p>
        <a href="/contact#breeder-application" className="inline-flex items-center gap-1 text-sm text-forest">
          Learn more <ArrowRight size={14} />
        </a>
      </div>
      <div className="bg-cream-alt rounded-lg p-6">
        <h3 className="font-display text-lg text-forest mb-2">Are you a shelter or rescue?</h3>
        <p className="text-sm text-ink/70 mb-4">
          We&apos;d love to explore how Haven Paws can support your organization&apos;s mission.
        </p>
        <a href="/contact" className="inline-flex items-center gap-1 text-sm text-forest">
          Learn more <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}