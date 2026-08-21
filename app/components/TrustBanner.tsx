import Link from "next/link";
import {
ArrowRight,
ShieldCheck,
Check,
HeartHandshake,
SearchCheck,
} from "lucide-react";

export default function TrustBanner() {
return (
<section className="relative overflow-hidden bg-[#173f3a] py-14 sm:py-18 lg:py-20">
{/* Atmospheric layers */}
<div className="pointer-events-none absolute inset-0">
<div className="absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-white/[0.06]" />
<div className="absolute -left-16 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full border border-white/[0.08]" />
<div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-gold/[0.07] blur-3xl" />
<div className="absolute bottom-0 right-[18%] h-px w-64 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
</div>

  <div className="relative hp-container">
    <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      {/* Editorial statement */}
      <div className="max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-inner">
            <ShieldCheck size={21} className="text-gold" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/80">
              Why We&apos;re Different
            </p>
            <div className="mt-1 h-px w-16 bg-white/15" />
          </div>
        </div>

        <h2 className="font-display text-3xl leading-[1.06] tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl">
          Trust shouldn&apos;t be something you have to{" "}
          <span className="text-gold">guess.</span>
        </h2>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-[15px]">
          We bring trusted breeders, honest screening, and real support
          together in one place.
        </p>

        <Link
          href="/breeder-standards"
          className="group mt-7 inline-flex items-center gap-3 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-forest shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_18px_36px_rgba(0,0,0,0.2)] active:scale-[0.98]"
        >
          Our Standards &amp; Screening

          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-white transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </Link>
      </div>

      {/* Trust system panel */}
      <div className="relative">
        {/* Offset border */}
        <div className="absolute -inset-3 rounded-[30px] border border-white/[0.08]" />

        <div className="relative overflow-hidden rounded-[26px] border border-white/[0.1] bg-white/[0.055] p-4 shadow-2xl backdrop-blur-md sm:p-5">
          {/* Panel heading */}
          <div className="mb-5 flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                The Haven Paws Standard
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                Confidence at every step
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
              <Check size={15} className="text-gold" />
            </div>
          </div>

          <div className="space-y-3">
            <TrustPoint
              icon={<SearchCheck size={17} />}
              number="01"
              title="Thoughtful screening"
              description="A clearer standard for the breeders and puppies we feature."
            />

            <TrustPoint
              icon={<ShieldCheck size={17} />}
              number="02"
              title="Transparent guidance"
              description="More clarity while you search, connect, and make your decision."
            />

            <TrustPoint
              icon={<HeartHandshake size={17} />}
              number="03"
              title="Support that continues"
              description="Helpful people and resources beyond the moment you find your puppy."
            />
          </div>

          {/* Bottom indicator */}
          <div className="mt-5 flex items-center gap-2 border-t border-white/[0.08] pt-4">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <p className="text-[11px] text-white/40">
              Built around clarity, care, and accountability.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

);
}

function TrustPoint({
icon,
number,
title,
description,
}: {
icon: React.ReactNode;
number: string;
title: string;
description: string;
}) {
return (
<div className="group flex gap-3 rounded-2xl border border-transparent p-2.5 transition-colors duration-300 hover:border-white/[0.08] hover:bg-white/[0.035]">
<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.06] text-gold">
{icon}
</div>

  <div className="min-w-0 flex-1">
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <span className="text-[9px] font-semibold tracking-[0.14em] text-white/25">
        {number}
      </span>
    </div>

    <p className="mt-1 text-xs leading-relaxed text-white/45">
      {description}
    </p>
  </div>
</div>

);
}