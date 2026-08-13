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
      color: "text-[#1A1F71]",
    },
    {
      name: "Mastercard",
      icon: FaCcMastercard,
      color: "text-[#EB001B]",
    },
    {
      name: "Amex",
      icon: FaCcAmex,
      color: "text-[#2E77BC]",
    },
    {
      name: "PayPal",
      icon: FaCcPaypal,
      color: "text-[#003087]",
    },
    {
      name: "Apple Pay",
      icon: FaCcApplePay,
      color: "text-white",
    },
    {
      name: "Google Pay",
      icon: FaGooglePay,
      color: "text-[#4285F4]",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      {/* Secure payments heading */}
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

      {/* Payment methods */}
      <div className="flex flex-wrap gap-2">
        {methods.map(({ name, icon: Icon, color }) => (
          <span
            key={name}
            className="flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-xs text-white/80"
          >
            <Icon
              size={20}
              className={`${color} shrink-0`}
              aria-hidden="true"
            />

            <span>{name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}