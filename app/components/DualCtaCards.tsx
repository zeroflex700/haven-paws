import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DualCtaCards() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid md:grid-cols-2 gap-5">
      <Link href="/contact#breeder-application" className="bg-cream-alt rounded-lg p-6 block interactive-card">
        <h3 className="h3 mb-2">Are you a breeder?</h3>
        <p className="text-sm text-ink/70 mb-4">
          Partner with Haven Paws to connect your puppies with loving, screened families.
        </p>
        <span className="inline-flex items-center gap-1 text-sm text-forest">
          Learn more <ArrowRight size={14} />
        </span>
      </Link>
      <Link href="/contact" className="bg-cream-alt rounded-lg p-6 block interactive-card">
        <h3 className="h3 mb-2">Are you a shelter or rescue?</h3>
        <p className="text-sm text-ink/70 mb-4">
          We&apos;d love to explore how Haven Paws can support your organization&apos;s mission.
        </p>
        <span className="inline-flex items-center gap-1 text-sm text-forest">
          Learn more <ArrowRight size={14} />
        </span>
      </Link>
    </section>
  );
}