"use client";

import { useState, useTransition } from "react";

export default function DeleteGenericButton({
  id,
  onDelete,
}: {
  id: string;
  onDelete: (id: string) => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(() => onDelete(id));
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