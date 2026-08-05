import {
  ShieldCheck,
  Cpu,
  UserCheck,
  Stethoscope,
  Syringe,
  FileText,
  Briefcase,
  PercentCircle,
  ClipboardList,
  ClipboardCheck,
  CreditCard,
} from "lucide-react";
import { ALL_INCLUDED_ITEMS, type IncludedItemKey } from "@/lib/includedItems";
import { getCategoryColor } from "@/lib/categoryColors";

const ICONS: Record<IncludedItemKey, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  health_commitment: ShieldCheck,
  microchip: Cpu,
  vetted_breeder: UserCheck,
  vet_health_check: Stethoscope,
  vaccinations: Syringe,
  vet_records: FileText,
  white_glove_delivery: Briefcase,
  pet_insurance_discount: PercentCircle,
  registration: ClipboardList,
  breeder_screening: ClipboardCheck,
  secure_payments: CreditCard,
};

export default function PuppyIncluded({ items }: { items: IncludedItemKey[] }) {
  const active = ALL_INCLUDED_ITEMS.filter((i) => items.includes(i.key));

  if (active.length === 0) return null;

  return (
    <div className="bg-cream-alt rounded-lg p-5 mt-6">
      <h3 className="font-display text-lg text-forest mb-3">What&apos;s included</h3>
      <ul className="space-y-2.5">
        {active.map(({ key, label }, i) => {
          const Icon = ICONS[key];
          return (
            <li key={key} className="flex items-center gap-2.5 text-sm">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${getCategoryColor(i)}`}>
                <Icon size={14} strokeWidth={1.5} />
              </span>
              <span className="text-ink/80">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}