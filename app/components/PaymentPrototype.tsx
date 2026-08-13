"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  ShieldCheck,
  ChevronDown,
  CreditCard,
  Landmark,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import { useCheckoutRecovery } from "@/lib/hooks/useCheckoutRecovery";

type LineItem = {
  label: string;
  amount: number;
};

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
];

/* --------------------------------
   Payment brand SVG logos
--------------------------------- */

function VisaLogo() {
  return (
    <svg
      viewBox="0 0 48 30"
      className="w-9 h-6"
      aria-label="Visa"
      role="img"
    >
      <rect width="48" height="30" rx="4" fill="#1A1F71" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fontStyle="italic"
        fill="white"
        fontFamily="Arial, sans-serif"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg
      viewBox="0 0 48 30"
      className="w-9 h-6"
      aria-label="Mastercard"
      role="img"
    >
      <rect width="48" height="30" rx="4" fill="white" />
      <circle cx="20" cy="15" r="8" fill="#EB001B" />
      <circle cx="28" cy="15" r="8" fill="#F79E1B" />
      <path
        d="M24 8.8a8 8 0 0 1 0 12.4 8 8 0 0 1 0-12.4Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function AmexLogo() {
  return (
    <svg
      viewBox="0 0 48 30"
      className="w-9 h-6"
      aria-label="American Express"
      role="img"
    >
      <rect width="48" height="30" rx="4" fill="#1677B9" />
      <text
        x="24"
        y="18.5"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="white"
        fontFamily="Arial, sans-serif"
      >
        AMEX
      </text>
    </svg>
  );
}

function DiscoverLogo() {
  return (
    <svg
      viewBox="0 0 48 30"
      className="w-9 h-6"
      aria-label="Discover"
      role="img"
    >
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="29"
        rx="4"
        fill="white"
        stroke="#D6D6D6"
      />

      <path
        d="M24 15c4.2-4.2 10.4-5.8 16-3.7-2.4 5.8-8 9.8-14.3 10.5-3.8.4-6.7-3.1-1.7-6.8Z"
        fill="#F26B21"
      />

      <text
        x="17"
        y="18"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        fill="#555"
        fontFamily="Arial, sans-serif"
      >
        DISC
      </text>
    </svg>
  );
}

function PaymentBrandLogos() {
  return (
    <div
      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1"
      aria-label="Accepted cards: Visa, Mastercard, American Express, Discover"
    >
      <VisaLogo />
      <MastercardLogo />
      <AmexLogo />
      <DiscoverLogo />
    </div>
  );
}

export default function PaymentPrototype({
  puppyId,
  puppyName,
  puppyImage,
  transactionTitle,
  nonRefundable,
  amount,
  lineItems,
  subtotal,
}: {
  puppyId: string;
  puppyName: string;
  puppyImage: string | null;
  transactionTitle: string;
  nonRefundable: boolean;
  amount: number;
  lineItems: LineItem[];
  subtotal: number;
}) {
  const router = useRouter();
  const { clear } = useCheckoutRecovery(puppyId);

  const [method, setMethod] = useState<"card" | "bank">("card");
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState("United States");
  const [message, setMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  function formatCardNumber(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);

    if (digits.length <= 2) {
      return digits;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  function handleContinue() {
    setSubmitting(true);

    // Simulated client-side only.
    // No network call and no card data ever leaves this component.
    setTimeout(() => {
      setSubmitting(false);
      setTestSuccess(true);
      clear();

      setTimeout(() => {
        router.push(
          `/account/your-puppy?checkout=success&puppy=${puppyId}&mode=test`
        );
      }, 1800);
    }, 900);
  }

  if (testSuccess) {
    return (
      <div className="max-w-md mx-auto px-6 pt-20 pb-32 text-center">
        <CheckCircle2
          size={40}
          className="text-gold mx-auto mb-4"
          strokeWidth={1.5}
        />

        <p className="font-display text-xl text-forest mb-2">
          Test Payment Successful
        </p>

        <p className="text-sm text-ink/70 leading-relaxed mb-1">
          This was a <strong>Test Mode / Prototype Payment</strong>. No real
          charge was made and no card details were collected or stored.
        </p>

        <p className="text-xs text-sage mt-4">
          Taking you to your account…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 pb-32">

      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <p className="font-display text-lg text-forest">
          Haven Paws
        </p>

        <p className="text-xs text-sage mt-2 leading-relaxed">
          This payment is for your reservation of {puppyName}. Review the
          details below before continuing.
        </p>
      </div>

      {/* Reservation summary */}
      <div className="bg-gold/10 border border-gold/30 rounded-2xl p-5 mb-6">

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-full overflow-hidden bg-cream-alt shrink-0">
              <OptimizedImage
                src={puppyImage}
                alt={puppyName}
                sizes="48px"
              />
            </div>

            <div>
              <p className="font-display text-base text-forest leading-tight">
                {transactionTitle}
              </p>

              {nonRefundable && (
                <span className="inline-block text-[10px] uppercase tracking-wider text-red-600 mt-1">
                  Non-refundable
                </span>
              )}
            </div>
          </div>

          <button
            aria-label="Edit reservation details"
            className="w-8 h-8 rounded-full bg-white border border-sage/30 flex items-center justify-center active:scale-90 transition-transform shrink-0"
          >
            <Pencil
              size={13}
              className="text-forest"
            />
          </button>
        </div>

        <div className="inline-flex items-center bg-forest text-cream text-lg font-medium px-4 py-2 rounded-full">
          ${amount.toLocaleString()}
        </div>

        <div className="mt-5 pt-4 border-t border-gold/20">

          <label className="block text-xs text-ink/70 mb-2">
            Personal message (optional)
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share anything you'd like your breeder to know..."
            rows={3}
            className="w-full bg-white border border-sage/30 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-gold resize-none"
          />
        </div>

        <div className="flex items-start gap-2 mt-4 text-[11px] text-ink/60">

          <ShieldCheck
            size={14}
            className="text-gold shrink-0 mt-0.5"
          />

          <p>
            For your safety, always complete puppy payments through Haven
            Paws&apos; checkout — never by wire transfer, gift card, or a
            direct request outside the platform.
          </p>
        </div>
      </div>

      {/* Payment method */}
      <p className="text-sm font-medium text-forest mb-3">
        Select payment method
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">

        <button
          onClick={() => setMethod("card")}
          className={`flex flex-col items-center gap-2 rounded-xl border-2 py-4 transition-colors ${
            method === "card"
              ? "border-gold bg-gold/10"
              : "border-sage/20 bg-white"
          }`}
        >
          <CreditCard
            size={20}
            className={
              method === "card"
                ? "text-forest"
                : "text-sage"
            }
            strokeWidth={1.5}
          />

          <span
            className={`text-sm ${
              method === "card"
                ? "text-forest font-medium"
                : "text-ink/70"
            }`}
          >
            Card
          </span>
        </button>

        <button
          onClick={() => setMethod("bank")}
          className={`flex flex-col items-center gap-2 rounded-xl border-2 py-4 transition-colors ${
            method === "bank"
              ? "border-gold bg-gold/10"
              : "border-sage/20 bg-white"
          }`}
        >
          <Landmark
            size={20}
            className={
              method === "bank"
                ? "text-forest"
                : "text-sage"
            }
            strokeWidth={1.5}
          />

          <span
            className={`text-sm ${
              method === "bank"
                ? "text-forest font-medium"
                : "text-ink/70"
            }`}
          >
            Bank account
          </span>
        </button>
      </div>

      {/* Card payment */}
      {method === "card" && (
        <div className="bg-white border border-sage/20 rounded-xl p-4 mb-6 space-y-3">

          {/* Card number */}
          <div>
            <label className="block text-xs text-ink/70 mb-1.5">
              Card number
            </label>

            <div className="relative">

              <input
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(
                    formatCardNumber(e.target.value)
                  )
                }
                placeholder="1234 1234 1234 1234"
                inputMode="numeric"
                autoComplete="cc-number"
                className="w-full border border-sage/30 rounded-xl pl-3.5 pr-[155px] py-3 text-xs sm:text-sm focus:outline-none focus:border-gold"
              />

              <PaymentBrandLogos />

            </div>
          </div>

          {/* Expiration + CVC */}
          <div className="flex gap-3">

            <div className="flex-1">
              <label className="block text-xs text-ink/70 mb-1.5">
                Expiration
              </label>

              <input
                value={expiry}
                onChange={(e) =>
                  setExpiry(
                    formatExpiry(e.target.value)
                  )
                }
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
                className="w-full border border-sage/30 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs text-ink/70 mb-1.5">
                Security code
              </label>

              <input
                value={cvc}
                onChange={(e) =>
                  setCvc(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4)
                  )
                }
                placeholder="CVC"
                inputMode="numeric"
                autoComplete="cc-csc"
                className="w-full border border-sage/30 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Country */}
          <div className="relative">

            <label className="block text-xs text-ink/70 mb-1.5">
              Country
            </label>

            <button
              type="button"
              onClick={() =>
                setCountryOpen(!countryOpen)
              }
              className="w-full flex items-center justify-between border border-sage/30 rounded-xl px-3.5 py-3 text-sm text-left"
            >
              {country}

              <ChevronDown
                size={16}
                className={`text-sage transition-transform duration-200 ${
                  countryOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {countryOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-sage/20 rounded-xl shadow-lg z-10 py-1">

                {COUNTRIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCountry(c);
                      setCountryOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-cream-alt"
                  >
                    {c}
                  </button>
                ))}

              </div>
            )}
          </div>
        </div>
      )}

      {/* Bank payment */}
      {method === "bank" && (
        <div className="bg-white border border-sage/20 rounded-xl p-5 mb-6 text-center">
          <p className="text-sm text-ink/70">
            Bank account payment details will appear here once this option is
            available.
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white border border-sage/20 rounded-xl p-4 mb-6">

        <p className="text-sm font-medium text-forest mb-3">
          Summary
        </p>

        <div className="space-y-2 text-sm">

          {lineItems.map((item) => (
            <div
              key={item.label}
              className="flex justify-between"
            >
              <span className="text-ink/70">
                {item.label}
              </span>

              <span className="text-ink">
                ${item.amount.toLocaleString()}
              </span>
            </div>
          ))}

          <div className="flex justify-between pt-2 border-t border-sage/15">

            <span className="text-ink/70">
              Subtotal
            </span>

            <span className="text-ink">
              ${subtotal.toLocaleString()}
            </span>

          </div>
        </div>

        <div className="flex justify-between items-center pt-3 mt-3 border-t border-sage/20">

          <span className="font-display text-base text-forest">
            Total due now
          </span>

          <span className="font-display text-xl text-forest">
            ${amount.toLocaleString()}
          </span>

        </div>
      </div>

      {/* Fixed payment button */}
      <div className="fixed bottom-0 left-0 right-0 bg-cream border-t border-sage/20 px-6 py-4">

        <div className="max-w-md mx-auto">

          <button
            onClick={handleContinue}
            disabled={submitting}
            className="w-full bg-forest text-cream py-3.5 rounded-full font-medium hover:bg-forest-light active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Processing...
              </>
            ) : (
              `Pay $${amount.toLocaleString()}`
            )}
          </button>

          <p className="text-[10px] text-sage text-center mt-2">
            Test Mode — no real payment will be charged.
          </p>

        </div>
      </div>
    </div>
  );
}