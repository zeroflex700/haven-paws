"use client";

import { X, Phone } from "lucide-react";
import { cldOptimized } from "@/lib/cloudinary";

type LineItem = { label: string; amount: number };

export default function CheckoutSummarySheet({
  puppyName,
  puppyBreed,
  puppySex,
  puppyAgeWeeks,
  puppyId,
  coverImage,
  lineItems,
  subtotal,
  supportPhone,
  onClose,
}: {
  puppyName: string;
  puppyBreed: string;
  puppySex: "male" | "female";
  puppyAgeWeeks: number | null;
  puppyId: string;
  coverImage: string | null;
  lineItems: LineItem[];
  subtotal: number;
  supportPhone: string;
  onClose: () => void;
}) {
  const shortId = puppyId.slice(0, 6).toUpperCase();

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-end">
      <div className="w-full max-w-lg mx-auto bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-sage/20">
          <h2 className="font-display text-lg text-forest">Summary</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={22} className="text-ink" />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="flex gap-4 mb-5">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream-alt shrink-0">
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cldOptimized(coverImage, 200)}
                  alt={puppyName}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div>
              <p className="text-forest font-medium">{puppyName}</p>
              <p className="text-sm text-ink/70 capitalize">
                {puppySex}
                {puppyAgeWeeks !== null ? ` · ${puppyAgeWeeks} weeks` : ""}
              </p>
              <p className="text-sm text-ink/70">{puppyBreed}</p>
              <p className="text-sm text-sage">ID #{shortId}</p>
            </div>
          </div>

          <div className="border-t border-sage/20 pt-4 space-y-2 text-sm">
            {lineItems.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-ink/70">{item.label}</span>
                <span className="text-ink">${item.amount.toLocaleString()}</span>
              </div>
            ))}

            <div className="border-t border-sage/20 pt-2 mt-2 flex justify-between">
              <span className="text-ink/70">Subtotal</span>
              <span className="text-ink">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-ink/50">
              <span>Tax</span>
              <span>—</span>
            </div>
            <p className="text-xs text-sage">Calculated once essentials are confirmed</p>

            <div className="border-t border-sage/20 pt-3 mt-3 flex justify-between font-medium text-forest">
              <span>Total</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full border border-sage/30 text-forest py-3 rounded-full mt-6 hover:border-gold"
          >
            Close
          </button>

          {supportPhone && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-forest">
              <Phone size={14} />
              <span>
                Need Help? <a href={`tel:${supportPhone}`} className="underline">{supportPhone}</a>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}