"use client";

import { useState, useTransition } from "react";
import { deleteBoardMember } from "../board/actions";

export default function DeleteBoardMemberButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(() => deleteBoardMember(id));
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