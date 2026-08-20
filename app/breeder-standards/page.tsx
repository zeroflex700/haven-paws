import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
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
    question:
      "How Does Haven Paws Ensure Breeders Prioritize the Health and Well-Being of Their Dogs?",
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
    question:
      "Are Breeders Required to Socialize and Begin Training Puppies?",
    answer:
      "Yes. Every Haven Paws breeder must implement a structured puppy socialization plan developed with guidance from their veterinarian. This helps puppies become comfortable with people, everyday experiences, and new environments. Many breeders also introduce age-appropriate foundational training before a puppy goes home.",
  },
];

const PRINCIPLES = [
  {
    number: "01",
    title: "Health First",
    description:
      "Every standard begins with the health, development, and long-term well-being of each dog.",
  },
  {
    number: "02",
    title: "Care Verified",
    description:
      "We evaluate breeders and their programs against clear expectations for responsible care.",
  },
  {
    number: "03",
    title: "Trust Earned",
    description:
      "Families deserve transparency and confidence when choosing where their puppy comes from.",
  },
];

const BREEDER_BENEFITS = [
  {
    number: "01",
    title: "Nationwide reach",
    description:
      "We connect you with families across the U.S. and provide support for everything in between.",
  },
  {
    number: "02",
    title: "Free listings & trusted platform",
    description:
      "It's free to list with us, giving your puppies national visibility on a trusted platform.",
  },
  {
    number: "03",
    title: "Marketing & logistics covered",
    description:
      "We help with marketing, customer communication, and coordinate travel through vetted transport partners.",
  },
  {
    number: "04",
    title: "Resources & expert support",
    description:
      "Gain access to tools, resources, and expert guidance to support best health and breeding practices.",
  },
];

export default async function BreederStandardsPage() {
  const { heroVideo, extraImages, extraVideos } = await getPageImages(
    "breeder-standards"
  );
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
    <main className="overflow-hidden bg-[#FCFAF5]">
      <Navbar />

      {/* HERO */}
      <section className="relative isolate min-h-[560px] sm:min-h-[650px] lg:min-h-[760px] flex items-end">
        {heroVideo ? (
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 -z-20 bg-forest" />
        )}

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10271F]/95 via-[#10271F]/45 to-[#10271F]/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#10271F]/55 via-transparent to-transparent" />

        <div className="absolute left-6 top-8 hidden h-px w-24 bg-gold/60 sm:block lg:left-12 lg:top-12" />
        <div className="absolute right-6 top-8 hidden text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60 sm:block lg:right-12 lg:top-12">
          Haven Paws · Breeder Standards
        </div>

        <PageContainer className="w-full pb-12 pt-32 sm:pb-16 sm:pt-40 lg:pb-20">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85">
                A higher standard of care
              </span>
            </div>

            <h1 className="font-display max-w-4xl text-4xl leading-[1.04] text-white sm:text-5xl lg:text-7xl">
              Every happy beginning starts with a{" "}
              <span className="text-gold">trusted</span>, vetted breeder.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl">
              Behind every puppy&apos;s journey should be responsible care,
              thoughtful breeding, and a commitment to doing things the right
              way.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#standards"
                className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-forest transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Explore our standards
              </a>
              <a
                href="#process"
                className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
              >
                See how we vet breeders
              </a>
            </div>
          </div>
        </PageContainer>

        <div className="absolute bottom-6 right-6 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50 lg:flex">
          <span>Scroll to explore</span>
          <span className="h-px w-12 bg-white/40" />
        </div>
      </section>

      {/* INTRO / TRUST PRINCIPLES */}
      <section className="relative py-16 sm:py-20 lg:py-28">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="eyebrow mb-4">The Haven Paws Standard</p>
              <h2 className="font-display max-w-3xl text-4xl leading-tight text-forest sm:text-5xl">
                Every great journey begins with a{" "}
                <span className="italic">trusted breeder.</span>
              </h2>
            </div>

            <div className="lg:pb-1">
              <p className="body-text max-w-xl text-base leading-8">
                At Haven Paws, we believe every puppy deserves the best
                possible beginning. That&apos;s why we partner only with
                carefully evaluated breeders who meet our strict standards for
                health, ethical care, and responsible breeding.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-forest/10 bg-forest/10 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.number}
                className="group bg-[#FCFAF5] p-7 transition-colors hover:bg-white sm:p-8"
              >
                <span className="text-xs font-semibold tracking-[0.2em] text-gold">
                  {principle.number}
                </span>
                <h3 className="mt-7 font-display text-2xl text-forest">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink/65">
                  {principle.description}
                </p>
                <div className="mt-6 h-px w-10 bg-gold transition-all duration-300 group-hover:w-16" />
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* STANDARDS */}
      <section
        id="standards"
        className="scroll-mt-20 border-y border-forest/10 bg-white py-16 sm:py-20 lg:py-28"
      >
        <PageContainer>
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
            <p className="eyebrow mb-3">What sets us apart</p>
            <h2 className="font-display text-4xl leading-tight text-forest sm:text-5xl">
              Standards built around the things that matter most.
            </h2>
            <p className="body-text mx-auto mt-5 max-w-2xl">
              Breeders who work with us meet strict health, safety, and care
              standards so you can find your perfect puppy with confidence.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <StandardsAccordion items={standardsWithImages} />
          </div>
        </PageContainer>
      </section>

      {/* VETTING PROCESS */}
      <section
        id="process"
        className="scroll-mt-20 relative bg-cream-alt py-16 sm:py-20 lg:py-28"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gold/30" />

        <PageContainer>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-white">
              <span className="text-lg text-gold">✦</span>
            </div>
            <p className="eyebrow mb-3">From first review to ongoing care</p>
            <h2 className="font-display text-4xl leading-tight text-forest sm:text-5xl">
              Our breeder vetting process, step by step.
            </h2>
            <p className="body-text mx-auto mt-5 max-w-2xl">
              Careful evaluation doesn&apos;t happen in a single moment. It&apos;s
              a process designed to build confidence at every stage.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-5xl sm:mt-16">
            <ProcessSteps steps={stepsWithVideos} />
          </div>

          <div className="mx-auto mt-12 flex max-w-3xl items-start gap-4 rounded-2xl border border-gold/25 bg-white/70 p-5 sm:p-6">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-xs text-gold">
              ✓
            </span>
            <p className="text-sm leading-7 text-ink/70">
              Approval is not treated as a finish line. Our standards are
              designed around continued accountability, follow-up, and a
              commitment to addressing concerns when they arise.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* COMMITMENT */}
      <section className="py-16 sm:py-20 lg:py-28">
        <PageContainer>
          <div className="relative overflow-hidden rounded-3xl bg-forest px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-gold/15" />
            <div className="absolute -bottom-32 right-1/4 h-64 w-64 rounded-full border border-white/5" />

            <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                  Our promise
                </p>
                <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                  Health, happiness, and trust should never be an afterthought.
                </h2>
              </div>

              <div>
                <p className="text-base leading-8 text-white/75 sm:text-lg">
                  At Haven Paws, our mission is simple: connect families with
                  healthy, well-cared-for puppies raised by responsible breeders
                  who consistently meet the highest standards of care, safety,
                  and ethical breeding. Every decision we make is guided by the
                  well-being of our puppies and the confidence of the families
                  we serve.
                </p>

                <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.14em]">
                  <span className="rounded-full border border-white/15 px-4 py-2 text-white/80">
                    Responsible care
                  </span>
                  <span className="rounded-full border border-white/15 px-4 py-2 text-white/80">
                    Ethical breeding
                  </span>
                  <span className="rounded-full border border-white/15 px-4 py-2 text-white/80">
                    Family confidence
                  </span>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ADVISORY BOARD */}
      {boardMembers.length > 0 && (
        <section className="border-y border-forest/10 bg-white py-16 sm:py-20 lg:py-28">
          <PageContainer className="max-w-6xl">
            <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
              <p className="eyebrow mb-3">Science-based oversight</p>
              <h2 className="font-display text-4xl leading-tight text-forest sm:text-5xl">
                Guidance informed by expertise.
              </h2>
              <p className="body-text mx-auto mt-5 max-w-2xl">
                Made up of veterinarians and animal welfare experts, our
                Scientific Advisory Board continuously reviews and refines our
                health standards to reflect the latest in veterinary science.
              </p>
            </div>

            <BoardCarousel members={boardMembers} />
          </PageContainer>
        </section>
      )}

      {/* ADVOCACY */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-16 bg-[#FCFAF5]" />
        <div className="relative">
          <AdvocacySection video={extraVideos.advocacy_video ?? null} />
        </div>
      </section>

      {/* BREEDER CTA */}
      <section className="py-16 sm:py-20 lg:py-28">
        <PageContainer className="max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-gold/25 bg-white shadow-[0_20px_80px_rgba(28,62,48,0.08)]">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative bg-forest p-8 sm:p-12 lg:p-14">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full border-b border-l border-gold/15" />

                <div className="relative">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                    For responsible breeders
                  </p>

                  <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                    Build your next chapter with Haven Paws.
                  </h2>

                  <p className="mt-6 max-w-xl text-base leading-8 text-white/75">
                    Partner with Haven Paws to simplify your breeding process so
                    you can focus on what you do best.
                  </p>

                  <a
                    href="/contact"
                    className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-forest transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Apply Now
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              <div className="grid gap-px bg-forest/10 sm:grid-cols-2">
                {BREEDER_BENEFITS.map((benefit) => (
                  <div
                    key={benefit.number}
                    className="group bg-[#FCFAF5] p-7 transition-colors hover:bg-white sm:p-8"
                  >
                    <span className="text-xs font-semibold tracking-[0.18em] text-gold">
                      {benefit.number}
                    </span>
                    <h3 className="mt-6 font-display text-xl text-forest">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-ink/65">
                      {benefit.description}
                    </p>
                    <div className="mt-6 h-px w-8 bg-gold transition-all duration-300 group-hover:w-14" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* FAQ */}
      <section className="border-t border-forest/10 bg-cream-alt py-16 sm:py-20 lg:py-28">
        <PageContainer className="max-w-4xl">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
            <p className="eyebrow mb-3">Questions, answered</p>
            <h2 className="font-display text-4xl leading-tight text-forest sm:text-5xl">
              Frequently asked questions about our breeders.
            </h2>
            <p className="body-text mt-5">
              Need guidance? The Haven Paws support team is available to answer
              your questions, help you choose the right puppy, explain our
              breeder standards, and provide assistance throughout your journey.
            </p>
          </div>

          <div className="rounded-2xl border border-forest/10 bg-white p-2 shadow-[0_12px_50px_rgba(28,62,48,0.05)] sm:p-3">
            <FaqAccordion items={FAQS} />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-ink/55">
              Still have questions?
            </p>
            <a
              href="/contact"
              className="mt-2 inline-block text-sm font-semibold text-forest underline decoration-gold underline-offset-4 transition-opacity hover:opacity-70"
            >
              Speak with the Haven Paws team
            </a>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </main>
  );
}