"use client";

import { useState, useTransition } from "react";
import { Archive, ArchiveRestore } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminConversationArchiveButton({
  conversationId,
  isArchived,
}: {
  conversationId: string;
  isArchived: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(isArchived);
  const router = useRouter();

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const next = !optimistic;
    setOptimistic(next);

    const { error } = await supabase
      .from("conversations")
      .update({ archived_at: next ? new Date().toISOString() : null })
      .eq("id", conversationId);

    if (error) {
      setOptimistic(!next);
      console.error("Failed to toggle archive:", error);
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={optimistic ? "Unarchive conversation" : "Archive conversation"}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage/15 bg-white text-ink/40 transition hover:border-forest/25 hover:text-forest disabled:opacity-50"
    >
      {optimistic ? <ArchiveRestore size={14} /> : <Archive size={14} />}
    </button>
  );
}