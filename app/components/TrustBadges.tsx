import { ShieldCheck, Stethoscope, Truck, Heart } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Health Guaranteed" },
  { icon: Stethoscope, label: "Vet-Checked Bloodlines" },
  { icon: Heart, label: "Concierge Onboarding" },
  { icon: Truck, label: "Nationwide Delivery" },
];

export default function TrustBadges() {
  return (
    <section className="bg-cream-alt border-y border-sage/20 py-8">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon size={20} className="text-gold shrink-0" strokeWidth={1.5} />
            <span className="text-sm text-ink/80">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}