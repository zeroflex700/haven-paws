import { ShieldCheck } from "lucide-react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaCcApplePay,
  FaGooglePay,
} from "react-icons/fa6";

export default function SecurePaymentsRow() {
  const methods = [
    {
      name: "Visa",
      icon: FaCcVisa,
    },
    {
      name: "Mastercard",
      icon: FaCcMastercard,
    },
    {
      name: "Amex",
      icon: FaCcAmex,
    },
    {
      name: "PayPal",
      icon: FaCcPaypal,
    },
    {
      name: "Apple Pay",
      icon: FaCcApplePay,
    },
    {
      name: "Google Pay",
      icon: FaGooglePay,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <div className="flex items-center gap-2 mb-3 text-white/90">
        <ShieldCheck
          size={16}
          className="text-gold"
          strokeWidth={1.5}
        />

        <span className="text-sm font-medium">
          Secure Payments
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {methods.map(({ name, icon: Icon }) => (
          <span
            key={name}
            className="flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-xs text-white/80"
          >
            <Icon size={18} />
            <span>{name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}