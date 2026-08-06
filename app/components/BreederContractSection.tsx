import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { getContractTemplate } from "@/lib/breederContractTemplate";

export default function BreederContractSection({ breederName }: { breederName: string }) {
  return (
    <section className="mb-12">
      <h2 className="h2 mb-3">Contract &amp; health guarantee</h2>
      <p className="body-text mb-4">{getContractTemplate(breederName)}</p>
      <div className="flex items-center gap-2 text-xs text-sage mb-6">
        <Lock size={13} strokeWidth={1.5} />
        All contracts are handled securely through Haven Paws.
      </div>

      <Link
        href="/puppy-training/protection"
        className="block bg-cream-alt rounded-lg p-4 hover:border-gold border border-transparent"
      >
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={18} className="text-gold" strokeWidth={1.5} />
          <p className="text-forest font-medium text-sm">You&apos;re protected on Haven Paws</p>
        </div>
        <p className="text-xs text-ink/70">
          Payments and communication are protected every step of the way. Learn more →
        </p>
      </Link>
    </section>
  );
}