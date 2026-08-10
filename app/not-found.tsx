import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageContainer from "./components/PageContainer";
import { PawPrint } from "lucide-react";

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <PageContainer className="max-w-lg py-20 text-center">
        <PawPrint size={28} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
        <h1 className="h1 mb-3">We couldn&apos;t find that page</h1>
        <p className="body-text mb-8">
          The page you&apos;re looking for may have moved or no longer exists. Let&apos;s get
          you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-forest text-cream text-sm px-6 py-2.5 rounded-full hover:bg-forest-light active:scale-95 transition-all"
          >
            Back to Home
          </Link>
          <Link
            href="/puppies"
            className="border border-forest/30 text-forest text-sm px-6 py-2.5 rounded-full hover:border-forest active:scale-95 transition-all"
          >
            Browse Puppies
          </Link>
        </div>
      </PageContainer>
      <Footer />
    </main>
  );
}