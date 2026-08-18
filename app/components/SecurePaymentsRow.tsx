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
      color: "text-black",
    },
    {
      name: "Google Pay",
      icon: FaGooglePay,
      color: "text-[#4285F4]",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="rounded-3xl border border-white/10 bg-[#193348] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.14)] sm:p-6 lg:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Security heading */}
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D9B75D]/25 bg-[#D9B75D]/10">
              <ShieldCheck
                size={21}
                className="text-[#D9B75D]"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Secure Payments
              </p>

              <p className="mt-1 max-w-sm text-xs leading-5 text-white/45">
                Your payment information is protected with secure payment
                processing.
              </p>
            </div>
          </div>

          {/* Payment methods */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-end">
            {methods.map(({ name, icon: Icon, color }) => (
              <span
                key={name}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#213F55] px-3 py-2.5 text-xs text-white/70 transition-colors hover:border-white/20 hover:bg-[#294A61] sm:min-w-[125px]"
              >
                <span className="flex h-6 w-8 items-center justify-center rounded bg-white px-1">
                  <Icon
                    size={22}
                    className={`${color} shrink-0`}
                    aria-hidden="true"
                  />
                </span>

                <span className="whitespace-nowrap">
                  {name}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}