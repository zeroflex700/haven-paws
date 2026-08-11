import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Program Hub",
  alternates: { canonical: "/puppy-training/hub" },
};

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return children;
}