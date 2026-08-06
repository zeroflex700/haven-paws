import type { BreederQualification } from "@/lib/queries/breeders";

export default function BreederQualificationsGrid({ items }: { items: BreederQualification[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="h2 mb-5">Breeder Qualifications</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="bg-forest/5 border border-forest/15 rounded-lg p-4">
            {item.badgeImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.badgeImageUrl} alt="" className="w-10 h-10 rounded-lg object-cover mb-2" />
            )}
            {item.labelLine && <p className="text-xs text-sage">{item.labelLine}</p>}
            {item.titleLine && <p className="text-sm text-forest font-medium">{item.titleLine}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}