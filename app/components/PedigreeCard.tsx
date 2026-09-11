import Link from "next/link";
import { Video } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

type Status = "available" | "reserved" | "sold";

export default function PedigreeCard({
  id,
  name,
  breed,
  sex,
  price,
  ageWeeks,
  readyLabel,
  status,
  image,
  hasVideo,
}: {
  id: string;
  name: string;
  breed: string;
  sex: "male" | "female";
  price: number;
  ageWeeks: number | null;
  readyLabel: string;
  status: Status;
  image?: string | null;
  hasVideo?: boolean;
}) {
  return (
    <Link
      href={`/puppies/${id}`}
      className="block min-w-0 group"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-cream-alt">
        <OptimizedImage
          src={image}
          alt={name}
          sizes="(max-width: 640px) 32vw, (max-width: 1024px) 22vw, 16vw"
          className="transition-transform duration-300 group-hover:scale-105"
        />

        {/* Status — only shown when not simply available */}
        {status !== "available" && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] uppercase tracking-wider text-ink">
            {status}
          </span>
        )}

        {/* Video indicator */}
        {hasVideo && (
          <span className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/55">
            <Video
              size={10}
              className="text-white"
              aria-hidden="true"
            />
          </span>
        )}
      </div>

      {/* Caption — always below the image, never on top of it */}
      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[10px] uppercase tracking-wide text-sage">
            {breed}
          </p>

          <p className="truncate text-sm font-medium text-forest">
            {name}
          </p>
        </div>

        <p className="shrink-0 text-sm font-medium text-ink">
          ${price.toLocaleString()}
        </p>
      </div>

      <p className="mt-0.5 text-[11px] capitalize text-ink/55">
        {sex}
        {ageWeeks !== null
          ? ` · ${ageWeeks} weeks`
          : ""}
      </p>

      <p className="text-[11px] text-ink/45">
        {readyLabel}
      </p>
    </Link>
  );
}
