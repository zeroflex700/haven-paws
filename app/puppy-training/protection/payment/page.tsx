import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import PageContainer from "../../../components/PageContainer";

export default function PaymentProtectionPage() {
  return (
    <main>
      <Navbar />
      <PageContainer className="max-w-2xl py-8">
        <Link href="/puppy-training/protection" className="text-sm text-sage underline">
          ← Back
        </Link>

        <h1 className="h1 mt-4 mb-6">Haven Paws Payment Protection</h1>
        <p className="body-text mb-8">
          Payment Protection is designed to give you added confidence when paying for your
          puppy through Haven Paws, covering eligible situations that may arise during the
          reservation process.
        </p>

        <h2 className="h3 mb-2">What&apos;s Covered</h2>

        <h3 className="text-forest font-medium text-sm mb-1 mt-4">For Deposit Payments</h3>
        <ul className="list-disc pl-5 text-sm text-ink/80 space-y-1 mb-4">
          <li>Reimbursement if a breeder is unable to fulfill a confirmed reservation</li>
          <li>Support resolving payment discrepancies reported promptly</li>
        </ul>

        <h3 className="text-forest font-medium text-sm mb-1">For Final Puppy Payments</h3>
        <ul className="list-disc pl-5 text-sm text-ink/80 space-y-1 mb-4">
          <li>Protection against payments made outside the verified Haven Paws checkout</li>
          <li>Assistance if a puppy&apos;s condition significantly differs from its listing</li>
        </ul>

        <h3 className="text-forest font-medium text-sm mb-1">Eligibility Requirements</h3>
        <ul className="list-disc pl-5 text-sm text-ink/80 space-y-1 mb-6">
          <li>Payment must be completed through Haven Paws&apos; checkout</li>
          <li>Issues must be reported within a reasonable time after they occur</li>
        </ul>

        <h2 className="h3 mb-2">What Payment Protection Does Not Cover</h2>
        <ul className="list-disc pl-5 text-sm text-ink/80 space-y-1 mb-8">
          <li>Payments made directly to a breeder outside of Haven Paws</li>
          <li>Buyer&apos;s remorse or changes in personal circumstances</li>
          <li>Delays caused by events outside Haven Paws&apos; control</li>
        </ul>

        <h2 className="h3 mb-3">Important Disclaimers</h2>

        <h3 className="text-forest font-medium text-sm mb-1">Your Responsibilities</h3>
        <ul className="list-disc pl-5 text-sm text-ink/80 space-y-1 mb-4">
          <li>Keep records of all communications and payments</li>
          <li>Report concerns as soon as they arise</li>
        </ul>

        <h3 className="text-forest font-medium text-sm mb-1">Coverage Limitations</h3>
        <ul className="list-disc pl-5 text-sm text-ink/80 space-y-1 mb-4">
          <li>Coverage amounts are limited to the payment made through Haven Paws</li>
        </ul>

        <h3 className="text-forest font-medium text-sm mb-1">Additional Information</h3>
        <ul className="list-disc pl-5 text-sm text-ink/80 space-y-1 mb-4">
          <li>Terms may be updated periodically; the current version always applies</li>
        </ul>

        <h3 className="text-forest font-medium text-sm mb-1">Haven Paws&apos; Role</h3>
        <ul className="list-disc pl-5 text-sm text-ink/80 space-y-1 mb-8">
          <li>Haven Paws facilitates resolution but does not guarantee a specific outcome</li>
        </ul>

        <h2 className="h3 mb-3">How to File a Claim</h2>
        <ol className="space-y-2 mb-6 text-sm text-ink/80">
          <li>1. Gather your payment confirmation and any related communication.</li>
          <li>
            2. Submit a{" "}
            <Link href="/contact" className="text-forest underline">
              claim form
            </Link>{" "}
            with your details.
          </li>
          <li>3. Our team will review and follow up within a few business days.</li>
        </ol>

        <p className="small-text">
          Last updated {new Date().getFullYear()}. Haven Paws reserves the right to modify this
          policy at any time.
        </p>
      </PageContainer>
      <Footer />
    </main>
  );
}