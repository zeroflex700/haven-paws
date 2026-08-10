import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import MediaProtection from "./components/MediaProtection";
import TopLoadingBar from "./components/TopLoadingBar";
import ScrollToTop from "./components/ScrollToTop";
import SkipToContent from "./components/SkipToContent";
import PageTransition from "./components/PageTransition";
import BackToTopButton from "./components/BackToTopButton";

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

const SITE_URL = "https://haven-paws-pi.vercel.app";
const SITE_TITLE = "Haven Paws — A Curated Home for Every Puppy";
const SITE_DESCRIPTION =
  "Ethically bred, health-guaranteed puppies matched with families through a concierge adoption process.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Haven Paws",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Haven Paws",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
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
        <div id="main-content">
          <PageTransition>{children}</PageTransition>
        </div>
        <BackToTopButton />
      </body>
    </html>
  );
}