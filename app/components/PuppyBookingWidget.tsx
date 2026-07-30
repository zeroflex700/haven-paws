"use client";

import { useState } from "react";
import TakeMeHomeModal from "./TakeMeHomeModal";
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
};

export default function PuppyBookingWidget({
  puppy,
  settings,
}: {
  puppy: Puppy;
  settings: AppSettings;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3 mb-6">
        <a
          href="#inquiry-form"
          className="flex-1 text-center border border-forest/30 text-forest px-4 py-2.5 rounded-full hover:border-forest transition-colors"
        >
          Reserve a Visit
        </a>
        <button
          onClick={() => setOpen(true)}
          className="flex-1 text-center bg-forest text-cream px-4 py-2.5 rounded-full hover:bg-forest-light transition-colors"
        >
          Take Me Home
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sage/20 px-5 py-3 z-40 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="w-full text-center bg-forest text-cream py-3 rounded-full hover:bg-forest-light transition-colors"
        >
          Take Me Home
        </button>
      </div>

      {open && (
        <TakeMeHomeModal puppy={puppy} settings={settings} onClose={() => setOpen(false)} />
      )}
    </>
  );
}