"use client";

import { useState, useTransition } from "react";
import { deleteReview } from "../reviews/actions";

export default function DeleteReviewButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(() => deleteReview(id));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`text-sm ${confirming ? "text-red-600" : "text-red-400"}`}
    >
      {confirming ? "Tap again to confirm" : "Delete"}
    </button>
  );
}