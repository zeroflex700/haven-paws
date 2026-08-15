"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  User,
  Truck,
  Heart,
  CreditCard,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { cldOptimized } from "@/lib/cloudinary";
import { submitTakeMeHome } from "../puppies/[id]/checkout-actions";
import CheckoutSummarySheet from "./CheckoutSummarySheet";
import { useCheckoutRecovery } from "@/lib/hooks/useCheckoutRecovery";
import { estimateDeliveryWindow } from "@/lib/deliveryEstimate";
import { PAYMENT_TEST_MODE } from "@/lib/paymentConfig";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { useDismissableOverlay } from "@/lib/hooks/useDismissableOverlay";
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

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidPhone(v: string) {
  return v.replace(/\D/g, "").length >= 10;
}

function isValidZip(v: string) {
  return /^\d{5}(-\d{4})?$/.test(v.trim());
}

/*
 * Google Maps is loaded dynamically in the browser.
 * We intentionally do not declare Window.google here because
 * the project already includes Google Maps type declarations.
 */
type GoogleAutocompleteInstance = {
  addListener: (
    eventName: string,
    handler: () => void
  ) => { remove: () => void };
  getPlace: () => {
    formatted_address?: string;
    address_components?: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  };
};

export default function TakeMeHomeModal({
  puppy,
  settings,
  initialStep,
  onClose,
}: {
  puppy: Puppy;
  settings: AppSettings;
  initialStep?: number;
  onClose: () => void;
}) {
  const router = useRouter();

  const { draft, save, clear } = useCheckoutRecovery(puppy.id);

  const [step, setStep] = useState(initialStep ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /*
   * Google address autocomplete state.
   */
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef =
    useRef<GoogleAutocompleteInstance | null>(null);
  const autocompleteListenerRef =
    useRef<{ remove: () => void } | null>(null);

  const panelRef = useDismissableOverlay(true, onClose);

  useBodyScrollLock(true);

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

  /*
   * Restore checkout draft.
   */
  useEffect(() => {
    if (draft) {
      setForm((f) => ({
        ...f,
        email: draft.email ?? f.email,
        firstName: draft.firstName ?? f.firstName,
        lastName: draft.lastName ?? f.lastName,
        phone: draft.phone ?? f.phone,
        address: draft.address ?? f.address,
        city: draft.city ?? f.city,
        state: draft.state ?? f.state,
        zip: draft.zip ?? f.zip,
        deliveryMethod: draft.deliveryMethod ?? f.deliveryMethod,
        starterKit: draft.starterKit ?? f.starterKit,
        healthGuarantee:
          draft.healthGuarantee ?? f.healthGuarantee,
      }));

      if (
        typeof draft.step === "number" &&
        initialStep === undefined
      ) {
        setStep(draft.step);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Save checkout progress.
   */
  useEffect(() => {
    if (step === 0) return;

    save({
      step,
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      deliveryMethod: form.deliveryMethod,
      starterKit: form.starterKit,
      healthGuarantee: form.healthGuarantee,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /*
   * Load Google Maps Places library.
   *
   * Uses:
   * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   *
   * IMPORTANT:
   * We use the Google Maps typings already provided by the project.
   * We do not redeclare Window.google.
   */
  useEffect(() => {
    if (step !== 0) return;

    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error(
        "Google Maps autocomplete: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing."
      );
      return;
    }

    let cancelled = false;

    function initializeAutocomplete() {
      if (cancelled) return;

      const input = addressInputRef.current;

      if (!input) return;

      if (!window.google?.maps?.places?.Autocomplete) {
        console.error(
          "Google Maps Places Autocomplete is unavailable. Make sure the Maps JavaScript API and Places API are enabled."
        );
        return;
      }

      /*
       * Prevent creating multiple autocomplete instances.
       */
      if (autocompleteRef.current) return;

      autocompleteRef.current =
        new window.google.maps.places.Autocomplete(
          input,
          {
            /*
             * We are specifically looking for addresses.
             */
            types: ["address"],

            /*
             * This checkout uses ZIP codes and nationwide
             * delivery in the United States.
             */
            componentRestrictions: {
              country: "us",
            },

            /*
             * Request only the fields needed to populate
             * the checkout form.
             */
            fields: [
              "formatted_address",
              "address_components",
            ],
          }
        );

      autocompleteListenerRef.current =
        autocompleteRef.current.addListener(
          "place_changed",
          () => {
            const place =
              autocompleteRef.current?.getPlace();

            if (!place) return;

            const components =
              place.address_components ?? [];

            let streetNumber = "";
            let route = "";
            let city = "";
            let state = "";
            let zip = "";

            for (const component of components) {
              const types = component.types;

              if (types.includes("street_number")) {
                streetNumber = component.long_name;
              }

              if (types.includes("route")) {
                route = component.long_name;
              }

              /*
               * Google can return different locality types
               * depending on the address.
               */
              if (
                types.includes("locality") ||
                types.includes("postal_town") ||
                types.includes("sublocality")
              ) {
                if (!city) {
                  city = component.long_name;
                }
              }

              if (
                types.includes(
                  "administrative_area_level_1"
                )
              ) {
                state = component.short_name;
              }

              if (types.includes("postal_code")) {
                zip = component.long_name;
              }
            }

            /*
             * Prefer the clean street address assembled
             * from Google's individual components.
             */
            const streetAddress =
              [streetNumber, route]
                .filter(Boolean)
                .join(" ") ||
              place.formatted_address ||
              "";

            setForm((current) => ({
              ...current,
              address: streetAddress,
              city: city || current.city,
              state: state || current.state,
              zip: zip || current.zip,
            }));

            /*
             * Mark the address fields as completed.
             */
            setTouched((current) => ({
              ...current,
              address: true,
              city: true,
              state: true,
              zip: true,
            }));
          }
        );
    }

    /*
     * If Google Maps is already loaded by another component,
     * initialize immediately.
     */
    if (window.google?.maps?.places?.Autocomplete) {
      initializeAutocomplete();
    } else {
      /*
       * Check whether the Google Maps script is already present.
       */
      const existingScript = document.querySelector(
        'script[data-haven-paws-google-maps="true"]'
      ) as HTMLScriptElement | null;

      if (existingScript) {
        existingScript.addEventListener(
          "load",
          initializeAutocomplete
        );

        /*
         * The script may already have finished loading.
         */
        const checkInterval = window.setInterval(() => {
          if (
            window.google?.maps?.places?.Autocomplete
          ) {
            window.clearInterval(checkInterval);
            initializeAutocomplete();
          }
        }, 100);

        return () => {
          cancelled = true;
          window.clearInterval(checkInterval);
          existingScript.removeEventListener(
            "load",
            initializeAutocomplete
          );
        };
      }

      /*
       * Load Google Maps JavaScript API with Places.
       */
      const script = document.createElement("script");

      script.src =
        "https://maps.googleapis.com/maps/api/js" +
        `?key=${encodeURIComponent(apiKey)}` +
        "&loading=async" +
        "&libraries=places";

      script.async = true;
      script.defer = true;
      script.dataset.havenPawsGoogleMaps = "true";

      script.onload = initializeAutocomplete;

      script.onerror = () => {
        console.error(
          "Google Maps failed to load. Check your API key, billing, API restrictions, and enabled APIs."
        );
      };

      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;

      if (autocompleteListenerRef.current) {
        autocompleteListenerRef.current.remove();
        autocompleteListenerRef.current = null;
      }

      autocompleteRef.current = null;
    };
  }, [step]);

  const deliveryCost =
    form.deliveryMethod === "delivery"
      ? settings.deliveryFee
      : 0;

  const essentialsCost =
    (form.starterKit
      ? settings.starterKitPrice
      : 0) +
    (form.healthGuarantee
      ? settings.healthGuaranteePrice
      : 0);

  const subtotal =
    puppy.price + deliveryCost + essentialsCost;

  const hasDeposit = puppy.depositAmount > 0;

  const dueNow =
    form.paymentType === "deposit" && hasDeposit
      ? puppy.depositAmount
      : subtotal;

  const lineItems = [
    {
      label: puppy.name,
      amount: puppy.price,
    },
    ...(deliveryCost > 0
      ? [
          {
            label: "Delivery",
            amount: deliveryCost,
          },
        ]
      : []),
    ...(form.starterKit
      ? [
          {
            label: "Starter Care Kit",
            amount: settings.starterKitPrice,
          },
        ]
      : []),
    ...(form.healthGuarantee
      ? [
          {
            label: "Extended Health Guarantee",
            amount: settings.healthGuaranteePrice,
          },
        ]
      : []),
  ];

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((f) => ({
      ...f,
      [key]: value,
    }));
  }

  function markTouched(field: string) {
    setTouched((t) => ({
      ...t,
      [field]: true,
    }));
  }

  const emailError =
    touched.email &&
    form.email &&
    !isValidEmail(form.email)
      ? "Enter a valid email address"
      : null;

  const phoneError =
    touched.phone &&
    form.phone &&
    !isValidPhone(form.phone)
      ? "Enter a valid phone number"
      : null;

  const zipError =
    touched.zip &&
    form.zip &&
    !isValidZip(form.zip)
      ? "Enter a valid ZIP code"
      : null;

  const canContinueDetails =
    !!form.email &&
    isValidEmail(form.email) &&
    !!form.firstName &&
    !!form.lastName &&
    !!form.phone &&
    isValidPhone(form.phone) &&
    !!form.address &&
    !!form.city &&
    !!form.state &&
    !!form.zip &&
    isValidZip(form.zip) &&
    form.over18;

  function goToPaymentPrototype() {
    const params = new URLSearchParams({
      amount: String(dueNow),
      subtotal: String(subtotal),
      lineItems: JSON.stringify(lineItems),
    });

    router.push(
      `/payment-preview/${puppy.id}?${params.toString()}`
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const essentials: string[] = [];

      if (form.starterKit) {
        essentials.push("Starter Care Kit");
      }

      if (form.healthGuarantee) {
        essentials.push(
          "Extended Health Guarantee"
        );
      }

      const result = await submitTakeMeHome(
        puppy.id,
        puppy.name,
        {
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
          paymentType: hasDeposit
            ? form.paymentType
            : "full",
          amount: dueNow,
        }
      );

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      clear();
      setDone(true);
    } catch {
      setSubmitError(
        "Something went wrong submitting your reservation. Please try again."
      );
    }

    setSubmitting(false);
  }

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-gold";

  const errorInputClass =
    "w-full border border-red-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-red-400";

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Reserve your puppy"
      className="fixed inset-0 z-[70] bg-cream overflow-y-auto outline-none"
    >
      <div className="max-w-lg mx-auto min-h-screen pb-10">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-display text-lg text-forest">
            Haven Paws
          </span>

          <button
            onClick={onClose}
            aria-label="Close"
          >
            <X
              size={22}
              className="text-ink"
            />
          </button>
        </div>

        <div className="px-5">
          {puppy.coverImage && (
            <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cldOptimized(
                  puppy.coverImage,
                  200
                )}
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
            <span className="underline font-medium">
              ${subtotal.toLocaleString()}
            </span>
            <ChevronDown size={16} />
          </button>

          {!done && (
            <div className="flex justify-between mb-8">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const active = i === step;
                const complete = i < step;

                return (
                  <div
                    key={s.key}
                    className="flex flex-col items-center gap-1 flex-1"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        active || complete
                          ? "bg-forest text-cream"
                          : "bg-cream-alt text-sage"
                      }`}
                    >
                      <Icon size={16} />
                    </div>

                    <span
                      className={`text-[10px] ${
                        active
                          ? "text-forest"
                          : "text-sage"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {done ? (
            <div className="text-center py-10">
              <h2 className="font-display text-xl text-forest mb-3">
                Request received!
              </h2>

              <p className="text-ink/80 leading-relaxed mb-6">
                Thank you for choosing {puppy.name}. Our
                concierge team will reach out within 24
                hours with a secure payment link —
                you&apos;ll be able to pay by card or
                PayPal.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href="/account/your-puppy"
                  className="bg-forest text-cream px-6 py-2.5 rounded-full hover:bg-forest-light"
                >
                  Track Your Reservation
                </Link>

                <button
                  onClick={onClose}
                  className="text-sm text-sage underline"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {step === 0 && (
                <div>
                  <h2 className="font-display text-lg text-forest mb-1">
                    Contact details
                  </h2>

                  <p className="text-sm text-ink/70 mb-4">
                    Tell us a bit about yourself so we
                    can ensure {puppy.name} finds a safe,
                    happy home.
                  </p>

                  <input
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={(e) =>
                      update(
                        "email",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      markTouched("email")
                    }
                    className={`${
                      emailError
                        ? errorInputClass
                        : inputClass
                    } mb-1`}
                  />

                  {emailError && (
                    <p className="text-xs text-red-600 mb-2">
                      {emailError}
                    </p>
                  )}

                  <div className="flex gap-3 mb-3 mt-2">
                    <input
                      placeholder="First name"
                      aria-label="First name"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(e) =>
                        update(
                          "firstName",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />

                    <input
                      placeholder="Last name"
                      aria-label="Last name"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(e) =>
                        update(
                          "lastName",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <input
                    placeholder="Phone number"
                    aria-label="Phone number"
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) =>
                      update(
                        "phone",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      markTouched("phone")
                    }
                    className={`${
                      phoneError
                        ? errorInputClass
                        : inputClass
                    } mb-1`}
                  />

                  {phoneError && (
                    <p className="text-xs text-red-600 mb-2">
                      {phoneError}
                    </p>
                  )}

                  <p className="text-xs text-sage mb-3 mt-2">
                    Full address is needed for{" "}
                    {puppy.name}&apos;s health certificate
                    and to determine delivery options.
                  </p>

                  {/*
                   * ADDRESS AUTOCOMPLETE
                   *
                   * Google attaches autocomplete suggestions
                   * to this input after the Places library loads.
                   */}
                  <div className="relative">
                    <input
                      ref={addressInputRef}
                      placeholder="Start typing your address..."
                      aria-label="Street address"
                      autoComplete="off"
                      value={form.address}
                      onChange={(e) =>
                        update(
                          "address",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        markTouched("address")
                      }
                      className={`${inputClass} mb-3`}
                    />
                  </div>

                  <input
                    placeholder="Apartment/Unit (optional)"
                    aria-label="Apartment or unit"
                    autoComplete="address-line2"
                    value={form.apt}
                    onChange={(e) =>
                      update(
                        "apt",
                        e.target.value
                      )
                    }
                    className={`${inputClass} mb-3`}
                  />

                  <input
                    placeholder="City"
                    aria-label="City"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) =>
                      update(
                        "city",
                        e.target.value
                      )
                    }
                    className={`${inputClass} mb-3`}
                  />

                  <div className="grid grid-cols-2 gap-3 mb-1">
                    <input
                      placeholder="State"
                      aria-label="State"
                      autoComplete="address-level1"
                      value={form.state}
                      onChange={(e) =>
                        update(
                          "state",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />

                    <div className="min-w-0">
                      <input
                        placeholder="Zip Code"
                        aria-label="Zip code"
                        autoComplete="postal-code"
                        inputMode="numeric"
                        value={form.zip}
                        onChange={(e) =>
                          update(
                            "zip",
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          markTouched("zip")
                        }
                        className={`${
                          zipError
                            ? errorInputClass
                            : inputClass
                        } w-full`}
                      />

                      {zipError && (
                        <p className="text-xs text-red-600 mt-1">
                          {zipError}
                        </p>
                      )}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-ink/80 mb-6 mt-3">
                    <input
                      type="checkbox"
                      checked={form.over18}
                      onChange={(e) =>
                        update(
                          "over18",
                          e.target.checked
                        )
                      }
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
                  <h2 className="font-display text-lg text-forest mb-1">
                    Delivery
                  </h2>

                  <p className="text-sm text-ink/70 mb-4">
                    How would you like to bring{" "}
                    {puppy.name} home?
                  </p>

                  <button
                    onClick={() =>
                      update(
                        "deliveryMethod",
                        "pickup"
                      )
                    }
                    className={`w-full text-left border rounded-lg p-4 mb-3 ${
                      form.deliveryMethod ===
                      "pickup"
                        ? "border-gold bg-cream-alt"
                        : "border-sage/30"
                    }`}
                  >
                    <p className="text-forest font-medium">
                      Local Pickup
                    </p>

                    <p className="text-sm text-ink/70">
                      Meet us in person — free
                    </p>

                    <p className="text-xs text-sage mt-1">
                      Estimated ready window:{" "}
                      {estimateDeliveryWindow(
                        "pickup",
                        new Date().toISOString()
                      )}
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      update(
                        "deliveryMethod",
                        "delivery"
                      )
                    }
                    className={`w-full text-left border rounded-lg p-4 mb-6 ${
                      form.deliveryMethod ===
                      "delivery"
                        ? "border-gold bg-cream-alt"
                        : "border-sage/30"
                    }`}
                  >
                    <p className="text-forest font-medium">
                      Nationwide Delivery
                    </p>

                    <p className="text-sm text-ink/70">
                      Door-to-door delivery — $
                      {settings.deliveryFee.toLocaleString()}
                    </p>

                    <p className="text-xs text-sage mt-1">
                      Estimated arrival window:{" "}
                      {estimateDeliveryWindow(
                        "home",
                        new Date().toISOString()
                      )}
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
                  <h2 className="font-display text-lg text-forest mb-1">
                    Essentials
                  </h2>

                  <p className="text-sm text-ink/70 mb-4">
                    Optional add-ons to make homecoming
                    easier — entirely up to you.
                  </p>

                  <label className="flex items-start gap-3 border border-sage/30 rounded-lg p-4 mb-3">
                    <input
                      type="checkbox"
                      checked={form.starterKit}
                      onChange={(e) =>
                        update(
                          "starterKit",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 mt-0.5"
                    />

                    <div>
                      <p className="text-forest font-medium">
                        Starter Care Kit
                      </p>

                      <p className="text-sm text-ink/70">
                        Bed, leash, ID tag, and chew toy —
                        $
                        {settings.starterKitPrice.toLocaleString()}
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 border border-sage/30 rounded-lg p-4 mb-3">
                    <input
                      type="checkbox"
                      checked={form.healthGuarantee}
                      onChange={(e) =>
                        update(
                          "healthGuarantee",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 mt-0.5"
                    />

                    <div>
                      <p className="text-forest font-medium">
                        Extended Health Guarantee
                      </p>

                      <p className="text-sm text-ink/70">
                        2-year coverage beyond our standard
                        guarantee — $
                        {settings.healthGuaranteePrice.toLocaleString()}
                      </p>
                    </div>
                  </label>

                  <div className="border border-gold/30 bg-cream-alt rounded-lg p-4 mb-6">
                    <p className="text-sm text-forest font-medium">
                      Included free: Digital Puppy Care Guide
                    </p>

                    <p className="text-xs text-ink/70">
                      Feeding, training, and health tips —
                      sent to your email automatically.
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
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-display text-lg text-forest">
                      Payment
                    </h2>

                    {PAYMENT_TEST_MODE && (
                      <span className="text-[10px] uppercase tracking-wider bg-gold/15 text-forest px-2 py-0.5 rounded-full">
                        Test Mode
                      </span>
                    )}
                  </div>

                  <div className="border border-sage/20 rounded-lg p-4 mb-6 text-sm space-y-1.5">
                    {lineItems.map((item) => (
                      <div
                        key={item.label}
                        className="flex justify-between"
                      >
                        <span className="text-ink/70">
                          {item.label}
                        </span>

                        <span className="text-ink">
                          $
                          {item.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between pt-2 border-t border-sage/20 font-medium">
                      <span className="text-forest">
                        Total
                      </span>

                      <span className="text-forest">
                        ${subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {hasDeposit && (
                    <div className="mb-6 space-y-3">
                      <button
                        onClick={() =>
                          update(
                            "paymentType",
                            "deposit"
                          )
                        }
                        className={`w-full text-left border rounded-lg p-4 ${
                          form.paymentType ===
                          "deposit"
                            ? "border-gold bg-cream-alt"
                            : "border-sage/30"
                        }`}
                      >
                        <p className="text-forest font-medium">
                          Pay Deposit — $
                          {puppy.depositAmount.toLocaleString()}
                        </p>

                        <p className="text-sm text-ink/70">
                          Reserve {puppy.name}, pay the
                          rest later
                        </p>
                      </button>

                      <button
                        onClick={() =>
                          update(
                            "paymentType",
                            "full"
                          )
                        }
                        className={`w-full text-left border rounded-lg p-4 ${
                          form.paymentType ===
                          "full"
                            ? "border-gold bg-cream-alt"
                            : "border-sage/30"
                        }`}
                      >
                        <p className="text-forest font-medium">
                          Pay in Full — $
                          {subtotal.toLocaleString()}
                        </p>

                        <p className="text-sm text-ink/70">
                          Complete the full amount now
                        </p>
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-sage mb-4 text-center">
                    {PAYMENT_TEST_MODE
                      ? "You'll continue to a test payment screen — no real charge will be made."
                      : "You'll securely pay by card or PayPal on the next screen."}
                  </p>

                  {submitError && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <AlertCircle
                        size={15}
                        className="text-red-600 shrink-0 mt-0.5"
                      />

                      <p className="text-xs text-red-700">
                        {submitError}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 border border-sage/30 text-forest py-3 rounded-full"
                    >
                      Back
                    </button>

                    <button
                      onClick={
                        PAYMENT_TEST_MODE
                          ? goToPaymentPrototype
                          : handleSubmit
                      }
                      disabled={submitting}
                      className="flex-1 bg-forest text-cream py-3 rounded-full hover:bg-forest-light disabled:opacity-50"
                    >
                      {PAYMENT_TEST_MODE
                        ? `Continue — $${dueNow.toLocaleString()}`
                        : submitting
                        ? "Processing..."
                        : `Pay $${dueNow.toLocaleString()}`}
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