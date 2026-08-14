"use client";

import { useState } from "react";
import TakeMeHomeModal from "./TakeMeHomeModal";
import AbandonedCheckoutBanner from "./AbandonedCheckoutBanner";
import { useCheckoutRecovery } from "@/lib/hooks/useCheckoutRecovery";
import type { AppSettings } from "@/lib/queries/settings";

type Puppy = {
  id: string;
  name: string;
  breed: string;
  sex: "male" | "female";
  ageWeeks: number | null;
  price: number;
  depositAmount: number;
  coverImage: string | null;
  status: "available" | "reserved" | "sold";
};

const STATUS_MESSAGES: Record<string, string> = {
  reserved: "This puppy has been reserved by another family.",
  sold: "This puppy has already found its forever home.",
};

export default function PuppyBookingWidget({
  puppy,
  settings,
}: {
  puppy: Puppy;
  settings: AppSettings;
}) {
  const [open, setOpen] = useState(false);
  const [resumeStep, setResumeStep] = useState<number | null>(null);
  const { draft } = useCheckoutRecovery(puppy.id);
  const isAvailable = puppy.status === "available";

  function openModal(step?: number) {
    setResumeStep(step ?? null);
    setOpen(true);
  }

  if (!isAvailable) {
    return (
      <div className="mb-6">
        <div className="border border-sage/30 bg-cream-alt rounded-lg px-4 py-3 mb-3">
          <p className="text-sm text-ink/80">
            {STATUS_MESSAGES[puppy.status] ?? "This puppy is no longer available."}
          </p>
        </div>
        <a
          href="/puppies"
          className="block text-center border border-forest/30 text-forest px-4 py-2.5 rounded-full hover:border-forest transition-colors"
        >
          Browse Available Puppies
        </a>
      </div>
    );
  }

  return (
    <>
      <AbandonedCheckoutBanner
        puppyId={puppy.id}
        puppyName={puppy.name}
        onResume={() => openModal(draft?.step)}
      />

      <div className="flex gap-3 mb-6">
        <a
          href="#inquiry-form"
          className="flex-1 text-center border border-forest/30 text-forest px-4 py-2.5 rounded-full hover:border-forest transition-colors"
        >
          Reserve a Visit
        </a>
        <button
          onClick={() => openModal()}
          className="flex-1 text-center bg-forest text-cream px-4 py-2.5 rounded-full hover:bg-forest-light transition-colors"
        >
          Take Me Home
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sage/20 px-5 py-3 z-40 md:hidden">
        <button
          onClick={() => openModal()}
          className="w-full text-center bg-forest text-cream py-3 rounded-full hover:bg-forest-light transition-colors"
        >
          Take Me Home
        </button>
      </div>

      {open && (
        <TakeMeHomeModal
          puppy={puppy}
          settings={settings}
          initialStep={resumeStep ?? undefined}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}