import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessing the Program",
  alternates: { canonical: "/puppy-training/access" },
};

export default function AccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}