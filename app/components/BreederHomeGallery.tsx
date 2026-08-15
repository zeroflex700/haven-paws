import { Home } from "lucide-react";
import { ProtectedImage } from "./ProtectedMedia";
import type { BreederHomePhoto } from "@/lib/queries/breeders";

export default function BreederHomeGallery({
  title,
  photos,
}: {
  title: string;
  photos: BreederHomePhoto[];
}) {
  if (photos.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Home
          size={16}
          className="text-gold"
          strokeWidth={1.5}
        />

        <h2 className="h2">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {photos.slice(0, 4).map((photo, index) => (
          <div
            key={photo.id}
            className={`relative overflow-hidden rounded-lg bg-cream-alt ${
              index === 0
                ? "col-span-2 aspect-video"
                : "aspect-video"
            }`}
          >
            <ProtectedImage
              src={photo.imageUrl}
              alt={title}
            />

            {index === 3 && photos.length > 4 && (
              <div className="absolute inset-0 bg-forest/60 flex items-center justify-center text-cream text-sm font-medium">
                +{photos.length - 4} more
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}