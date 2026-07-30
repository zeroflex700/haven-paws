import { Award, LifeBuoy, ShieldCheck, Trophy } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPageHeroImage } from "@/lib/queries/pageContent";
import { cldOptimized } from "@/lib/cloudinary";

const AKC_REGISTRATION_PERKS = [
  "Permanent AKC registration records",
  "Lifetime enrollment in AKC Reunite Lost Pet Recovery",
  "One year of access to the AKC GoodDog! Helpline, where certified trainers provide personalized guidance",
  "Eligibility for selected AKC titles and events, including Canine Good Citizen and Therapy Dog programs",
  "A complimentary digital subscription to AKC Family Dog Magazine, featuring expert advice on training, nutrition, health, and responsible pet ownership",
];

const AKC_ACTIVITIES = [
  "Dog shows",
  "Obedience competitions",
  "Agility events",
  "Field trials",
  "Performance sports",
  "Community programs",
];

const COMMITMENTS = [
  "We work with breeders who emphasize health testing, ethical breeding practices, and continuous education.",
  "We encourage responsible breeding standards and partner with breeders who follow applicable animal welfare regulations.",
  "Every breeder in our network is carefully reviewed before joining Haven Paws.",
  "Our support doesn't end after adoption. Our team is available to help before, during, and after your puppy arrives home.",
  "Our goal is simple: connect healthy, well-cared-for puppies with loving families while providing a smooth, trustworthy adoption experience.",
];

export default async function AkcBenefitsPage() {
  const heroImage = await getPageHeroImage("akc-benefits");

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
          <p className="eyebrow mb-3">For Puppy Parents</p>
          <h1 className="font-display text-3xl text-forest mb-4">AKC Benefits</h1>
          <p className="text-ink/80 leading-relaxed">
            At Haven Paws, we&apos;re committed to raising healthy, well-socialized puppies and
            helping every family start their journey with confidence. Through our partnership
            with the American Kennel Club (AKC), eligible puppies receive valuable registration
            benefits and lifelong support.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="font-display text-2xl text-forest mb-8">How You Benefit</h2>

        <div className="flex items-center gap-2 mb-3">
          <Award size={20} className="text-gold" strokeWidth={1.5} />
          <h3 className="font-display text-lg text-forest">AKC Registration</h3>
        </div>
        <p className="text-ink/80 leading-relaxed mb-4">
          Every eligible Haven Paws puppy qualifies for American Kennel Club (AKC) Registration
          or AKC Canine Partners Enrollment, depending on eligibility requirements. Registration
          provides official ownership documentation and access to exclusive AKC member resources,
          including:
        </p>
        <ul className="space-y-2 mb-10">
          {AKC_REGISTRATION_PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-2 text-sm text-ink/80">
              <span className="text-gold mt-1">•</span>
              {perk}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 mb-3">
          <LifeBuoy size={20} className="text-gold" strokeWidth={1.5} />
          <h3 className="font-display text-lg text-forest">AKC Reunite</h3>
        </div>
        <p className="text-ink/80 leading-relaxed mb-3">
          Every eligible Haven Paws puppy includes enrollment in AKC Reunite, one of America&apos;s
          largest pet recovery programs.
        </p>
        <p className="text-ink/80 leading-relaxed mb-10">
          Owners can register their puppy&apos;s microchip so that, if their dog is ever lost,
          AKC Reunite helps connect the pet with its family as quickly as possible through its
          nationwide recovery network.
        </p>

        <h2 className="font-display text-2xl text-forest mb-4">
          Exclusive Benefits for Haven Paws Families
        </h2>
        <p className="text-ink/80 leading-relaxed mb-3">
          Choosing Haven Paws means more than bringing home a puppy.
        </p>
        <p className="text-ink/80 leading-relaxed mb-10">
          Eligible puppies include access to AKC Registration and AKC Reunite benefits after
          purchase, giving new owners valuable resources, educational materials, and long-term
          support throughout their dog&apos;s life.
        </p>

        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={20} className="text-gold" strokeWidth={1.5} />
          <h3 className="font-display text-lg text-forest">Microchip Registration Support</h3>
        </div>
        <p className="text-ink/80 leading-relaxed mb-3">
          Your puppy&apos;s microchip can be registered as part of the AKC enrollment process,
          making identification easier should your pet ever become separated from your family.
        </p>
        <p className="text-ink/80 leading-relaxed mb-10">
          Microchip registration adds another layer of protection and peace of mind.
        </p>

        <div className="flex items-center gap-2 mb-3">
          <Trophy size={20} className="text-gold" strokeWidth={1.5} />
          <h3 className="font-display text-lg text-forest">Lifetime AKC Participation</h3>
        </div>
        <p className="text-ink/80 leading-relaxed mb-3">
          Eligible dogs may participate in a wide range of AKC activities, including:
        </p>
        <ul className="grid grid-cols-2 gap-2 mb-4">
          {AKC_ACTIVITIES.map((activity) => (
            <li key={activity} className="flex items-center gap-2 text-sm text-ink/80">
              <span className="text-gold">•</span>
              {activity}
            </li>
          ))}
        </ul>
        <p className="text-ink/80 leading-relaxed">
          Owners also receive ongoing educational resources through AKC publications and
          digital content.
        </p>
      </section>

      <section className="bg-cream-alt">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <h2 className="font-display text-2xl text-forest mb-2">
            Building Confidence Between Families and Breeders
          </h2>
          <p className="text-ink/80 leading-relaxed mb-8">
            When you adopt through Haven Paws, you&apos;re choosing a marketplace built around
            responsible breeding, transparency, and lifelong puppy care.
          </p>

          <h3 className="font-display text-lg text-forest mb-4">Our Commitment</h3>
          <ul className="space-y-3">
            {COMMITMENTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink/80">
                <ShieldCheck size={16} className="text-gold shrink-0 mt-0.5" strokeWidth={1.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}