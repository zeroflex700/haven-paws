import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Breed Guides",
  description: "In-depth guides to dog breeds — temperament, health, grooming, exercise, and history.",
  alternates: { canonical: "/breed-guides" },
};

export default function BreedGuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}