import { Truck, Home } from "lucide-react";

export default function DeliveryInfo() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <div className="bg-white border border-gold/30 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <Truck size={20} className="text-gold" strokeWidth={1.5} />
          <h3 className="font-display text-lg text-forest">Bringing your puppy home</h3>
        </div>
        <p className="text-sm text-ink/80 leading-relaxed mb-3">
          Once your puppy has completed their veterinary health check and is
          fully ready, we&apos;ll coordinate delivery timing directly with you.
          Depending on your location, we offer in-person pickup or
          white-glove delivery options.
        </p>
        <div className="flex items-center gap-2 text-sm text-forest">
          <Home size={16} strokeWidth={1.5} />
          Reach out via the inquiry form for delivery timing and options.
        </div>
      </div>
    </section>
  );
}