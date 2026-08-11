import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Breeder Standards",
  description: "How Haven Paws vets, screens, and holds every breeder in our network to strict health and ethical standards.",
  alternates: { canonical: "/breeder-standards" },
};

export default function BreederStandardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}