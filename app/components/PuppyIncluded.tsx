import { ShieldCheck, Stethoscope, FileCheck, Syringe, Truck } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Health guarantee" },
  { icon: Stethoscope, label: "Full veterinary health check" },
  { icon: Syringe, label: "Age-appropriate vaccinations" },
  { icon: FileCheck, label: "Complete health & vet records" },
  { icon: Truck, label: "White-glove delivery options" },
];

export default function PuppyIncluded() {
  return (
    <div className="bg-cream-alt rounded-lg p-5 mt-6">
      <h3 className="font-display text-lg text-forest mb-3">What's included</h3>
      <ul className="space-y-2">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-sm text-ink/80">
            <Icon size={16} className="text-gold shrink-0" strokeWidth={1.5} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}