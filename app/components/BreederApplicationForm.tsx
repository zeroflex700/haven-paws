"use client";

import { useState } from "react";
import { submitBreederApplication } from "../contact/breeder-actions";

export default function BreederApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await submitBreederApplication(formData);
    setLoading(false);
    setSubmitted(true);
  }

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  if (submitted) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-forest font-medium">Application received!</p>
        <p className="text-sm text-ink/70 mt-1">
          Our Breeder Relations team will review your application and follow up soon.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-lg p-5">
      <label className="block text-sm text-ink/80 mb-1">Full Name</label>
      <input name="full_name" required className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Email</label>
      <input name="email" type="email" required className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Phone</label>
      <input name="phone" className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Location</label>
      <input name="location" placeholder="City, State" className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Breeds You Raise</label>
      <input name="breeds" className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Years Breeding</label>
      <input name="years_breeding" className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Tell Us About Your Program</label>
      <textarea name="message" rows={4} className={`${inputClass} mb-4`} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}