"use client";

import { useState } from "react";
import { submitInquiry } from "../puppies/[id]/inquiry-actions";

export default function InquiryForm({ puppyId, puppyName }: { puppyId: string; puppyName: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await submitInquiry(puppyId, formData);
    setLoading(false);
    setSubmitted(true);
  }

  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  if (submitted) {
    return (
      <div className="bg-cream-alt rounded-lg p-6 text-center">
        <p className="text-forest font-medium">Thank you for your interest in {puppyName}!</p>
        <p className="text-sm text-ink/70 mt-1">
          We&apos;ll be in touch shortly to arrange next steps.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="bg-white border border-sage/20 rounded-lg p-5">
      <h3 className="font-display text-lg text-forest mb-4">Inquire About {puppyName}</h3>

      <label className="block text-sm text-ink/80 mb-1">Your Name</label>
      <input name="name" required className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Email</label>
      <input name="email" type="email" required className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Phone (optional)</label>
      <input name="phone" className={`${inputClass} mb-3`} />

      <label className="block text-sm text-ink/80 mb-1">Message</label>
      <textarea name="message" rows={3} className={`${inputClass} mb-4`} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light transition-colors disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}