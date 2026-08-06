import { ICON_MAP, type IconKey } from "@/lib/breederIcons";
import type { BreederIconTextItem } from "@/lib/queries/breeders";

export default function BreederIconTextSection({
  title,
  items,
}: {
  title: string;
  items: BreederIconTextItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="h2 mb-5">{title}</h2>
      <div className="space-y-5">
        {items.map((item) => {
          const Icon = ICON_MAP[item.iconKey as IconKey] ?? ICON_MAP.paw_print;
          return (
            <div key={item.id} className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-cream-alt flex items-center justify-center shrink-0">
                <Icon size={16} className="text-gold" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-sm font-medium text-forest mb-0.5">{item.heading}</p>
                <p className="text-sm text-ink/70 leading-relaxed">{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}