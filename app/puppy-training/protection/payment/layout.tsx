import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Protection",
  alternates: { canonical: "/puppy-training/protection/payment" },
};

export default function PaymentProtectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}