import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import MediaProtection from "./components/MediaProtection";
import TopLoadingBar from "./components/TopLoadingBar";
import ScrollToTop from "./components/ScrollToTop";
import SkipToContent from "./components/SkipToContent";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Haven Paws — A Curated Home for Every Puppy",
  description:
    "Ethically bred, health-guaranteed puppies matched with families through a concierge adoption process.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body">
        <SkipToContent />
        <MediaProtection />
        <TopLoadingBar />
        <ScrollToTop />
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}