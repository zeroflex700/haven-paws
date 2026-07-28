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
}: {
  name: string;
  breed: string;
  price: string;
  status: Status;
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-sage/20 relative">
      <div className="aspect-square bg-cream-alt flex items-center justify-center">
        <span className="text-sage text-xs">Photo</span>
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
        <p className="text-ink font-medium">{price}</p>
      </div>
    </div>
  );
}