import { Camera } from "lucide-react";
import { ProtectedImage } from "./ProtectedMedia";
import type { BreederPhoto } from "@/lib/queries/breeders";

export default function BreederPhotoStrip({ breederName, photos }: { breederName: string; photos: BreederPhoto[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Camera size={16} className="text-gold" strokeWidth={1.5} />
        <h2 className="h2">{breederName}&apos;s photos</h2>
      </div>
      <div
        className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {photos.map((p) => (
          <div
            key={p.id}
            className="w-40 h-52 shrink-0 rounded-lg overflow-hidden"
            style={{ scrollSnapAlign: "start" }}
          >
            <ProtectedImage src={p.imageUrl} alt={breederName} />
          </div>
        ))}
      </div>
    </section>
  );
}