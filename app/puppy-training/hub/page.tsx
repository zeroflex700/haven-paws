import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import TrainingCard from "../../components/TrainingCard";
import SectionTabs from "../../components/SectionTabs";

const TABS = [
  { id: "get-coaching", label: "Start Here" },
  { id: "first-week", label: "First Week" },
  { id: "courses", label: "Courses" },
  { id: "training-guides", label: "Guides" },
];

const JOURNEY_STEPS = [
  {
    number: "01",
    title: "Prepare",
    text: "Set up your home, routines, and expectations before your puppy arrives.",
  },
  {
    number: "02",
    title: "Settle In",
    text: "Navigate those important first days and build trust from the beginning.",
  },
  {
    number: "03",
    title: "Build Habits",
    text: "Create consistent routines for training, sleep, feeding, and everyday life.",
  },
  {
    number: "04",
    title: "Grow Together",
    text: "Keep building confidence, manners, and a happy lifelong relationship.",
  },
];

export default function PuppyTrainingHubPage() {
  return (
    <main className="bg-[#faf8f2]">
      <Navbar />
      <SectionTabs sections={TABS} />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-forest/10">
        <div className="absolute inset-0 bg-[#163d32]" />

        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#7ca58b]/20 blur-3xl" />

        <PageContainer className="relative z-10 py-14 sm:py-20 lg:py-24">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex h-2 w-2 rounded-full bg-gold animate-pulse" />
              <p className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-white/65 font-medium">
                Haven &amp; Paws Learning Academy
              </p>
            </div>

            <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-[-0.04em] leading-[0.98] text-white">
              Raise a happy puppy.
              <span className="block text-gold mt-2">One good habit at a time.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-white/70">
              A structured, self-paced program with live coaching and community
              support to help your puppy build good habits from day one.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#first-week"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-forest transition hover:scale-[1.02] hover:shadow-lg"
              >
                Begin your journey
                <span aria-hidden="true">→</span>
              </a>

              <a
                href="#courses"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Explore courses
              </a>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              ["Self-paced", "Learn in your own time"],
              ["Live coaching", "Guidance when you need it"],
              ["Practical", "Simple steps for real life"],
              ["Supportive", "You're not doing this alone"],
            ].map(([title, subtitle]) => (
              <div
                key={title}
                className="bg-[#163d32]/70 px-4 py-5 sm:px-6"
              >
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  {subtitle}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <PageContainer className="py-10 sm:py-14 lg:py-20">
        {/* INTRO / PROGRAM */}
        <section id="get-coaching" className="scroll-mt-28">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_1.95fr] lg:gap-14">
            <div>
              <p className="eyebrow mb-3">The program</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-forest leading-tight">
                Training should feel less overwhelming.
              </h2>
            </div>

            <div className="lg:pt-2">
              <p className="body-text text-base sm:text-lg leading-relaxed">
                Puppyhood moves quickly. The goal is not perfection — it is
                knowing what to focus on next. This hub brings together the
                essential lessons, courses, coaching, and practical resources
                you need as your puppy grows.
              </p>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <TrainingCard
                  title="Welcome"
                  byline="Puppy Training Team"
                  color="green"
                />

                <div className="rounded-xl border border-forest/10 bg-white p-5 shadow-[0_8px_30px_rgba(22,61,50,0.04)] transition hover:-translate-y-1">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                    <span className="text-[10px] tracking-wider uppercase text-ink/40">
                      Live
                    </span>
                  </div>
                  <p className="font-semibold text-forest text-sm mb-1">
                    Coaching Calls
                  </p>
                  <p className="text-xs leading-relaxed text-ink/60">
                    Next call: this week
                  </p>
                  <button className="mt-4 text-xs font-medium text-forest border-b border-gold pb-0.5 transition hover:text-gold">
                    RSVP →
                  </button>
                </div>

                <div className="rounded-xl border border-forest/10 bg-[#e9f0e9] p-5 transition hover:-translate-y-1">
                  <div className="mb-4 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                    <span className="h-1.5 w-1.5 rounded-full bg-forest/60" />
                    <span className="h-1.5 w-1.5 rounded-full bg-forest/30" />
                  </div>
                  <p className="font-semibold text-forest text-sm mb-1">
                    Private Community
                  </p>
                  <p className="text-xs leading-relaxed text-ink/60">
                    Connect with other owners and share the journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JOURNEY */}
        <section className="mt-16 sm:mt-24">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-7">
            <div>
              <p className="eyebrow mb-2">Your roadmap</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-forest">
                The puppyhood journey
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-ink/60">
              You do not need to do everything at once. Start where you are and
              take the next useful step.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY_STEPS.map((step, index) => (
              <div
                key={step.number}
                className="group relative min-h-[210px] rounded-2xl border border-forest/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="text-xs font-semibold tracking-[0.2em] text-gold">
                  {step.number}
                </span>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-forest">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">
                    {step.text}
                  </p>
                </div>

                {index < JOURNEY_STEPS.length - 1 && (
                  <span className="hidden lg:block absolute -right-2 top-1/2 z-10 text-gold text-lg">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FIRST WEEK */}
        <section
          id="first-week"
          className="scroll-mt-28 mt-16 sm:mt-24 rounded-3xl bg-forest p-5 sm:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
            <div className="max-w-xl">
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-gold mb-3">
                Start here
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
                Your First Week
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/65">
                The first few days can shape your puppy&apos;s routines for weeks
                to come. Focus on the essentials first.
              </p>
            </div>

            <Link
              href="/puppy-training/first-week"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View all
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
        <section id="courses" className="scroll-mt-28 mt-16 sm:mt-24">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow mb-2">Learn by topic</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-forest">
              Build the skills that matter most.
            </h2>
            <p className="mt-3 body-text">
              Choose the area you want to work on and move through each lesson
              at a pace that works for you and your puppy.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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

          {/* FEATURED LEARNING PATH */}
          <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="rounded-3xl bg-[#efe6d8] p-7 sm:p-10">
              <p className="text-[10px] tracking-[0.2em] uppercase font-medium text-forest/55">
                Featured learning path
              </p>

              <h3 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-forest leading-tight">
                Get started with
                <span className="block">Crate Training.</span>
              </h3>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink/65">
                Help your puppy see the crate as a calm, comfortable, and safe
                part of everyday life.
              </p>

              <Link
                href="/puppy-training/crate-training"
                className="inline-flex mt-7 items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
              >
                Explore the course
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TrainingCard title="Intro" color="orange" />
              <TrainingCard title="Supplies" color="orange" />
              <TrainingCard title="Love the Crate" color="orange" />
              <TrainingCard title="Stay Quiet" color="orange" />
            </div>
          </div>

          {/* HEALTH */}
          <div className="mt-14 border-t border-forest/10 pt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <p className="eyebrow mb-2">Care essentials</p>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-forest">
                  Health &amp; Wellness
                </h3>
              </div>

              <Link
                href="/puppy-training/health-wellness"
                className="text-sm font-medium text-forest border-b border-gold pb-0.5 w-fit transition hover:text-gold"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <TrainingCard title="Vaccinations" color="lavender" />
              <TrainingCard title="Feeding" color="lavender" />
              <TrainingCard title="Activity" color="lavender" />
              <TrainingCard title="Spay/Neuter" color="lavender" />
            </div>
          </div>
        </section>

        {/* GUIDES */}
        <section
          id="training-guides"
          className="scroll-mt-28 mt-16 sm:mt-24"
        >
          <div className="rounded-3xl border border-forest/10 bg-white p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
              <div className="max-w-xl">
                <p className="eyebrow mb-2">Keep it practical</p>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-forest">
                  Get Our Training Guides
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink/60">
                  Simple resources you can return to whenever you need a little
                  extra structure.
                </p>
              </div>

              <Link
                href="/puppy-training/training-guides"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-forest/15 px-4 py-2.5 text-sm font-medium text-forest transition hover:bg-cream-alt"
              >
                View all guides
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <TrainingCard title="First Day Checklist" color="gray" />
              <TrainingCard title="First Week Checklist" color="gray" />
              <TrainingCard title="Family Worksheet" color="gray" />
              <TrainingCard title="Sample Planner" color="gray" />
            </div>
          </div>
        </section>

        {/* FEATURED COURSE */}
        <section className="mt-16 sm:mt-24">
          <div className="relative overflow-hidden rounded-3xl bg-[#ddd9ec] p-7 sm:p-10 lg:p-14">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[30px] border-white/20" />
            <div className="absolute -bottom-24 right-1/4 h-52 w-52 rounded-full bg-white/15 blur-2xl" />

            <div className="relative z-10 max-w-2xl">
              <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-forest/55">
                Featured course
              </p>

              <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.02] text-forest">
                Complete Puppy Foundations
              </h2>

              <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink/65">
                Everything from house training to socialization, in one guided
                course.
              </p>

              <div className="mt-8">
                <TrainingCard
                  title="Complete Puppy Foundations"
                  description="Everything from house training to socialization, in one guided course."
                  color="lavender"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FINAL ENCOURAGEMENT */}
        <section className="py-16 sm:py-20 text-center">
          <div className="mx-auto max-w-2xl">
            <span className="inline-block h-10 w-px bg-gold mb-6" />
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-forest">
              Small lessons. Consistent practice. A lifetime of good habits.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink/60">
              There is no need to rush through puppyhood. Come back whenever
              you need guidance and take things one step at a time.
            </p>

            <a
              href="#get-coaching"
              className="inline-flex mt-7 items-center gap-2 text-sm font-semibold text-forest border-b border-gold pb-1 transition hover:text-gold"
            >
              Back to the beginning ↑
            </a>
          </div>
        </section>
      </PageContainer>

      <Footer />
    </main>
  );
}