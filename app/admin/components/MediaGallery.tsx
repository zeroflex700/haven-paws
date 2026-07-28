"use client";

import { useTransition } from "react";
import { ChevronUp, ChevronDown, Star, Trash2 } from "lucide-react";
import { deleteMedia, setCover, moveMedia } from "../puppies/media-actions";
import type { MediaItem } from "@/lib/queries/media";

export default function MediaGallery({
  puppyId,
  media,
}: {
  puppyId: string;
  media: MediaItem[];
}) {
  const [isPending, startTransition] = useTransition();

  if (media.length === 0) {
    return <p className="text-sage">No media uploaded yet.</p>;
  }

  return (
    <div className="space-y-3">
      {media.map((m, i) => (
        <div
          key={m.id}
          className="flex items-center gap-3 bg-white border border-sage/20 rounded-lg p-3"
        >
          <div className="w-16 h-16 rounded-md overflow-hidden bg-cream-alt shrink-0">
            {m.media_type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <video src={m.url} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="flex-1">
            {m.is_cover && (
              <span className="text-[10px] uppercase tracking-wider text-gold">
                Cover Photo
              </span>
            )}
            <p className="text-xs text-sage capitalize">{m.media_type}</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={i === 0 || isPending}
              onClick={() =>
                startTransition(() => moveMedia(puppyId, m.id, m.sort_order, "up"))
              }
              className="p-1.5 text-sage disabled:opacity-30"
            >
              <ChevronUp size={18} />
            </button>
            <button
              disabled={i === media.length - 1 || isPending}
              onClick={() =>
                startTransition(() => moveMedia(puppyId, m.id, m.sort_order, "down"))
              }
              className="p-1.5 text-sage disabled:opacity-30"
            >
              <ChevronDown size={18} />
            </button>
            <button
              disabled={m.is_cover || isPending}
              onClick={() => startTransition(() => setCover(puppyId, m.id))}
              className="p-1.5 text-gold disabled:opacity-30"
            >
              <Star size={18} />
            </button>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => deleteMedia(puppyId, m.id))}
              className="p-1.5 text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}