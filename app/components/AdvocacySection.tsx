import { Gavel } from "lucide-react";

export default function AdvocacySection({ video }: { video: string | null }) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      {video && <video src={video} controls className="w-full rounded-lg mb-6" />}
      <Gavel size={24} className="text-gold mb-3" strokeWidth={1.5} />
      <h2 className="font-display text-2xl text-forest mb-4">
        Protecting Puppies Through Advocacy &amp; Scam Prevention
      </h2>
      <p className="text-ink/80 leading-relaxed mb-4">
        At Haven Paws, protecting puppies and the families who welcome them is one of our
        highest priorities. We actively work to prevent online pet scams, stay informed on
        animal welfare legislation, and collaborate with industry professionals to encourage
        responsible breeding practices.
      </p>
      <p className="text-ink/80 leading-relaxed mb-4">
        Our team carefully monitors health trends, partners with experienced veterinarians and
        ethical breeders, and promotes proven standards of care to help ensure every puppy is
        healthy, well-socialized, and raised in a safe environment.
      </p>
      <p className="text-ink/80 leading-relaxed">
        If you ever come across a suspicious puppy listing or believe you&apos;ve encountered a
        pet-related scam, please contact us so we can investigate and help protect other
        families.
      </p>
    </section>
  );
}