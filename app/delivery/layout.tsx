import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Programs",
  description: "Explore Haven Paws' delivery options — home delivery, meet nearby, priority express, or pickup near the breeder.",
  alternates: { canonical: "/delivery" },
};

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return children;
}