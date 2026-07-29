import Link from "next/link";
import { Video } from "lucide-react";
import { cldOptimized } from "@/lib/cloudinary";

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
    <Link href={`/puppies/${id}`} className="block">
      <div className="aspect-square rounded-lg overflow-hidden bg-cream-alt relative">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cldOptimized(image, 500)}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sage text-xs">
            Photo coming soon
          </div>
        )}
        {status !== "available" && (
          <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/90 text-ink">
            {status}
          </span>
        )}
        {hasVideo && (
          <span className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
            <Video size={14} className="text-white" />
          </span>
        )}
      </div>
      <p className="text-xs text-sage mt-2">{breed}</p>
      <p className="text-forest font-medium border-b border-gold/60 inline-block">{name}</p>
      <p className="text-sm text-ink/70 capitalize mt-0.5">
        {sex}
        {ageWeeks !== null ? ` · ${ageWeeks} weeks` : ""}
      </p>
      <p className="text-xs text-ink/60">{readyLabel}</p>
    </Link>
  );
}