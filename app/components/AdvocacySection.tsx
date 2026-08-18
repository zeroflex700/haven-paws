"use client";

import { Gavel } from "lucide-react";
import { ProtectedVideo } from "./ProtectedMedia";

export default function AdvocacySection({
video,
}: {
video: string | null;
}) {
return (
<section className="bg-[#EAF3F8] py-16 sm:py-20">
<div className="max-w-7xl mx-auto px-6 lg:px-10">
<div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
{video && (
<div className="order-2 lg:order-1 relative aspect-video rounded-3xl overflow-hidden bg-forest shadow-[0_20px_60px_rgba(48,70,93,0.16)]">
<ProtectedVideo
src={video}
autoPlay
muted
loop
className="absolute inset-0 w-full h-full"
/>

          <div className="absolute top-5 left-5 z-20">
            <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-forest shadow-sm">
              Advocacy &amp; Protection
            </span>
          </div>
        </div>
      )}

      <div className="order-1 lg:order-2">
        <Gavel
          size={26}
          className="text-gold mb-4"
          strokeWidth={1.5}
        />

        <p className="eyebrow mb-2">
          Protecting the Community
        </p>

        <h2 className="font-display text-2xl sm:text-3xl text-forest mb-5">
          Protecting Puppies Through Advocacy &amp; Scam Prevention
        </h2>

        <div className="space-y-4 text-ink/75 leading-relaxed">
          <p>
            At Haven Paws, protecting puppies and the families who
            welcome them is one of our highest priorities. We actively
            work to prevent online pet scams, stay informed on animal
            welfare legislation, and collaborate with industry
            professionals to encourage responsible breeding practices.
          </p>

          <p>
            Our team carefully monitors health trends, partners with
            experienced veterinarians and ethical breeders, and promotes
            proven standards of care to help ensure every puppy is
            healthy, well-socialized, and raised in a safe environment.
          </p>

          <p>
            If you ever come across a suspicious puppy listing or believe
            you&apos;ve encountered a pet-related scam, please contact us
            so we can investigate and help protect other families.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

);
}