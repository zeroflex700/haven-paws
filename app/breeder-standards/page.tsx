import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StandardsAccordion from "../components/StandardsAccordion";
import ProcessSteps from "../components/ProcessSteps";
import BoardCarousel from "../components/BoardCarousel";
import AdvocacySection from "../components/AdvocacySection";
import FaqAccordion from "../components/FaqAccordion";
import { getPageImages } from "@/lib/queries/pageContent";
import { getBoardMembers } from "@/lib/queries/boardMembers";

const STANDARDS = [
  {
    title: "Healthy Puppies",
    checklist: [
      "Required vaccinations based on age and veterinary recommendations",
      "A veterinarian-approved preventive healthcare program",
      "Routine health monitoring throughout development",
      "Health evaluations and genetic screening of parent dogs",
    ],
  },
  {
    title: "Breeder Program Audit",
    checklist: [
      "Initial approval interview and yearly reassessments",
      "Compliance with USDA regulations and all applicable state licensing requirements",
      "Identity verification and detailed background screening",
      "Review of the breeder's public reputation and online presence",
    ],
  },
  {
    title: "Breeder Home Audit",
    checklist: [
      "Examination of photos and videos of the breeding environment",
      "Verification of the breeder's physical location",
      "On-site inspections whenever possible",
    ],
  },
  {
    title: "Breeder Support",
    checklist: [
      "Expert guidance on responsible breeding and puppy care",
      "Regular follow-up communication",
      "Educational resources covering breeding, health, nutrition, and animal welfare",
    ],
  },
];

const STEPS = [
  {
    number: 1,
    title: "Application & Background Verification",
    description:
      "Each breeder begins with a comprehensive application and verification process. During this stage, Haven Paws reviews business licenses and certifications, home or kennel facilities, veterinary care plans, breeding history and experience, health testing protocols, vaccination schedules, puppy socialization practices, and living conditions. We also conduct identity verification and detailed background checks to help ensure breeders have no history of animal cruelty, neglect, or related legal violations.",
  },
  {
    number: 2,
    title: "Health & Facility Assessment",
    description:
      "Our team evaluates each breeding program to confirm puppies are raised in a clean, safe, and nurturing environment. This review includes facility cleanliness, animal welfare standards, and health outcomes for puppies, with ongoing monitoring to identify and resolve concerns as early as possible.",
  },
  {
    number: 3,
    title: "Breeder Education & Onboarding",
    description:
      "Approved breeders complete a structured onboarding program designed to promote responsible breeding. Training focuses on ethical breeding practices, puppy health and development, animal welfare standards, and best practices for long-term breeder success.",
  },
  {
    number: 4,
    title: "Continuous Compliance Monitoring",
    description:
      "Our partnership doesn't end after approval. Haven Paws continually monitors breeder performance through routine follow-up reviews, compliance evaluations, performance tracking, and quality assurance assessments. If a breeder fails to meet our standards, we work with them to correct the issue, and when necessary, suspend or permanently remove breeders from the network.",
  },
];

const FAQS = [
  {
    question: "How Does Haven Paws Ensure Breeders Prioritize the Health and Well-Being of Their Dogs?",
    answer:
      "Every breeder applying to join Haven Paws undergoes a comprehensive review before being approved. Our evaluation covers breeding practices, facility conditions, animal care procedures, and veterinary standards to ensure they meet our expectations.\n\nApproval isn't the end of the process. We continue to monitor breeders through regular evaluations, ongoing communication, veterinary collaboration, and health reporting.",
  },
  {
    question: "Are Haven Paws Breeders Licensed?",
    answer:
      "All breeders partnered with Haven Paws operate in accordance with applicable state and federal regulations. Depending on local laws, each breeder either maintains the required licensing or legally qualifies for an exemption.\n\nBefore joining our network, every breeder's credentials and compliance status are thoroughly verified.",
  },
  {
    question: "What Values Bring the Haven Paws Breeder Community Together?",
    answer:
      "The breeders within the Haven Paws network share a commitment to responsible breeding, compassionate animal care, honesty, and lifelong support for their puppies. They believe that raising healthy, confident, and well-socialized dogs begins with ethical practices and genuine dedication to each animal's well-being.",
  },
  {
    question: "Does Haven Paws Visit or Inspect Breeder Facilities in Person?",
    answer:
      "Yes. Whenever appropriate, Haven Paws conducts in-person visits and facility evaluations as part of our breeder assessment process. These inspections help verify living conditions, cleanliness, animal care practices, and overall compliance with our quality standards.",
  },
  {
    question: "What Makes a Responsible Breeder?",
    answer:
      "A responsible breeder is someone who genuinely prioritizes the health, safety, and well-being of their dogs — not someone focused only on making a profit. The breeders we work with are committed to breeding to improve and preserve their chosen breed, performing recommended health and genetic testing, providing clean and enriching living conditions, giving puppies early care and social interaction, and maintaining high standards of animal welfare throughout every stage of breeding.",
  },
  {
    question: "What Happens If a Breeder Doesn't Meet Haven Paws Standards?",
    answer:
      "If a breeder fails to meet our expectations, we begin by discussing the issue and outlining the improvements required. Depending on the situation, we may temporarily suspend our partnership while corrective actions are completed and verified. If necessary, Haven Paws may permanently discontinue working with a breeder.",
  },
  {
    question: "Are Breeders Required to Socialize and Begin Training Puppies?",
    answer:
      "Yes. Every Haven Paws breeder must implement a structured puppy socialization plan developed with guidance from their veterinarian. This helps puppies become comfortable with people, everyday experiences, and new environments. Many breeders also introduce age-appropriate foundational training before a puppy goes home.",
  },
];

export default async function BreederStandardsPage() {
  const { heroVideo, extraImages, extraVideos } = await getPageImages("breeder-standards");
  const boardMembers = await getBoardMembers();

  const standardsWithImages = STANDARDS.map((s) => ({
    ...s,
    image:
      extraImages[
        s.title === "Healthy Puppies"
          ? "standards_healthy_puppies"
          : s.title === "Breeder Program Audit"
          ? "standards_program_audit"
          : s.title === "Breeder Home Audit"
          ? "standards_home_audit"
          : "standards_breeder_support"
      ] ?? null,
  }));

  const stepsWithVideos = STEPS.map((s) => ({
    ...s,
    video: extraVideos[`process_step${s.number}`] ?? null,
  }));

  return (
    <main>
      <Navbar />

      <section className="relative">
        {heroVideo ? (
          <video src={heroVideo} autoPlay muted loop playsInline className="w-full aspect-[4/3] sm:aspect-[16/7] object-cover" />
        ) : (
          <div className="w-full aspect-[4/3] sm:aspect-[16/7] bg-cream-alt" />
        )}
        <div className="absolute inset-0 bg-forest/40 flex items-center justify-center px-6">
          <h1 className="font-display text-2xl sm:text-3xl text-white text-center max-w-lg">
            Every happy beginning starts with a trusted, vetted breeder
          </h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="font-display text-3xl text-forest mb-4">
          Every Great Journey Begins with a Trusted Breeder
        </h2>
        <p className="text-ink/80 leading-relaxed mb-8">
          At Haven Paws, we believe every puppy deserves the best possible beginning. That&apos;s
          why we partner only with carefully evaluated breeders who meet our strict standards
          for health, ethical care, and responsible breeding.
        </p>

        <p className="eyebrow mb-2">What Sets Our Breeder Standards Apart</p>
        <p className="text-ink/70 mb-6">
          Breeders who work with us meet strict health, safety, and care standards so you can
          find your perfect puppy with confidence.
        </p>

        <StandardsAccordion items={standardsWithImages} />
      </section>

      <section className="bg-cream-alt py-14">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-2xl text-forest text-center mb-10">
            Our Breeder Vetting Process: Step-by-Step
          </h2>
          <ProcessSteps steps={stepsWithVideos} />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="font-display text-2xl text-forest mb-4">
          Our Commitment to Health &amp; Happiness
        </h2>
        <p className="text-ink/80 leading-relaxed">
          At Haven Paws, our mission is simple: connect families with healthy, well-cared-for
          puppies raised by responsible breeders who consistently meet the highest standards of
          care, safety, and ethical breeding. Every decision we make is guided by the
          well-being of our puppies and the confidence of the families we serve.
        </p>
      </section>

      {boardMembers.length > 0 && (
        <section className="bg-cream-alt py-14">
          <div className="max-w-5xl mx-auto px-6">
            <p className="eyebrow mb-2 text-center">Science-Based Oversight</p>
            <h2 className="font-display text-2xl text-forest text-center mb-8">
              Our Scientific Advisory Board
            </h2>
            <p className="text-ink/70 text-center max-w-xl mx-auto mb-8">
              Made up of veterinarians and animal welfare experts, our Scientific Advisory
              Board continuously reviews and refines our health standards to reflect the
              latest in veterinary science.
            </p>
            <BoardCarousel members={boardMembers} />
          </div>
        </section>
      )}

      <AdvocacySection video={extraVideos.advocacy_video ?? null} />

      <section className="max-w-3xl mx-auto px-6 pb-14 pt-4">
        <div className="bg-white border border-gold/30 rounded-lg p-6 text-center">
          <h2 className="font-display text-xl text-forest mb-2">
            Join the Haven Paws Community as a Breeder
          </h2>
          <p className="text-ink/70 mb-4">
            Partner with Haven Paws to simplify your breeding process so you can focus on
            what you do best.
          </p>
          <a
            href="/contact"
            className="inline-block bg-forest text-cream px-6 py-2.5 rounded-full hover:bg-forest-light transition-colors mb-6"
          >
            Apply Now
          </a>
          <div className="text-left grid sm:grid-cols-2 gap-4 text-sm text-ink/70">
            <div>
              <p className="text-forest font-medium mb-1">Nationwide reach</p>
              <p>We connect you with families across the U.S. and provide support for everything in between.</p>
            </div>
            <div>
              <p className="text-forest font-medium mb-1">Free listings & trusted platform</p>
              <p>It&apos;s free to list with us, giving your puppies national visibility on a trusted platform.</p>
            </div>
            <div>
              <p className="text-forest font-medium mb-1">Marketing & logistics covered</p>
              <p>We help with marketing, customer communication, and coordinate travel through vetted transport partners.</p>
            </div>
            <div>
              <p className="text-forest font-medium mb-1">Resources & expert support</p>
              <p>Gain access to tools, resources, and expert guidance to support best health and breeding practices.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-14">
        <h2 className="font-display text-2xl text-forest text-center mb-2">
          Frequently Asked Questions About Our Breeders
        </h2>
        <p className="text-ink/70 text-center mb-8">
          Need guidance? The Haven Paws support team is available to answer your questions,
          help you choose the right puppy, explain our breeder standards, and provide
          assistance throughout your journey.
        </p>
        <FaqAccordion items={FAQS} />
      </section>

      <Footer />
    </main>
  );
}