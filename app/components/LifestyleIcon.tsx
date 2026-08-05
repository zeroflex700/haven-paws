import { Zap, Building2, Users, Gem, Wind, Shuffle } from "lucide-react";
import { getCategoryColor } from "@/lib/categoryColors";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  active: Zap,
  apartment: Building2,
  family: Users,
  teacup: Gem,
  allergy: Wind,
  doodle: Shuffle,
};

const ORDER = ["active", "apartment", "family", "teacup", "allergy", "doodle"];

export default function LifestyleIcon({ categoryKey }: { categoryKey: string }) {
  const Icon = ICONS[categoryKey] ?? Zap;
  const colorClass = getCategoryColor(ORDER.indexOf(categoryKey));
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
      <Icon size={22} strokeWidth={1.5} />
    </div>
  );
}