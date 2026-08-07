import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import { getPageImages } from "@/lib/queries/pageContent";

export default async function ProtectionPage() {
  const { extraText } = await getPageImages("puppy-training");
  const pricingLines = (extraText.protection_pricing ?? "").split("\n").filter(Boolean);

  return (
    <main>
      <Navbar />
      <PageContainer className="max-w-2xl py-8">
        <h1 className="h1 mb-1">Looking for a Puppy</h1>
        <p className="small-text mb-2">Understand what&apos;s included when you reserve.</p>
        <Link href="/puppy-training/access" className="text-sm text-sage underline">
          ← Back
        </Link>

        <h2 className="h2 mt-10 mb-3">Haven Paws Protection &amp; Support</h2>
        <p className="body-text mb-8">
          Protection &amp; Support is Haven Paws&apos; way of giving you added confidence when
          reserving a puppy — combining payment protection, dedicated support, and program
          discounts in one package.
        </p>

        <h3 className="text-forest font-medium text-sm mb-1">
          <Link href="/puppy-training/protection/payment" className="underline">
            Payment Protection
          </Link>
        </h3>
        <p className="small-text mb-6">Added safeguards around your deposit and final puppy payment.</p>

        <h3 className="text-forest font-medium text-sm mb-1">Support</h3>
        <p className="small-text mb-6">Direct access to our team before, during, and after your puppy comes home.</p>

        <h3 className="text-forest font-medium text-sm mb-1">Puppy Training &amp; Product Discounts</h3>
        <p className="small-text mb-8">Access to the Puppy Training Program plus savings on select puppy essentials.</p>

        <h2 className="h2 mb-4">How much does Protection &amp; Support cost?</h2>
        {pricingLines.length > 0 ? (
          <ul className="list-disc pl-5 text-sm text-ink/80 space-y-1 mb-4">
            {pricingLines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="small-text mb-4">Pricing details coming soon.</p>
        )}
        <p className="small-text mb-10">A processing fee may apply depending on your selected payment method.</p>

        <h3 className="h3 mb-3">Related</h3>
        <div className="space-y-2">
          <Link href="/puppy-training/protection/payment" className="block text-sm text-forest border-b border-gold pb-0.5 w-fit">
            Payment Protection Details
          </Link>
          <Link href="/contact" className="block text-sm text-forest border-b border-gold pb-0.5 w-fit">
            Contact Support
          </Link>
        </div>
      </PageContainer>
      <Footer />
    </main>
  );
}