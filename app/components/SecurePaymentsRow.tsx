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
    <div className="border-t border-white/10 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          {/* Security message */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck
                size={17}
                className="text-gold"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                Secure payments
              </p>

              <p className="text-xs text-white/50 mt-0.5">
                Your payment information is protected.
              </p>
            </div>
          </div>

          {/* Payment methods */}
          <div className="flex flex-wrap items-center gap-2">
            {methods.map(({ name, icon: Icon }) => (
              <div
                key={name}
                title={name}
                aria-label={name}
                className="h-9 min-w-11 px-2.5 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/[0.12] hover:border-white/20 hover:text-white transition-all duration-200"
              >
                <Icon
                  size={22}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}