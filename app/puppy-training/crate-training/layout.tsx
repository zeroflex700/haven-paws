import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crate Training",
  alternates: { canonical: "/puppy-training/crate-training" },
};

export default function CrateTrainingLayout({ children }: { children: React.ReactNode }) {
  return children;
}