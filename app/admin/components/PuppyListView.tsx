import Link from "next/link";

type AdminPuppy = {
  id: string;
  name: string;
  price: number;
  status: "available" | "reserved" | "sold";
  breeds: { name: string } | null;
};

export default function PuppyListView({ puppies }: { puppies: AdminPuppy[] }) {
  if (puppies.length === 0) {
    return <p className="text-sage">No puppies yet. Add your first one.</p>;
  }

  return (
    <div className="space-y-3">
      {puppies.map((p) => (
        <Link
          key={p.id}
          href={`/admin/puppies/${p.id}`}
          className="flex items-center justify-between bg-white border border-sage/20 rounded-lg px-4 py-3"
        >
          <div>
            <p className="text-forest font-medium">{p.name}</p>
            <p className="text-xs text-sage">{p.breeds?.name ?? "No breed"}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink">${Number(p.price).toLocaleString()}</p>
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                p.status === "available"
                  ? "bg-gold text-forest"
                  : p.status === "reserved"
                  ? "bg-sage text-cream"
                  : "border border-ink/30 text-ink/60"
              }`}
            >
              {p.status}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}