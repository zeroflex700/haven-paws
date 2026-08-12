import { CheckCircle2, FileSignature, Truck, Home } from "lucide-react";

const STEPS = [
  {
    icon: CheckCircle2,
    title: "Reserve your puppy",
    body: "Submit your details and choose to pay a deposit or the full amount to secure your reservation.",
  },
  {
    icon: FileSignature,
    title: "Contract & preparation",
    body: "You'll receive your adoption agreement and a preparation checklist by email once your deposit is confirmed.",
  },
  {
    icon: Truck,
    title: "Delivery coordination",
    body: "Our team confirms your delivery or pickup details and shares an estimated arrival window.",
  },
  {
    icon: Home,
    title: "Welcome your puppy home",
    body: "Track your reservation anytime from your account, from deposit through delivery day.",
  },
];

export default function PurchaseTimeline() {
  return (
    <div className="space-y-4">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-cream-alt flex items-center justify-center shrink-0">
                <Icon size={15} className="text-gold" strokeWidth={1.5} />
              </span>
              {i < STEPS.length - 1 && <span className="w-px flex-1 bg-sage/20 my-1" />}
            </div>
            <div className="pb-4">
              <p className="text-sm font-medium text-forest">{step.title}</p>
              <p className="text-xs text-ink/70 mt-0.5">{step.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}