import {
  HeartHandshake,
  PawPrint,
  HeartPulse,
  Gift,
  Award,
  BadgeCheck,
  CalendarCheck,
  Bone,
  Eye,
  Activity,
} from "lucide-react";

export const ICON_MAP = {
  heart_handshake: HeartHandshake,
  paw_print: PawPrint,
  heart_pulse: HeartPulse,
  gift: Gift,
  award: Award,
  badge_check: BadgeCheck,
  calendar_check: CalendarCheck,
  bone: Bone,
  eye: Eye,
  activity: Activity,
};

export type IconKey = keyof typeof ICON_MAP;

export const ICON_OPTIONS: { key: IconKey; label: string }[] = [
  { key: "award", label: "Award" },
  { key: "badge_check", label: "Badge / Certification" },
  { key: "calendar_check", label: "Membership / Since date" },
  { key: "bone", label: "Bone (hip/skeletal)" },
  { key: "eye", label: "Eye" },
  { key: "activity", label: "Activity / Heart" },
  { key: "heart_pulse", label: "Health pulse" },
  { key: "paw_print", label: "Paw print" },
];

export const CATEGORY_META: Record<
  string,
  { label: string; icon: IconKey; colorIndex: number }
> = {
  from_haven_paws: { label: "From Haven Paws", icon: "heart_handshake", colorIndex: 0 },
  enrichment_socialization: { label: "Enrichment & Socialization", icon: "paw_print", colorIndex: 1 },
  puppy_health_practices: { label: "Puppy Health Practices", icon: "heart_pulse", colorIndex: 2 },
  extras: { label: "Extras", icon: "gift", colorIndex: 3 },
};

export const CATEGORY_ORDER = [
  "from_haven_paws",
  "enrichment_socialization",
  "puppy_health_practices",
  "extras",
];