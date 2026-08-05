import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FaqAccordion from "../components/FaqAccordion";
import { getPageImages } from "@/lib/queries/pageContent";
import { cldOptimized } from "@/lib/cloudinary";

const FAQS = [
  {
    question: "What is AKC Registration?",
    answer:
      "AKC Registration is an official record maintained by the American Kennel Club that documents a purebred dog's lineage. Registration verifies that a puppy comes from registered parents and is recognized within the AKC registry.\n\nDepending on the breeder's program, your puppy may be eligible for Limited Registration or Full Registration.",
  },
  {
    question: "What is Companion Registration?",
    answer:
      "Companion Registration identifies your puppy as a cherished family pet rather than a breeding or competition dog. It allows owners to enjoy the companionship of their dog while encouraging responsible pet ownership.",
  },
  {
    question: "Why does Haven Paws provide Companion Registration?",
    answer:
      "At Haven Paws, the health and welfare of every puppy come first. We work with responsible breeders who prioritize ethical breeding practices and lifelong care for their dogs.\n\nTo support these standards, many puppies are placed with Companion Registration, helping ensure they become loving family members rather than being used for unauthorized breeding.",
  },
  {
    question: "What is the difference between Companion Registration and AKC Registration?",
    answer:
      "Companion Registration focuses on pet ownership and responsible care.\n\nAKC Registration is an official pedigree record issued by the American Kennel Club for eligible purebred dogs. Some puppies may receive Limited AKC Registration, while others may qualify for Full AKC Registration, depending on the breeder's terms and breeding rights.\n\nNot every puppy listed on Haven Paws is eligible for Full AKC Registration.",
  },
  {
    question: "What is Limited AKC Registration?",
    answer:
      "Limited AKC Registration means your puppy is officially registered with the American Kennel Club but cannot produce AKC-registered offspring. Dogs with Limited Registration can still participate in many AKC events and activities, making it an excellent choice for families seeking a lifelong companion.",
  },
  {
    question: "What is Full AKC Registration?",
    answer:
      "Full AKC Registration includes all the benefits of Limited Registration while also allowing eligible offspring to be registered with the AKC. This option is generally reserved for approved breeding programs and is only available when permitted by the breeder.",
  },
  {
    question: "Can I breed my puppy?",
    answer:
      "Breeding rights depend on the registration type and the agreement established with the breeder.\n\nPuppies sold with Companion or Limited Registration are intended to be family pets and are not sold with breeding privileges. If you are interested in breeding rights, please contact our team before placing a reservation so we can discuss available options.",
  },
  {
    question: "How will I receive my registration documents?",
    answer:
      "If your puppy qualifies for AKC Registration, you'll receive the necessary paperwork and instructions after your puppy arrives home. Our support team will guide you through every step of completing the registration process.",
  },
  {
    question: "I still have questions.",
    answer:
      "Our Haven Paws support team is always happy to help. If you have questions about AKC Registration, Companion Registration, or any of our puppies, please contact us through our website, email, or phone. We'll gladly help you choose the right puppy and explain every part of the registration process.",
  },
];

export default async function AkcRegistrationPage() {
  const { heroImage } = await getPageImages("akc-registration");

  return (
    <main>
      <Navbar />

      {heroImage && (
        <div className="w-full aspect-[4/3] sm:aspect-[16/7] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cldOptimized(heroImage, 1200)}
            alt="AKC Registration"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <section className="bg-cream-alt">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="font-display text-3xl text-forest mb-6">AKC Registration</h1>
          <p className="text-ink/80 leading-relaxed mb-4">
            At Haven Paws, we proudly provide information and guidance regarding American
            Kennel Club (AKC) registration for eligible puppies. The AKC is one of the most
            recognized and respected purebred dog registries in the United States, maintaining
            pedigree records and promoting responsible breeding standards.
          </p>
          <p className="text-ink/80 leading-relaxed">
            For puppies that qualify, our registration partner will contact you after your
            puppy arrives to explain the registration process, eligibility requirements, and
            the documents needed to complete enrollment. Availability depends on the breed,
            breeder program, and individual puppy.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="font-display text-2xl text-forest text-center mb-2">
          Still have questions?
        </h2>
        <p className="text-ink/70 text-center mb-8">
          See below for answers to some common questions!
        </p>
        <FaqAccordion items={FAQS} />
      </section>

      <Footer />
    </main>
  );
}