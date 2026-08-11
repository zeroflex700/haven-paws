import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protection & Support",
  alternates: { canonical: "/puppy-training/protection" },
};

export default function ProtectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}