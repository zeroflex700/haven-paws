import { ShieldCheck, LockKeyhole } from "lucide-react";
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
    <section className="border-y border-white/10 bg-[#263D53]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Trust message */}
          <div className="flex items-start gap-3 max-w-sm">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 border border-gold/25">
              <ShieldCheck
                size={18}
                className="text-gold"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-white">
                  Secure &amp; protected
                </h3>

                <LockKeyhole
                  size={12}
                  className="text-white/45"
                  strokeWidth={1.7}
                />
              </div>

              <p className="text-xs leading-relaxed text-white/55">
                Your payments are handled securely with trusted payment
                providers.
              </p>
            </div>
          </div>

          {/* Payment methods */}
          <div className="flex flex-wrap items-center gap-2">
            {methods.map(({ name, icon: Icon, color }) => (
              <span
                key={name}
                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  border border-white/10
                  bg-white/[0.06]
                  px-3 py-2
                  text-xs text-white/65
                  transition-colors duration-200
                  hover:border-white/20
                  hover:bg-white/[0.09]
                "
              >
                <Icon
                  size={20}
                  className={`${color} shrink-0`}
                  aria-hidden="true"
                />

                <span className="hidden sm:inline">{name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}