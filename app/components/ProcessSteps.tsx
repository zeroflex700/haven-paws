"use client";

import { ProtectedVideo } from "./ProtectedMedia";

type Step = {
number: number;
title: string;
description: string;
video: string | null;
};

export default function ProcessSteps({ steps }: { steps: Step[] }) {
return (
<div className="space-y-12">
{steps.map((step) => (
<article
key={step.number}
className="rounded-3xl border border-sage/15 bg-white overflow-hidden shadow-[0_12px_40px_rgba(48,70,93,0.07)]"
>
{step.video && (
<div className="relative aspect-video bg-forest overflow-hidden">
<ProtectedVideo
src={step.video}
autoPlay
muted
loop
className="absolute inset-0 w-full h-full"
/>

          <div className="absolute top-4 left-4 z-20">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-forest font-semibold shadow-lg">
              {step.number}
            </span>
          </div>
        </div>
      )}

      <div className="p-6 sm:p-7">
        <p className="eyebrow mb-2">
          Step {String(step.number).padStart(2, "0")}
        </p>

        <h3 className="font-display text-xl text-forest mb-3">
          {step.title}
        </h3>

        <p className="text-ink/75 leading-relaxed">
          {step.description}
        </p>
      </div>
    </article>
  ))}
</div>

);
}