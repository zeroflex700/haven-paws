import Link from "next/link";
import { Video, ArrowUpRight } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

type Status = "available" | "reserved" | "sold";

const STATUS_STYLES: Record<Status, string> = {
  available: "",
  reserved: "bg-white/90 text-ink",
  sold: "bg-ink/80 text-white",
};

export default function PedigreeCard({
  id,
  name,
  breed,
  sex,
  ageWeeks,
  readyLabel,
  status,
  image,
  hasVideo,
  price,
}: {
  id: string;
  name: string;
  breed: string;
  sex: "male" | "female";
  ageWeeks: number | null;
  readyLabel: string;
  status: Status;
  image?: string | null;
  hasVideo?: boolean;
  price?: number;
}) {
  return (
    <Link
      href={`/puppies/${id}`}
      className="group block min-w-0"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-cream-alt shadow-[0_6px_20px_rgba(23,63,58,0.06)] transition-shadow duration-300 group-hover:shadow-[0_10px_30px_rgba(23,63,58,0.12)]">
        <OptimizedImage
          src={image}
          alt={name}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient for legible overlay text */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Status badge */}
        {status !== "available" && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider backdrop-blur-sm ${STATUS_STYLES[status]}`}
          >
            {status}
          </span>
        )}

        {/* Video indicator */}
        {hasVideo && (
          <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <Video
              size={12}
              className="text-white"
              aria-hidden="true"
            />
          </span>
        )}

        {/* Name set into the image */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
          <div className="flex items-end justify-between gap-2">
            <p className="font-display text-lg leading-tight text-white sm:text-xl">
              {name}
            </p>

            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:bg-gold group-hover:text-forest group-hover:opacity-100">
              <ArrowUpRight size={13} />
            </span>
          </div>
        </div>
      </div>

      {/* Secondary info below the image */}
      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-medium uppercase tracking-[0.1em] text-sage">
            {breed}
          </p>

          <p className="mt-0.5 text-xs capitalize text-ink/70">
            {sex}
            {ageWeeks !== null
              ? ` · ${ageWeeks} weeks`
              : ""}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-sage">
            {readyLabel}
          </p>
        </div>

        {typeof price === "number" && (
          <p className="shrink-0 text-sm font-medium text-forest">
            ${price.toLocaleString()}
          </p>
        )}
      </div>
    </Link>
  );
}
