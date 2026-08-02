import { Zap, Building2, Users, Gem, Wind, Shuffle } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  active: Zap,
  apartment: Building2,
  family: Users,
  teacup: Gem,
  allergy: Wind,
  doodle: Shuffle,
};

export default function LifestyleIcon({ categoryKey }: { categoryKey: string }) {
  const Icon = ICONS[categoryKey] ?? Zap;
  return (
    <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center">
      <Icon size={22} className="text-gold" strokeWidth={1.5} />
    </div>
  );
}