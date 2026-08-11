import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Guides",
  alternates: { canonical: "/puppy-training/training-guides" },
};

export default function TrainingGuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}