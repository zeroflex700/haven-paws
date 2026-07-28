type Status = "available" | "reserved" | "sold";

const statusColor: Record<Status, string> = {
  available: "bg-gold text-forest",
  reserved: "bg-sage text-cream",
  sold: "border border-ink/40 text-ink/60",
};

export default function PedigreeCard({
  name,
  breed,
  price,
  status,
  image,
}: {
  name: string;
  breed: string;
  price: number;
  status: Status;
  image?: string | null;
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-sage/20 relative">
      <div className="aspect-square bg-cream-alt flex items-center justify-center overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sage text-xs">Photo coming soon</span>
        )}
      </div>
      <span
        className={`absolute top-3 right-3 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${statusColor[status]}`}
      >
        {status}
      </span>
      <div className="p-4">
        <h3 className="font-display text-lg text-forest">{name}</h3>
        <p className="eyebrow mt-1 mb-3">{breed}</p>
        <div className="gold-rule mb-3" />
        <p className="text-ink font-medium">${price.toLocaleString()}</p>
      </div>
    </div>
  );
}