import { ShieldCheck, CreditCard, Wallet } from "lucide-react";

export default function SecurePaymentsRow() {
  const methods = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Google Pay"];

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <div className="flex items-center gap-2 mb-3 text-white/90">
        <ShieldCheck size={16} className="text-gold" strokeWidth={1.5} />
        <span className="text-sm font-medium">Secure Payments</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {methods.map((m) => (
          <span
            key={m}
            className="flex items-center gap-1.5 text-xs text-white/80 border border-white/15 rounded-md px-2.5 py-1.5"
          >
            {m === "PayPal" || m === "Apple Pay" || m === "Google Pay" ? (
              <Wallet size={12} />
            ) : (
              <CreditCard size={12} />
            )}
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}