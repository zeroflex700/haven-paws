"use client";

export default function StickyReserveBar({
  price,
  status,
}: {
  price: number;
  status: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sage/20 px-5 py-3 flex items-center justify-between z-40 md:hidden">
      <div>
        <p className="text-xs text-sage uppercase tracking-wider">{status}</p>
        <p className="text-lg text-forest font-medium">${price.toLocaleString()}</p>
      </div>
      <a
        href="#inquiry-form"
        className="bg-forest text-cream px-6 py-2.5 rounded-full text-sm hover:bg-forest-light transition-colors"
      >
        Inquire Now
      </a>
    </div>
  );
}