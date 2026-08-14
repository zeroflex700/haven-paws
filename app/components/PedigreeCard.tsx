import Link from "next/link";
import { Video } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import FavoriteButton from "./FavoriteButton";
import CompareToggle from "./CompareToggle";

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
    <Link href={`/puppies/${id}`} className="block group">
      <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt relative transition-transform duration-200 group-active:scale-[0.98] group-hover:shadow-md">
        <OptimizedImage
          src={image}
          alt={name}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <FavoriteButton puppyId={id} size={14} />
        </div>
        <div className="absolute bottom-2 left-2">
          <CompareToggle puppyId={id} />
        </div>
        {status !== "available" && (
          <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-ink">
            {status}
          </span>
        )}
        {hasVideo && (
          <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
            <Video size={12} className="text-white" />
          </span>
        )}
      </div>
      <p className="text-[11px] text-sage mt-1.5">{breed}</p>
      <p className="text-sm text-forest font-medium border-b border-gold/60 inline-block">{name}</p>
      <p className="text-xs text-ink/70 capitalize mt-0.5">
        {sex}
        {ageWeeks !== null ? ` · ${ageWeeks} weeks` : ""}
      </p>
      <p className="text-[11px] text-ink/60">{readyLabel}</p>
    </Link>
  );
}