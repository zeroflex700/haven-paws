import Link from "next/link";
import { cldOptimized } from "@/lib/cloudinary";

export default function BrowsePuppiesCard({
  breedName,
  image,
  count,
  avgPrice,
}: {
  breedName: string;
  image: string | null;
  count: number;
  avgPrice: number | null;
}) {
  return (
    <Link
      href={`/puppies?breed=${encodeURIComponent(breedName)}`}
      className="flex items-center gap-4 bg-white border border-sage/20 rounded-lg p-4 my-6"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-alt shrink-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cldOptimized(image, 200)} alt={breedName} className="w-full h-full object-cover" />
        ) : null}
      </div>
      <div>
        <p className="text-forest font-medium">
          {count}+ available {breedName} Puppies
        </p>
        {avgPrice && <p className="text-sm text-sage">Average price ${avgPrice.toLocaleString()}</p>}
      </div>
    </Link>
  );
}