"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { ProtectedImage } from "./ProtectedMedia";

interface Tier {
  id: string;
  title: string;
  tagline: string;
  price: string;
  imageKey: string;
  body: string[];
  whatToBring?: string[];
  note?: { heading: string; text: string };
}

const TIERS: Tier[] = [
  {
    id: "home-delivery",
    title: "Home Delivery",
    tagline: "Convenient delivery to your door",
    price: "$300",
    imageKey: "tier-home-delivery",
    body: [
      "Skip the travel — our trusted transportation partners bring your puppy safely from the breeder's door to yours.",
      "Once your reservation is confirmed, we'll send an estimated delivery window within about 72 hours, with a more detailed schedule shared as your date approaches.",
      "For every puppy's safety, travel can only begin once they're at least 8 weeks old. Puppies under 2.5 lbs may need to stay with their breeder a little longer, until around 12 weeks, in line with standard transport safety guidance.",
      "Most Home Deliveries are completed within 2–4 weeks, depending on your puppy's age, veterinary clearance, and route scheduling.",
    ],
  },
  {
    id: "meet-location",
    title: "Meet Near Your Location",
    tagline: "A flexible delivery option",
    price: "$150",
    imageKey: "tier-meet-location",
    body: [
      "Prefer a shorter trip? We'll arrange for your puppy to be brought to a convenient meeting point near you — typically between 20 minutes and 2 hours from your home.",
      "After your reservation is confirmed, you'll receive an estimated delivery week within about 72 hours. As your date nears, we'll confirm your exact pickup day, time, and meeting location. Most meetups happen Wednesday through Saturday.",
      "For your puppy's safety, travel can only begin once they're at least 8 weeks old. Puppies under 2.5 lbs may need to stay with their breeder until around 12 weeks, following recommended transport guidelines.",
      "Most deliveries in this program are completed within 2–4 weeks, depending on your puppy's health check, age, and transport availability.",
    ],
    whatToBring: [
      "A soft-sided pet carrier",
      "A properly fitted leash and collar",
      "Fresh water and a portable bowl",
      "A small amount of your puppy's current food",
      "A nutritional supplement (recommended for puppies under 5 lbs)",
    ],
    note: {
      heading: "Special Delivery Situations",
      text: "If you're in a remote or hard-to-reach area, arrangements may look a little different. In the rare case that ground transport isn't practical, your puppy may travel using an approved commercial airline's live-animal service, with pickup at the nearest participating airport. Our team will walk you through every step.",
    },
  },
  {
    id: "priority-express",
    title: "Priority Express Delivery",
    tagline: "Get your puppy home even sooner",
    price: "$420",
    imageKey: "tier-priority-express",
    body: [
      "Need your new companion home fast? Priority Express moves your puppy to the front of the line for the earliest available transportation.",
      "Eligible puppies can be delivered to a convenient location near you in as little as 1–2 weeks, depending on availability.",
      "Eligibility depends on your puppy's breed, the breeder's location, available routes, and when your reservation is confirmed.",
      "For every puppy's safety, travel can only begin once they're at least 8 weeks old, and puppies under 2.5 lbs may need to stay with their breeder until around 12 weeks.",
      "Curious if Priority Express is available for your puppy? Your Haven Paws puppy advisor can check availability and walk you through the details.",
    ],
  },
  {
    id: "pickup-breeder",
    title: "Pickup Near the Breeder",
    tagline: "The most flexible pickup option",
    price: "$0–$60",
    imageKey: "tier-pickup-breeder",
    body: [
      "Prefer to make the trip yourself? Arrange a pickup near the breeder at a time that works for you both.",
      "Pickups within 10 miles of the breeder are free. If you'd like to meet at an alternate nearby location — like a local airport or agreed public spot — a small coordination fee of up to $60 may apply.",
      "Our team will help you coordinate a pickup date, time, and location once your reservation is confirmed.",
      "For your puppy's health and safety, they must be at least 8 weeks old before heading home. Puppies under 2.5 lbs may need to stay with their breeder until around 12 weeks.",
      "Once your puppy clears their required health checks, pickup is typically available within 1–2 weeks.",
    ],
    whatToBring: [
      "A soft-sided pet carrier",
      "Fresh drinking water and a portable bowl",
      "A leash and properly fitted collar",
      "A small supply of your puppy's current food",
      "A nutritional supplement for puppies under 5 lbs (optional but recommended)",
    ],
  },
];

interface DeliveryTiersProps {
  images: Record<string, string>;
}

export default function DeliveryTiers({ images }: DeliveryTiersProps) {
  const [openId, setOpenId] = useState<string | null>(TIERS[0].id);

  return (
    <div className="space-y-4">
      {TIERS.map((tier) => {
        const isOpen = openId === tier.id;
        const imageUrl = images?.[tier.imageKey];

        return (
          <div
            key={tier.id}
            className="border border-sage/20 rounded-lg overflow-hidden bg-white"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : tier.id)}
              className="w-full flex items-center justify-between gap-4 p-4 text-left"
            >
              <div>
                <p className="eyebrow text-sage">{tier.tagline}</p>
                <h3 className="font-display text-lg text-ink">{tier.title}</h3>
                <p className="text-forest font-semibold mt-1">{tier.price}</p>
              </div>
              {isOpen ? (
                <Minus className="shrink-0 text-forest" size={20} />
              ) : (
                <Plus className="shrink-0 text-forest" size={20} />
              )}
            </button>

            {isOpen && (
              <div className="px-4 pb-5 space-y-4">
                {imageUrl && (
                  <ProtectedImage
                    src={imageUrl}
                    alt={tier.title}
                    className="aspect-[4/3] rounded-lg overflow-hidden"
                  />
                )}

                {tier.body.map((p, i) => (
                  <p key={i} className="text-sage text-sm leading-relaxed">
                    {p}
                  </p>
                ))}

                {tier.whatToBring && (
                  <div>
                    <p className="font-semibold text-ink text-sm mb-2">
                      What to Bring
                    </p>
                    <ul className="space-y-1">
                      {tier.whatToBring.map((item, i) => (
                        <li
                          key={i}
                          className="text-sage text-sm flex items-start gap-2"
                        >
                          <span className="text-gold mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tier.note && (
                  <div className="bg-cream-alt rounded-lg p-4">
                    <p className="font-semibold text-ink text-sm mb-1">
                      {tier.note.heading}
                    </p>
                    <p className="text-sage text-sm leading-relaxed">
                      {tier.note.text}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}