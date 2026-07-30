"use client";

import { useState } from "react";
import { X, User, Truck, Heart, CreditCard, ChevronDown } from "lucide-react";
import { cldOptimized } from "@/lib/cloudinary";
import { submitTakeMeHome } from "../puppies/[id]/checkout-actions";
import CheckoutSummarySheet from "./CheckoutSummarySheet";
import type { AppSettings } from "@/lib/queries/settings";

type Puppy = {
  id: string;
  name: string;
  breed: string;
  sex: "male" | "female";
  ageWeeks: number | null;
  price: number;
  depositAmount: number;
  coverImage: string | null;
};

const STEPS = [
  { key: "details", label: "Details", icon: User },
  { key: "delivery", label: "Delivery", icon: Truck },
  { key: "essentials", label: "Essentials", icon: Heart },
  { key: "payment", label: "Payment", icon: CreditCard },
];

export default function TakeMeHomeModal({
  puppy,
  settings,
  onClose,
}: {
  puppy: Puppy;
  settings: AppSettings;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    over18: false,
    deliveryMethod: "pickup" as "pickup" | "delivery",
    starterKit: false,
    healthGuarantee: false,
    paymentType: "deposit" as "deposit" | "full",
  });

  const deliveryCost = form.deliveryMethod === "delivery" ? settings.deliveryFee : 0;
  const essentialsCost =
    (form.starterKit ? settings.starterKitPrice : 0) +
    (form.healthGuarantee ? settings.healthGuaranteePrice : 0);
  const subtotal = puppy.price + deliveryCost + essentialsCost;
  const hasDeposit = puppy.depositAmount > 0;
  const dueNow = form.paymentType === "deposit" && hasDeposit ? puppy.depositAmount : subtotal;

  const lineItems = [
    { label: puppy.name, amount: puppy.price },
    ...(deliveryCost > 0 ? [{ label: "Delivery", amount: deliveryCost }] : []),
    ...(form.starterKit ? [{ label: "Starter Care Kit", amount: settings.starterKitPrice }] : []),
    ...(form.healthGuarantee
      ? [{ label: "Extended Health Guarantee", amount: settings.healthGuaranteePrice }]
      : []),
  ];

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const canContinueDetails =
    form.email && form.firstName && form.lastName && form.phone && form.address && form.city && form.state && form.zip && form.over18;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const essentials: string[] = [];
      if (form.starterKit) essentials.push("Starter Care Kit");
      if (form.healthGuarantee) essentials.push("Extended Health Guarantee");

      const result = await submitTakeMeHome(puppy.id, puppy.name, {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        apt: form.apt,
        city: form.city,
        state: form.state,
        zip: form.zip,
        deliveryMethod: form.deliveryMethod,
        essentials,
        paymentType: hasDeposit ? form.paymentType : "full",
        amount: dueNow,
      });

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      setDone(true);
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-gold";

  return (
    <div className="fixed inset-0 z-[70] bg-cream overflow-y-auto">
      <div className="max-w-lg mx-auto min-h-screen pb-10">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-display text-lg text-forest">Haven Paws</span>
          <button onClick={onClose} aria-label="Close">
            <X size={22} className="text-ink" />
          </button>
        </div>

        <div className="px-5">
          {puppy.coverImage && (
            <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cldOptimized(puppy.coverImage, 200)}
                alt={puppy.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="font-display text-2xl text-forest text-center mb-2">
            Let&apos;s bring {puppy.name} home!
          </h1>

          <button
            onClick={() => setShowSummary(true)}
            className="flex items-center justify-center gap-2 mx-auto text-sm text-ink/80 mb-6"
          >
            Show summary:{" "}
            <span className="underline font-medium">${subtotal.toLocaleString()}</span>
            <ChevronDown size={16} />
          </button>

          {!done && (
            <div className="flex justify-between mb-8">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const active = i === step;
                const complete = i < step;
                return (
                  <div key={s.key} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        active || complete ? "bg-forest text-cream" : "bg-cream-alt text-sage"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <span className={`text-[10px] ${active ? "text-forest" : "text-sage"}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {done ? (
            <div className="text-center py-10">
              <h2 className="font-display text-xl text-forest mb-3">Request received!</h2>
              <p className="text-ink/80 leading-relaxed mb-6">
                Thank you for choosing {puppy.name}. Our concierge team will reach out within
                24 hours with a secure payment link — you&apos;ll be able to pay by card or PayPal.
              </p>
              <button
                onClick={onClose}
                className="bg-forest text-cream px-6 py-2.5 rounded-full hover:bg-forest-light"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {step === 0 && (
                <div>
                  <h2 className="font-display text-lg text-forest mb-1">Contact details</h2>
                  <p className="text-sm text-ink/70 mb-4">
                    Tell us a bit about yourself so we can ensure {puppy.name} finds a safe,
                    happy home.
                  </p>
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={`${inputClass} mb-3`}
                  />
                  <div className="flex gap-3 mb-3">
                    <input
                      placeholder="First name"
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <input
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={`${inputClass} mb-3`}
                  />
                  <p className="text-xs text-sage mb-3">
                    Full address is needed for {puppy.name}&apos;s health certificate and to
                    determine delivery options.
                  </p>
                  <input
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className={`${inputClass} mb-3`}
                  />
                  <input
                    placeholder="Apartment/Unit (optional)"
                    value={form.apt}
                    onChange={(e) => update("apt", e.target.value)}
                    className={`${inputClass} mb-3`}
                  />
                  <input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={`${inputClass} mb-3`}
                  />
                  <div className="flex gap-3 mb-4">
                    <input
                      placeholder="State"
                      value={form.state}
                      onChange={(e) => update("state", e.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder="Zip Code"
                      value={form.zip}
                      onChange={(e) => update("zip", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-ink/80 mb-6">
                    <input
                      type="checkbox"
                      checked={form.over18}
                      onChange={(e) => update("over18", e.target.checked)}
                      className="w-4 h-4"
                    />
                    I confirm I am at least 18 years old
                  </label>
                  <button
                    disabled={!canContinueDetails}
                    onClick={() => setStep(1)}
                    className="w-full bg-forest text-cream py-3 rounded-full hover:bg-forest-light disabled:opacity-40"
                  >
                    Continue to delivery options
                  </button>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="font-display text-lg text-forest mb-1">Delivery</h2>
                  <p className="text-sm text-ink/70 mb-4">
                    How would you like to bring {puppy.name} home?
                  </p>

                  <button
                    onClick={() => update("deliveryMethod", "pickup")}
                    className={`w-full text-left border rounded-lg p-4 mb-3 ${
                      form.deliveryMethod === "pickup" ? "border-gold bg-cream-alt" : "border-sage/30"
                    }`}
                  >
                    <p className="text-forest font-medium">Local Pickup</p>
                    <p className="text-sm text-ink/70">Meet us in person — free</p>
                  </button>

                  <button
                    onClick={() => update("deliveryMethod", "delivery")}
                    className={`w-full text-left border rounded-lg p-4 mb-6 ${
                      form.deliveryMethod === "delivery" ? "border-gold bg-cream-alt" : "border-sage/30"
                    }`}
                  >
                    <p className="text-forest font-medium">Nationwide Delivery</p>
                    <p className="text-sm text-ink/70">
                      Door-to-door delivery — ${settings.deliveryFee.toLocaleString()}
                    </p>
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(0)}
                      className="flex-1 border border-sage/30 text-forest py-3 rounded-full"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 bg-forest text-cream py-3 rounded-full hover:bg-forest-light"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-display text-lg text-forest mb-1">Essentials</h2>
                  <p className="text-sm text-ink/70 mb-4">
                    Optional add-ons to make homecoming easier — entirely up to you.
                  </p>

                  <label className="flex items-start gap-3 border border-sage/30 rounded-lg p-4 mb-3">
                    <input
                      type="checkbox"
                      checked={form.starterKit}
                      onChange={(e) => update("starterKit", e.target.checked)}
                      className="w-4 h-4 mt-0.5"
                    />
                    <div>
                      <p className="text-forest font-medium">Starter Care Kit</p>
                      <p className="text-sm text-ink/70">
                        Bed, leash, ID tag, and chew toy — ${settings.starterKitPrice.toLocaleString()}
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 border border-sage/30 rounded-lg p-4 mb-3">
                    <input
                      type="checkbox"
                      checked={form.healthGuarantee}
                      onChange={(e) => update("healthGuarantee", e.target.checked)}
                      className="w-4 h-4 mt-0.5"
                    />
                    <div>
                      <p className="text-forest font-medium">Extended Health Guarantee</p>
                      <p className="text-sm text-ink/70">
                        2-year coverage beyond our standard guarantee — $
                        {settings.healthGuaranteePrice.toLocaleString()}
                      </p>
                    </div>
                  </label>

                  <div className="border border-gold/30 bg-cream-alt rounded-lg p-4 mb-6">
                    <p className="text-sm text-forest font-medium">
                      Included free: Digital Puppy Care Guide
                    </p>
                    <p className="text-xs text-ink/70">
                      Feeding, training, and health tips — sent to your email automatically.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 border border-sage/30 text-forest py-3 rounded-full"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-forest text-cream py-3 rounded-full hover:bg-forest-light"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-display text-lg text-forest mb-4">Payment</h2>

                  <div className="border border-sage/20 rounded-lg p-4 mb-6 text-sm space-y-1.5">
                    {lineItems.map((item) => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-ink/70">{item.label}</span>
                        <span className="text-ink">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-sage/20 font-medium">
                      <span className="text-forest">Total</span>
                      <span className="text-forest">${subtotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {hasDeposit && (
                    <div className="mb-6 space-y-3">
                      <button
                        onClick={() => update("paymentType", "deposit")}
                        className={`w-full text-left border rounded-lg p-4 ${
                          form.paymentType === "deposit" ? "border-gold bg-cream-alt" : "border-sage/30"
                        }`}
                      >
                        <p className="text-forest font-medium">
                          Pay Deposit — ${puppy.depositAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-ink/70">Reserve {puppy.name}, pay the rest later</p>
                      </button>
                      <button
                        onClick={() => update("paymentType", "full")}
                        className={`w-full text-left border rounded-lg p-4 ${
                          form.paymentType === "full" ? "border-gold bg-cream-alt" : "border-sage/30"
                        }`}
                      >
                        <p className="text-forest font-medium">Pay in Full — ${subtotal.toLocaleString()}</p>
                        <p className="text-sm text-ink/70">Complete the full amount now</p>
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-sage mb-6 text-center">
                    You&apos;ll securely pay by card or PayPal on the next screen.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 border border-sage/30 text-forest py-3 rounded-full"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 bg-forest text-cream py-3 rounded-full hover:bg-forest-light disabled:opacity-50"
                    >
                      {submitting ? "Processing..." : `Pay $${dueNow.toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showSummary && (
        <CheckoutSummarySheet
          puppyName={puppy.name}
          puppyBreed={puppy.breed}
          puppySex={puppy.sex}
          puppyAgeWeeks={puppy.ageWeeks}
          puppyId={puppy.id}
          coverImage={puppy.coverImage}
          lineItems={lineItems}
          subtotal={subtotal}
          supportPhone={settings.supportPhone}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}