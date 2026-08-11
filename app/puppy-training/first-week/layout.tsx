import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your First Week",
  alternates: { canonical: "/puppy-training/first-week" },
};

export default function FirstWeekLayout({ children }: { children: React.ReactNode }) {
  return children;
}