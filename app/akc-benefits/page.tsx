import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FaqAccordion from "../components/FaqAccordion";
import { getPageImages } from "@/lib/queries/pageContent";
import { cldOptimized } from "@/lib/cloudinary";

const SECTIONS = [
  {
    question: "AKC Registration",
    answer:
      "Every eligible Haven Paws puppy qualifies for American Kennel Club (AKC) Registration or AKC Canine Partners Enrollment, depending on eligibility requirements.\n\nRegistration provides official ownership documentation and access to exclusive AKC member resources, including:\n\n• Permanent AKC registration records\n• Lifetime enrollment in AKC Reunite Lost Pet Recovery\n• One year of access to the AKC GoodDog! Helpline, where certified trainers provide personalized guidance\n• Eligibility for selected AKC titles and events, including Canine Good Citizen and Therapy Dog programs\n• A complimentary digital subscription to AKC Family Dog Magazine, featuring expert advice on training, nutrition, health, and responsible pet ownership",
  },
  {
    question: "AKC Reunite",
    answer:
      "Every eligible Haven Paws puppy includes enrollment in AKC Reunite, one of America's largest pet recovery programs.\n\nOwners can register their puppy's microchip so that, if their dog is ever lost, AKC Reunite helps connect the pet with its family as quickly as possible through its nationwide recovery network.",
  },
  {
    question: "Exclusive Benefits for Haven Paws Families",
    answer:
      "Choosing Haven Paws means more than bringing home a puppy.\n\nEligible puppies include access to AKC Registration and AKC Reunite benefits after purchase, giving new owners valuable resources, educational materials, and long-term support throughout their dog's life.",
  },
  {
    question: "Microchip Registration Support",
    answer:
      "Your puppy's microchip can be registered as part of the AKC enrollment process, making identification easier should your pet ever become separated from your family.\n\nMicrochip registration adds another layer of protection and peace of mind.",
  },
  {
    question: "Lifetime AKC Participation",
    answer:
      "Eligible dogs may participate in a wide range of AKC activities, including:\n\n• Dog shows\n• Obedience competitions\n• Agility events\n• Field trials\n• Performance sports\n• Community programs\n\nOwners also receive ongoing educational resources through AKC publications and digital content.",
  },
  {
    question: "Building Confidence Between Families and Breeders",
    answer:
      "When you adopt through Haven Paws, you're choosing a marketplace built around responsible breeding, transparency, and lifelong puppy care.\n\nOur Commitment\n\n✔ We work with breeders who emphasize health testing, ethical breeding practices, and continuous education.\n✔ We encourage responsible breeding standards and partner with breeders who follow applicable animal welfare regulations.\n✔ Every breeder in our network is carefully reviewed before joining Haven Paws.\n✔ Our support doesn't end after adoption. Our team is available to help before, during, and after your puppy arrives home.\n✔ Our goal is simple: connect healthy, well-cared-for puppies with loving families while providing a smooth, trustworthy adoption experience.",
  },
];

export default async function AkcBenefitsPage() {
  const { heroImage } = await getPageImages("akc-benefits");

  return (
    <main>
      <Navbar />

      {heroImage && (
        <div className="w-full aspect-[4/3] sm:aspect-[16/7] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cldOptimized(heroImage, 1200)}
            alt="AKC Benefits"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <section className="bg-cream-alt">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="font-display text-3xl text-forest mb-3">AKC Benefits</h1>
          <p className="eyebrow mb-4">How You Benefit</p>
          <p className="text-ink/80 leading-relaxed">
            At Haven Paws, we&apos;re committed to raising healthy, well-socialized puppies
            and helping every family start their journey with confidence. Through our
            partnership with the American Kennel Club (AKC), eligible puppies receive
            valuable registration benefits and lifelong support.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <FaqAccordion items={SECTIONS} />
      </section>

      <Footer />
    </main>
  );
}