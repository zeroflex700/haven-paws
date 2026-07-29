"use client";

import { useTransition, useState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { togglePublished, deletePuppy } from "../puppies/toggle-actions";

export default function PuppyRowActions({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(() => deletePuppy(id));
  }

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => togglePublished(id, isPublished))}
        className="p-1.5 text-sage"
        title={isPublished ? "Unpublish" : "Publish"}
      >
        {isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
      <button
        disabled={isPending}
        onClick={handleDelete}
        className={`p-1.5 ${confirming ? "text-red-600" : "text-red-400"}`}
        title={confirming ? "Tap again to confirm delete" : "Delete"}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}