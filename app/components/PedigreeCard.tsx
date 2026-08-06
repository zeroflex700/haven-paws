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