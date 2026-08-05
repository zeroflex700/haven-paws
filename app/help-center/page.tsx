import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ProtectedImage } from "../components/ProtectedMedia";
import { getPageImages } from "@/lib/queries/pageContent";
import { PawPrint, Users } from "lucide-react";

export default async function HelpCenterPage() {
  const { heroImage, extraText } = await getPageImages("help-center");

  return (
    <main>
      <Navbar />

      <section className="relative">
        {heroImage ? (
          <div className="aspect-[4/3] sm:aspect-[16/7] overflow-hidden">
            <ProtectedImage src={heroImage} alt="Help Center" />
          </div>
        ) : (
          <div className="aspect-[4/3] sm:aspect-[16/7] bg-forest" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-forest/40">
          <h1 className="font-display text-3xl text-white text-center px-6">
            We&apos;re here to help
          </h1>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-14 text-center">
        <h2 className="font-display text-2xl text-forest mb-3">How can we help?</h2>
        {extraText.intro && <p className="text-ink/70 mb-6">{extraText.intro}</p>}
        <input
          placeholder="Ask a question..."
          className="w-full border border-sage/30 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-gold"
        />
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-14">
        <h3 className="font-display text-xl text-forest text-center mb-6">
          Choose the kind of help you need
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/puppies"
            className="bg-white border border-sage/20 rounded-lg p-6 text-center hover:border-gold"
          >
            <PawPrint size={24} className="text-gold mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-forest font-medium">I&apos;m looking for a puppy</p>
          </Link>
          <Link
            href="/contact#breeder-application"
            className="bg-white border border-sage/20 rounded-lg p-6 text-center hover:border-gold"
          >
            <Users size={24} className="text-gold mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-forest font-medium">I&apos;m a breeder</p>
          </Link>
        </div>
      </section>

      <section className="bg-cream-alt py-14 text-center">
        <div className="max-w-lg mx-auto px-6">
          <h3 className="font-display text-xl text-forest mb-4">
            Are you interested in joining our community of trusted breeders?
          </h3>
          <Link href="/contact#breeder-application" className="text-forest border-b border-gold pb-0.5">
            Join as Breeder →
          </Link>
        </div>
      </section>

      <section className="py-14 text-center">
        <div className="max-w-lg mx-auto px-6">
          <h3 className="font-display text-xl text-forest mb-4">Contact Haven Paws</h3>
          <Link
            href="/contact"
            className="inline-block bg-forest text-cream px-6 py-2.5 rounded-full hover:bg-forest-light transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}