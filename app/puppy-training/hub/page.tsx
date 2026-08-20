import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import TrainingCard from "../../components/TrainingCard";

const TABS = [
  { id: "start", label: "Start here" },
  { id: "first-week", label: "First week" },
  { id: "courses", label: "Courses" },
  { id: "guides", label: "Guides" },
];

function Arrow() {
  return <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>;
}

export default function PuppyTrainingHubPage() {
  return (
    <main className="bg-[#f7f5ef]">
      <Navbar />

      {/* COMPACT LEARNING HUB HEADER */}
      <section className="border-b border-forest/10 bg-cream">
        <PageContainer className="py-6 sm:py-8">
          <div className="max-w-5xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-forest/60">
                <span className="h-2 w-2 rounded-full bg-gold" />
                Haven &amp; Paws Learning Academy
              </span>

              <span className="hidden sm:inline text-forest/20">/</span>

              <span className="text-xs font-medium text-forest/50">
                Puppy Training
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-forest">
                  Puppy Training Hub
                </h1>

                <p className="mt-3 max-w-xl text-sm sm:text-base leading-7 text-ink/65">
                  Practical lessons, step-by-step courses, and expert guidance
                  to help you build good habits from day one.
                </p>
              </div>

              <Link
                href="/puppy-training/first-week"
                className="group inline-flex w-fit items-center rounded-full bg-forest px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Begin your journey
                <Arrow />
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* COMPACT STICKY NAVIGATION */}
      <div className="sticky top-0 z-20 border-b border-forest/10 bg-[#f7f5ef]/95 backdrop-blur">
        <PageContainer>
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            {TABS.map((tab, index) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  index === 0
                    ? "bg-forest text-white"
                    : "border border-forest/10 bg-white text-forest hover:border-gold"
                }`}
              >
                {String(index + 1).padStart(2, "0")} · {tab.label}
              </a>
            ))}
          </div>
        </PageContainer>
      </div>

      <PageContainer className="py-8 sm:py-12">
        {/* START HERE */}
        <section id="start" className="scroll-mt-28 mb-12">
          <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            {/* FEATURED START CARD */}
            <div className="rounded-2xl bg-forest p-6 sm:p-8 text-white overflow-hidden relative">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/10" />
              <div className="absolute right-12 bottom-[-80px] h-48 w-48 rounded-full bg-gold/10" />

              <div className="relative">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                  Your starting point
                </p>

                <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
                  Start strong. Build good habits early.
                </h2>

                <p className="mt-3 max-w-xl text-sm sm:text-base leading-7 text-white/70">
                  A structured, self-paced program with live coaching and
                  community support to help your puppy build good habits from
                  day one.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Self-paced",
                    "Live coaching",
                    "Practical lessons",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/75"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <Link
                  href="/puppy-training/first-week"
                  className="group mt-7 inline-flex items-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-forest transition hover:scale-[1.02]"
                >
                  Start with your first week
                  <Arrow />
                </Link>
              </div>
            </div>

            {/* QUICK ACCESS */}
            <div className="rounded-2xl border border-forest/10 bg-white p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-forest/45">
                Quick access
              </p>

              <div className="mt-4 divide-y divide-forest/10">
                <Link
                  href="/puppy-training/first-week"
                  className="group flex items-center justify-between py-4"
                >
                  <div>
                    <p className="font-semibold text-forest">Your First Week</p>
                    <p className="mt-1 text-xs text-ink/55">
                      Prepare for the first days together
                    </p>
                  </div>
                  <span className="text-forest/50 group-hover:text-gold">
                    →
                  </span>
                </Link>

                <Link
                  href="/puppy-training/crate-training"
                  className="group flex items-center justify-between py-4"
                >
                  <div>
                    <p className="font-semibold text-forest">Crate Training</p>
                    <p className="mt-1 text-xs text-ink/55">
                      Create a calm, safe space
                    </p>
                  </div>
                  <span className="text-forest/50 group-hover:text-gold">
                    →
                  </span>
                </Link>

                <Link
                  href="/puppy-training/training-guides"
                  className="group flex items-center justify-between py-4"
                >
                  <div>
                    <p className="font-semibold text-forest">Training Guides</p>
                    <p className="mt-1 text-xs text-ink/55">
                      Helpful resources for everyday life
                    </p>
                  </div>
                  <span className="text-forest/50 group-hover:text-gold">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* COACHING STRIP */}
        <section className="mb-12 rounded-2xl border border-forest/10 bg-[#ece8dd] p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-forest/45">
                Coaching &amp; community
              </p>
              <h2 className="mt-2 text-xl font-semibold text-forest">
                You&apos;re not doing this alone.
              </h2>
            </div>

            <div className="border-l-0 md:border-l border-forest/10 md:pl-6">
              <p className="text-sm font-semibold text-forest">Coaching Calls</p>
              <p className="mt-1 text-xs text-ink/55">
                Next call: this week
              </p>
              <button className="mt-2 text-xs font-medium text-forest underline decoration-gold underline-offset-4">
                RSVP
              </button>
            </div>

            <div className="border-l-0 md:border-l border-forest/10 md:pl-6">
              <p className="text-sm font-semibold text-forest">
                Private Community
              </p>
              <p className="mt-1 text-xs text-ink/55">
                Connect with other owners
              </p>
            </div>
          </div>
        </section>

        {/* FIRST WEEK */}
        <section id="first-week" className="scroll-mt-28 mb-14">
          <SectionHeading
            number="01"
            title="Your First Week"
            description="The essential lessons for settling in together."
            href="/puppy-training/first-week"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <TrainingCard
              title="Prepare"
              description="Getting your home ready"
              color="green"
            />
            <TrainingCard
              title="First Day"
              description="What to expect"
              color="green"
            />
            <TrainingCard
              title="First Week"
              description="Settling in together"
              color="green"
            />
            <TrainingCard
              title="Gear"
              description="Essentials to have on hand"
              color="green"
            />
          </div>
        </section>

        {/* COURSES */}
        <section id="courses" className="scroll-mt-28 mb-14">
          <SectionHeading
            number="02"
            title="Build the foundations"
            description="Short, focused courses for the habits that matter most."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <TrainingCard
              title="House Training"
              description="Build good bathroom habits"
              color="green"
            />
            <TrainingCard
              title="Crate Training"
              description="A calm, safe space"
              color="orange"
            />
            <TrainingCard
              title="Socialization"
              description="Confident around new things"
              color="yellow"
            />
            <TrainingCard
              title="Manners"
              description="Everyday good behavior"
              color="pink"
            />
          </div>

          {/* COURSE COLLECTIONS */}
          <div className="grid gap-4 lg:grid-cols-2">
            <CourseCollection
              eyebrow="Focused course"
              title="Get Started With Crate Training"
              href="/puppy-training/crate-training"
              items={[
                "Intro",
                "Supplies",
                "Love the Crate",
                "Stay Quiet",
              ]}
              color="orange"
            />

            <CourseCollection
              eyebrow="Health & wellness"
              title="Get Started With Health & Wellness"
              href="/puppy-training/health-wellness"
              items={[
                "Vaccinations",
                "Feeding",
                "Activity",
                "Spay/Neuter",
              ]}
              color="lavender"
            />
          </div>
        </section>

        {/* GUIDES */}
        <section id="guides" className="scroll-mt-28 mb-14">
          <SectionHeading
            number="03"
            title="Keep these close"
            description="Useful guides and checklists for the moments you need them."
            href="/puppy-training/training-guides"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <TrainingCard title="First Day Checklist" color="gray" />
            <TrainingCard title="First Week Checklist" color="gray" />
            <TrainingCard title="Family Worksheet" color="gray" />
            <TrainingCard title="Sample Planner" color="gray" />
          </div>
        </section>

        {/* FEATURED COURSE */}
        <section className="rounded-2xl bg-[#e6e0ee] p-5 sm:p-7">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-forest/50">
                Featured course
              </p>

              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-forest">
                Complete Puppy Foundations
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/65">
                Everything from house training to socialization, in one guided
                course.
              </p>
            </div>

            <Link
              href="/puppy-training"
              className="group inline-flex items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Explore course
              <Arrow />
            </Link>
          </div>
        </section>
      </PageContainer>

      <Footer />
    </main>
  );
}

function SectionHeading({
  number,
  title,
  description,
  href,
}: {
  number: string;
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex gap-4">
        <span className="pt-1 text-xs font-semibold text-gold">{number}</span>

        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-forest">
            {title}
          </h2>
          <p className="mt-1 text-sm text-ink/55">{description}</p>
        </div>
      </div>

      {href && (
        <Link
          href={href}
          className="group w-fit text-sm font-medium text-forest underline decoration-gold underline-offset-4"
        >
          View all
          <Arrow />
        </Link>
      )}
    </div>
  );
}

function CourseCollection({
  eyebrow,
  title,
  href,
  items,
  color,
}: {
  eyebrow: string;
  title: string;
  href: string;
  items: string[];
  color: "orange" | "lavender";
}) {
  const colorClass =
    color === "orange"
      ? "bg-[#f5eadf]"
      : "bg-[#e9e4f0]";

  return (
    <div className={`rounded-2xl p-5 sm:p-6 ${colorClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-forest/45">
        {eyebrow}
      </p>

      <div className="mt-2 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold leading-snug text-forest">
          {title}
        </h3>

        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-forest underline decoration-gold underline-offset-4"
        >
          View
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {items.map((item, index) => (
          <div
            key={item}
            className="rounded-xl border border-forest/10 bg-white/55 px-3 py-3"
          >
            <span className="text-[10px] font-semibold text-forest/35">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-1 text-sm font-medium text-forest">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}