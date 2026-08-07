import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import { PawPrint } from "lucide-react";

export default function AccessProgramPage() {
  return (
    <main>
      <Navbar />
      <PageContainer className="max-w-2xl py-8">
        <PawPrint size={20} className="text-gold mb-3" strokeWidth={1.5} />
        <h1 className="h1 mb-1">Looking for a Puppy</h1>
        <p className="small-text mb-2">Find your companion, then unlock the full Puppy Training Program.</p>
        <Link href="/puppy-training" className="text-sm text-sage underline">
          ← Back
        </Link>

        <h2 className="h2 mt-10 mb-3">Accessing the Puppy Training Program</h2>
        <p className="body-text mb-6">
          The Puppy Training Program becomes available once your puppy&apos;s reservation is
          complete. Here&apos;s how it works:
        </p>

        <ol className="space-y-4 mb-10">
          <li className="flex gap-3">
            <span className="font-display text-lg text-gold">1</span>
            <span className="text-sm text-ink/80">Connect with a breeder for your chosen puppy.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-lg text-gold">2</span>
            <span className="text-sm text-ink/80">
              Complete your payment on Haven Paws{" "}
              <Link href="/puppy-training/protection" className="text-forest underline">
                with Protection &amp; Support
              </Link>
              .
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-lg text-gold">3</span>
            <span className="text-sm text-ink/80">Receive access to the program by email.</span>
          </li>
        </ol>

        <h3 className="h3 mb-3">Related</h3>
        <div className="space-y-2 mb-10">
          <Link href="/puppy-training/hub" className="block text-sm text-forest border-b border-gold pb-0.5 w-fit">
            Explore the Program Hub
          </Link>
          <Link href="/faqs" className="block text-sm text-forest border-b border-gold pb-0.5 w-fit">
            Frequently Asked Questions
          </Link>
        </div>

        <div className="bg-cream-alt rounded-lg p-5 mb-4">
          <h3 className="h3 mb-2">Still need help?</h3>
          <Link
            href="/contact"
            className="inline-block bg-forest text-cream px-5 py-2 rounded-full text-sm hover:bg-forest-light"
          >
            Contact Support
          </Link>
        </div>
        <p className="small-text">
          For questions about a specific puppy, you can also reach out to your breeder directly
          through the puppy&apos;s inquiry form.
        </p>
      </PageContainer>
      <Footer />
    </main>
  );
}