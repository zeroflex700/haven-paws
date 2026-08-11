import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about adopting a puppy through Haven Paws.",
  alternates: { canonical: "/faqs" },
};

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return children;
}