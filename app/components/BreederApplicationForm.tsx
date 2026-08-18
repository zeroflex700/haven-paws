"use client";

import { useState } from "react";
import { submitBreederApplication } from "../contact/breeder-actions";

export default function BreederApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    if (!agreed) {
      setError(
        "Please agree to the Breeder Membership Agreement, Terms of Use, and Privacy Policy to continue."
      );
      return;
    }

    setError("");
    setLoading(true);

    await submitBreederApplication(formData);

    setLoading(false);
    setSubmitted(true);
  }

  const inputClass =
    "w-full rounded-xl border border-sage/20 bg-cream-alt/35 px-4 py-3 text-sm text-ink placeholder:text-ink/35 outline-none transition-all duration-200 focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10";

  const labelClass =
    "block text-[11px] uppercase tracking-[0.12em] text-sage font-medium mb-2";

  if (submitted) {
    return (
      <div className="rounded-[28px] border border-sage/10 bg-white p-7 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.12)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-forest">
          <span className="text-2xl">✓</span>
        </div>

        <div className="text-center mt-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-sage font-semibold">
            Application received
          </p>

          <h3 className="font-display text-3xl sm:text-4xl text-forest mt-2">
            Thanks for applying to Haven Paws!
          </h3>

          <p className="text-sm sm:text-base text-ink/65 mt-4 leading-7 max-w-xl mx-auto">
            We&apos;ve received your application. Our Breeder Relations team
            will review your information and get back to you by phone or email
            within a few business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="rounded-[28px] border border-sage/10 bg-white text-ink shadow-[0_24px_80px_rgba(0,0,0,0.16)] overflow-hidden"
    >
      {/* ================================================================
          FORM HEADER
      ================================================================= */}

      <div className="border-b border-sage/10 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-sage font-semibold">
              Haven Paws
            </p>

            <h3 className="font-display text-2xl sm:text-3xl text-forest mt-2">
              Application Form
            </h3>

            <p className="text-sm text-ink/55 mt-2 leading-6 max-w-xl">
              Answer the questions below to help us learn about your breeding
              experience. A team member will follow up to validate additional
              details.
            </p>
          </div>

          <div className="hidden sm:flex shrink-0 h-11 w-11 rounded-2xl bg-cream-alt items-center justify-center text-forest">
            <span className="text-sm font-medium">01</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-8 sm:py-8 space-y-9">
        {/* ================================================================
            PERSONAL INFORMATION
        ================================================================= */}

        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-xl bg-forest text-gold flex items-center justify-center text-xs font-medium">
              01
            </div>

            <div>
              <h4 className="text-sm font-semibold text-forest">
                Your information
              </h4>

              <p className="text-[11px] text-sage mt-0.5">
                Tell us how to reach you.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                name="first_name"
                required
                autoComplete="given-name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Last Name</label>
              <input
                name="last_name"
                required
                autoComplete="family-name"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                name="phone"
                placeholder="e.g. 233-826-3333"
                required
                autoComplete="tel"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* ================================================================
            KENNEL / LOCATION
        ================================================================= */}

        <section className="border-t border-sage/10 pt-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-xl bg-cream-alt text-forest flex items-center justify-center text-xs font-medium">
              02
            </div>

            <div>
              <h4 className="text-sm font-semibold text-forest">
                Your program
              </h4>

              <p className="text-[11px] text-sage mt-0.5">
                Help us understand where your program operates.
              </p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Kennel Name</label>
            <input name="kennel_name" className={inputClass} />
          </div>

          <div className="mt-4">
            <label className={labelClass}>Street Address</label>
            <input name="street_address" className={inputClass} />
          </div>

          <div className="mt-4">
            <label className={labelClass}>Suite or Apt (Optional)</label>
            <input name="apt_suite" className={inputClass} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelClass}>City</label>
              <input name="city" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>State</label>
              <input name="state" className={inputClass} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelClass}>Zip</label>
              <input name="zip" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Country</label>
              <input
                name="country"
                defaultValue="United States"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* ================================================================
            EXPERIENCE
        ================================================================= */}

        <section className="border-t border-sage/10 pt-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-xl bg-cream-alt text-forest flex items-center justify-center text-xs font-medium">
              03
            </div>

            <div>
              <h4 className="text-sm font-semibold text-forest">
                Breeding experience
              </h4>

              <p className="text-[11px] text-sage mt-0.5">
                Share a little about your experience.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                What year did you start breeding?
              </label>
              <input
                name="start_year"
                placeholder="e.g. 2016"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                How many litters have you bred?
              </label>
              <input
                name="litters_bred"
                placeholder="e.g. 5"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass}>What breeds do you breed?</label>
            <input
              name="breeds"
              placeholder="e.g. Golden Retriever, Dachshund"
              className={inputClass}
            />
          </div>
        </section>

        {/* ================================================================
            LICENSING / PROGRAM DETAILS
        ================================================================= */}

        <section className="border-t border-sage/10 pt-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-xl bg-cream-alt text-forest flex items-center justify-center text-xs font-medium">
              04
            </div>

            <div>
              <h4 className="text-sm font-semibold text-forest">
                Program details
              </h4>

              <p className="text-[11px] text-sage mt-0.5">
                A few additional details about your breeding program.
              </p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Are you USDA Licensed?</label>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <label className="flex items-center gap-3 rounded-xl border border-sage/15 bg-cream-alt/30 px-4 py-3 text-sm text-ink/75 cursor-pointer hover:border-sage/30 transition-colors">
                <input
                  type="radio"
                  name="usda_licensed"
                  value="no"
                  defaultChecked
                  className="accent-forest"
                />
                No
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-sage/15 bg-cream-alt/30 px-4 py-3 text-sm text-ink/75 cursor-pointer hover:border-sage/30 transition-colors">
                <input
                  type="radio"
                  name="usda_licensed"
                  value="yes"
                  className="accent-forest"
                />
                Yes
              </label>
            </div>
          </div>

          <div className="mt-5">
            <label className={labelClass}>
              How many intact female dogs do you have in your breeding program?
            </label>

            <input
              name="female_dogs_count"
              type="number"
              min="0"
              className={inputClass}
            />
          </div>

          <div className="mt-5">
            <label className={labelClass}>
              Were any of your dogs in your breeding program purchased from
              Haven Paws?
            </label>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <label className="flex items-center gap-3 rounded-xl border border-sage/15 bg-cream-alt/30 px-4 py-3 text-sm text-ink/75 cursor-pointer hover:border-sage/30 transition-colors">
                <input
                  type="radio"
                  name="purchased_from_haven_paws"
                  value="no"
                  defaultChecked
                  className="accent-forest"
                />
                No
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-sage/15 bg-cream-alt/30 px-4 py-3 text-sm text-ink/75 cursor-pointer hover:border-sage/30 transition-colors">
                <input
                  type="radio"
                  name="purchased_from_haven_paws"
                  value="yes"
                  className="accent-forest"
                />
                Yes
              </label>
            </div>
          </div>
        </section>

        {/* ================================================================
            MESSAGE
        ================================================================= */}

        <section className="border-t border-sage/10 pt-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-xl bg-cream-alt text-forest flex items-center justify-center text-xs font-medium">
              05
            </div>

            <div>
              <h4 className="text-sm font-semibold text-forest">
                Tell us more
              </h4>

              <p className="text-[11px] text-sage mt-0.5">
                Optional, but useful for our review team.
              </p>
            </div>
          </div>

          <label className={labelClass}>
            Tell Us About Your Program (Optional)
          </label>

          <textarea
            name="message"
            rows={5}
            className={`${inputClass} resize-y min-h-[130px]`}
          />
        </section>

        {/* ================================================================
            AGREEMENT
        ================================================================= */}

        <section className="border-t border-sage/10 pt-7">
          <label className="flex items-start gap-3 rounded-2xl border border-sage/10 bg-cream-alt/45 p-4 cursor-pointer">
            <input
              type="checkbox"
              name="agreed_to_terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 mt-0.5 shrink-0 accent-forest"
            />

            <span className="text-xs sm:text-sm text-ink/65 leading-5">
              By checking this box, you agree to our Breeder Membership
              Agreement, Terms of Use, and Privacy Policy.
            </span>
          </label>

          {error && (
            <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <p className="text-sm text-red-600 leading-5">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-full bg-forest text-cream py-3.5 px-6 text-sm font-medium mt-5 transition-all duration-200 hover:bg-forest-light active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">
              {loading ? "Submitting..." : "Submit Application"}
            </span>
          </button>

          <p className="text-center text-[10px] text-sage mt-3">
            Your application will be reviewed by the Haven Paws team.
          </p>
        </section>
      </div>
    </form>
  );
}