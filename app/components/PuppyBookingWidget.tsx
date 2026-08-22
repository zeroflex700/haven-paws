"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle } from "lucide-react";

import TakeMeHomeModal from "./TakeMeHomeModal";
import AbandonedCheckoutBanner from "./AbandonedCheckoutBanner";
import { useCheckoutRecovery } from "@/lib/hooks/useCheckoutRecovery";
import { supabase } from "@/lib/supabase/client";
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
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);

  const { draft } = useCheckoutRecovery(puppy.id);

  const isAvailable = puppy.status === "available";

  function openModal(step?: number) {
    setResumeStep(step ?? null);
    setOpen(true);
  }

  async function handleMessageBreeder() {
    if (isStartingConversation) return;

    setMessageError(null);
    setIsStartingConversation(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        const returnTo =
          typeof window !== "undefined"
            ? `${window.location.pathname}${window.location.search}`
            : `/puppies/${puppy.id}`;

        window.location.href =
          `/account/login?redirectTo=${encodeURIComponent(returnTo)}`;

        return;
      }

      const { data, error } = await supabase.rpc(
        "get_or_create_conversation",
        {
          p_puppy_id: puppy.id,
        }
      );

      if (error) {
        throw error;
      }

      if (!data || typeof data !== "string") {
        throw new Error(
          "We couldn't start your conversation. Please try again."
        );
      }

      window.location.href = `/account/messages/${data}`;
    } catch (error) {
      console.error(
        "Failed to start breeder conversation:",
        error
      );

      setMessageError(
        "We couldn't start your conversation right now. Please try again."
      );
    } finally {
      setIsStartingConversation(false);
    }
  }

  if (!isAvailable) {
    return (
      <div className="mb-6">
        <div className="border border-sage/30 bg-cream-alt rounded-lg px-4 py-3 mb-3">
          <p className="text-sm text-ink/80">
            {STATUS_MESSAGES[puppy.status] ??
              "This puppy is no longer available."}
          </p>
        </div>

        <Link
          href="/puppies"
          className="block text-center border border-forest/30 text-forest px-4 py-2.5 rounded-full hover:border-forest transition-colors"
        >
          Browse Available Puppies
        </Link>
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

      <div className="space-y-3 mb-6">
        <div className="flex gap-3">
          <a
            href="#inquiry-form"
            className="flex-1 text-center border border-forest/30 text-forest px-4 py-2.5 rounded-full hover:border-forest transition-colors"
          >
            Reserve a Visit
          </a>

          <button
            type="button"
            onClick={() => openModal()}
            className="flex-1 text-center bg-forest text-cream px-4 py-2.5 rounded-full hover:bg-forest-light transition-colors"
          >
            Take Me Home
          </button>
        </div>

        <button
          type="button"
          onClick={handleMessageBreeder}
          disabled={isStartingConversation}
          className="w-full inline-flex items-center justify-center gap-2 border border-forest/20 bg-white text-forest px-4 py-2.5 rounded-full hover:border-forest/40 hover:bg-cream-alt transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MessageCircle
            size={16}
            strokeWidth={1.8}
          />

          <span>
            {isStartingConversation
              ? "Opening conversation..."
              : "Message Breeder"}
          </span>
        </button>

        {messageError && (
          <p
            className="text-xs text-red-600 text-center"
            role="alert"
          >
            {messageError}
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sage/20 px-5 py-3 z-40 md:hidden">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleMessageBreeder}
            disabled={isStartingConversation}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-forest/20 text-forest py-3 rounded-full hover:bg-cream-alt transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <MessageCircle
              size={16}
              strokeWidth={1.8}
            />

            <span className="text-sm">
              {isStartingConversation
                ? "Opening..."
                : "Message"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => openModal()}
            className="flex-[1.35] text-center bg-forest text-cream py-3 rounded-full hover:bg-forest-light transition-colors"
          >
            Take Me Home
          </button>
        </div>
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