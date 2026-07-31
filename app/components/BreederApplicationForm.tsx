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
      setError("Please agree to the Breeder Membership Agreement, Terms of Use, and Privacy Policy to continue.");
      return;
    }
    setError("");
    setLoading(true);
    await submitBreederApplication(formData);
    setLoading(false);
    setSubmitted(true);
  }

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";
  const labelClass = "block text-sm text-ink/80 mb-1 mt-4";

  if (submitted) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-forest font-medium">Thanks for applying to Haven Paws!</p>
        <p className="text-sm text-ink/70 mt-2 leading-relaxed">
          We&apos;ve received your application. Our Breeder Relations team will review your
          information and get back to you by phone or email within a few business days.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-lg p-5">
      <h3 className="font-display text-lg text-forest mb-1">Application Form</h3>
      <p className="text-xs text-sage mb-4">
        Answer the questions below to help us learn about your breeding experience. A team
        member will follow up to validate additional details.
      </p>

      <label className="block text-sm text-ink/80 mb-1">First Name</label>
      <input name="first_name" required className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Last Name</label>
      <input name="last_name" required className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Email</label>
      <input name="email" type="email" required className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Phone Number</label>
      <input name="phone" placeholder="e.g. 233-826-3333" required className={`${inputClass} mb-3`} />

      <label className={labelClass}>Kennel Name</label>
      <input name="kennel_name" className={inputClass} />

      <label className={labelClass}>Street Address</label>
      <input name="street_address" className={inputClass} />

      <label className={labelClass}>Suite or Apt (Optional)</label>
      <input name="apt_suite" className={inputClass} />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <label className="block text-sm text-ink/80 mb-1">City</label>
          <input name="city" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-ink/80 mb-1">State</label>
          <input name="state" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <label className="block text-sm text-ink/80 mb-1">Zip</label>
          <input name="zip" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-ink/80 mb-1">Country</label>
          <input name="country" defaultValue="United States" className={inputClass} />
        </div>
      </div>

      <label className={labelClass}>What year did you start breeding?</label>
      <input name="start_year" placeholder="e.g. 2016" className={inputClass} />

      <label className={labelClass}>How many litters have you bred?</label>
      <input name="litters_bred" placeholder="e.g. 5" className={inputClass} />

      <label className={labelClass}>What breeds do you breed?</label>
      <input name="breeds" placeholder="e.g. Golden Retriever, Dachshund" className={inputClass} />

      <label className={labelClass}>Are you USDA Licensed?</label>
      <div className="flex gap-4 mt-1">
        <label className="flex items-center gap-1.5 text-sm text-ink/80">
          <input type="radio" name="usda_licensed" value="no" defaultChecked /> No
        </label>
        <label className="flex items-center gap-1.5 text-sm text-ink/80">
          <input type="radio" name="usda_licensed" value="yes" /> Yes
        </label>
      </div>

      <label className={labelClass}>
        How many intact female dogs do you have in your breeding program?
      </label>
      <input name="female_dogs_count" type="number" min="0" className={inputClass} />

      <label className={labelClass}>
        Were any of your dogs in your breeding program purchased from Haven Paws?
      </label>
      <div className="flex gap-4 mt-1">
        <label className="flex items-center gap-1.5 text-sm text-ink/80">
          <input type="radio" name="purchased_from_haven_paws" value="no" defaultChecked /> No
        </label>
        <label className="flex items-center gap-1.5 text-sm text-ink/80">
          <input type="radio" name="purchased_from_haven_paws" value="yes" /> Yes
        </label>
      </div>

      <label className={labelClass}>Tell Us About Your Program (Optional)</label>
      <textarea name="message" rows={4} className={inputClass} />

      <label className="flex items-start gap-2 text-sm text-ink/80 mt-5">
        <input
          type="checkbox"
          name="agreed_to_terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-4 h-4 mt-0.5"
        />
        <span>
          By checking this box, you agree to our Breeder Membership Agreement, Terms of
          Use, and Privacy Policy.
        </span>
      </label>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light transition-colors disabled:opacity-50 mt-5"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}