"use client";

export default function StickyReserveBar({ puppyName }: { puppyName: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sage/20 px-5 py-3 z-40 md:hidden">
      <a
        href="#inquiry-form"
        className="block w-full text-center bg-forest text-cream py-3 rounded-full hover:bg-forest-light transition-colors"
      >
        Take Me Home
      </a>
    </div>
  );
}