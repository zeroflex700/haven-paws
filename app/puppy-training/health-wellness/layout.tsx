import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health & Wellness",
  alternates: { canonical: "/puppy-training/health-wellness" },
};

export default function HealthWellnessLayout({ children }: { children: React.ReactNode }) {
  return children;
}