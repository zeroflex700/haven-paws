import { ArrowRight, Check, Heart, Search } from "lucide-react";
import Link from "next/link";
import { ProtectedImage } from "./ProtectedMedia";
import ParticleField from "./ParticleField";

export default function ClosingBanner({
image,
}: {
image: string | null;
}) {
return (
<section className="relative overflow-hidden bg-[#102d2a] py-16 sm:py-20 lg:py-28">
{/* Animated ambient dust field */}
<ParticleField density={80} className="z-0 opacity-80" />

  {/* Ambient composition */}
  <div className="pointer-events-none absolute inset-0 z-[1]">
    <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

    <div className="absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-white/[0.05]" />
    <div className="absolute -left-20 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full border border-white/[0.06]" />

    <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/[0.06] blur-3xl" />
    <div className="absolute -bottom-40 right-[15%] h-80 w-80 rounded-full bg-[#285c55]/30 blur-3xl" />

    <div className="absolute bottom-10 left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>

  <div className="relative z-10 hp-container">
    <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
      {/* Final invitation */}
      <div className="order-2 lg:order-1">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
            Your Next Chapter
          </span>
        </div>

        <h2 className="max-w-xl font-display text-4xl leading-[0.98] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
          The right puppy
          <span className="block text-gold">changes everything.</span>
        </h2>

        <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/60 sm:text-[15px]">
          Browse, connect, and bring your puppy home — all from Haven Paws.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/puppies"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-forest shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-gold-light hover:shadow-[0_24px_50px_rgba(0,0,0,0.28)] active:scale-[0.98]"
          >
            Find your puppy

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-white transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3.5 text-sm font-medium text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.05] hover:text-white"
          >
            See how it works
          </Link>
        </div>

        {/* Confidence signals */}
        <div className="mt-9 grid max-w-lg grid-cols-3 gap-2 border-t border-white/[0.09] pt-5">
          <ClosingSignal
            icon={<Search size={14} />}
            label="Explore"
          />

          <ClosingSignal
            icon={<Check size={14} />}
            label="Connect"
          />

          <ClosingSignal
            icon={<Heart size={14} />}
            label="Bring home"
          />
        </div>
      </div>

      {/* Cinematic image composition */}
      <div className="order-1 relative lg:order-2">
        <div className="absolute -inset-4 rounded-[36px] border border-white/[0.08]" />
        <div className="absolute -inset-8 rounded-[48px] border border-white/[0.04]" />

        <div className="absolute -left-2 top-5 z-20 rounded-2xl border border-white/15 bg-[#173f3a]/85 px-4 py-3 shadow-xl backdrop-blur-xl sm:-left-7 sm:top-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold/80">
            Start here
          </p>

          <p className="mt-1 text-xs font-medium text-white">
            Find a puppy that feels like home.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-2 shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
            {image ? (
              <>
                <ProtectedImage
                  src={image}
                  alt="A puppy beginning a new chapter with its family"
                  className="transition-transform duration-1000 ease-out hover:scale-105"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#102d2a]/60 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-forest-light via-forest to-[#102d2a]" />
            )}

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <div className="max-w-sm">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60">
                    Haven Paws
                  </span>
                </div>

                <p className="font-display text-xl leading-tight text-white sm:text-2xl">
                  A better beginning for your next best friend.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-5 right-5 hidden rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 shadow-xl backdrop-blur-md sm:block">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Heart size={13} />
            </span>

            <div>
              <p className="text-[9px] uppercase tracking-[0.14em] text-white/35">
                The journey
              </p>

              <p className="text-xs font-medium text-white/85">
                Starts with a feeling
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

);
}

function ClosingSignal({
icon,
label,
}: {
icon: React.ReactNode;
label: string;
}) {
return (
<div className="flex items-center gap-2">
<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-gold">
{icon}
</span>

  <span className="text-[11px] font-medium text-white/55">
    {label}
  </span>
</div>

);
}