import Link from "next/link";
import { Video } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import FavoriteButton from "./FavoriteButton";

type Status = "available" | "reserved" | "sold";

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
}) {
  return (
    <Link
      href={`/puppies/${id}`}
      className="block min-w-0 group"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-alt">
        <OptimizedImage
          src={image}
          alt={name}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
          className="transition-transform duration-300 group-hover:scale-105"
        />



        {/* Status */}
        {status !== "available" && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] uppercase tracking-wider text-ink">
            {status}
          </span>
        )}

        {/* Video indicator */}
        {hasVideo && (
          <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60">
            <Video
              size={12}
              className="text-white"
              aria-hidden="true"
            />
          </span>
        )}
      </div>

      <p className="mt-1.5 text-[11px] text-sage">
        {breed}
      </p>

      <p className="inline-block border-b border-gold/60 text-sm font-medium text-forest">
        {name}
      </p>

      <p className="mt-0.5 text-xs capitalize text-ink/70">
        {sex}
        {ageWeeks !== null
          ? ` · ${ageWeeks} weeks`
          : ""}
      </p>

      <p className="text-[11px] text-ink/60">
        {readyLabel}
      </p>
    </Link>
  );
}