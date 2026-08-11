import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore by Lifestyle",
  description: "Find the right dog breed for your lifestyle — active, apartment-friendly, family, teacup, allergy-friendly, and doodle breeds.",
  alternates: { canonical: "/lifestyle" },
};

export default function LifestyleLayout({ children }: { children: React.ReactNode }) {
  return children;
}