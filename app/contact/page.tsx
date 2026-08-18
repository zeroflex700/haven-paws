import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import BreederApplicationForm from "../components/BreederApplicationForm";
import { getSettings } from "@/lib/queries/settings";

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-cream text-ink">
      <Navbar />

      {/* ================================================================
          HERO
      ================================================================= */}

      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full border border-gold/15" />
          <div className="absolute -top-20 -right-12 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        </div>

        <PageContainer className="relative max-w-7xl px-5 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-20 items-end py-16 sm:py-20 lg:py-24">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-gold font-semibold mb-5">
                Haven Paws Concierge
              </p>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.92] tracking-[-0.035em] max-w-3xl">
                Contact us.
                <br />
                <span className="text-cream/55">
                  We&apos;re here to help.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base sm:text-lg leading-8 text-cream/70">
                At Haven Paws, we&apos;re committed to making every step of your
                puppy journey simple, enjoyable, and worry-free.
              </p>
            </div>

            <div className="lg:pb-2">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-sm p-6 sm:p-7">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gold font-medium mb-4">
                  How can we help?
                </p>

                <div className="space-y-3">
                  <a
                    href="#puppy-owners"
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 hover:bg-white/[0.08] transition-colors"
                  >
                    <span className="text-sm text-cream/90">
                      I&apos;m looking for a puppy
                    </span>
                    <span className="text-gold transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>

                  <a
                    href="#breeder-application"
                    className="group flex items-center justify-between rounded-2xl border border-gold/20 bg-gold/[0.08] px-4 py-3.5 hover:bg-gold/[0.12] transition-colors"
                  >
                    <span className="text-sm text-cream/90">
                      I&apos;m interested in becoming a breeder
                    </span>
                    <span className="text-gold transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>

                  <a
                    href="#current-breeders"
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 hover:bg-white/[0.08] transition-colors"
                  >
                    <span className="text-sm text-cream/90">
                      I&apos;m already a Haven Paws breeder
                    </span>
                    <span className="text-gold transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ================================================================
          INTRODUCTION
      ================================================================= */}

      <section className="bg-white border-b border-sage/10">
        <PageContainer className="max-w-7xl px-5 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-8 lg:gap-20 items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-sage font-semibold">
                Get in touch
              </p>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-forest tracking-tight mt-3">
                A real team,
                <br />
                ready to help.
              </h2>
            </div>

            <div className="max-w-3xl">
              <p className="text-base sm:text-lg leading-8 text-ink/70">
                At Haven Paws, we&apos;re committed to making every step of your
                puppy journey simple, enjoyable, and worry-free. Whether you&apos;re
                searching for a puppy, already welcomed one into your family, or
                interested in becoming one of our breeders, our team is ready to
                assist.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ================================================================
          SUPPORT PATHS
      ================================================================= */}

      <section
        id="puppy-owners"
        className="bg-cream border-b border-sage/10 scroll-mt-24"
      >
        <PageContainer className="max-w-7xl px-5 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20">
          <div className="grid md:grid-cols-2 gap-5 lg:gap-7">
            {/* Future Puppy Owners */}
            <div className="group rounded-[28px] border border-sage/10 bg-white p-6 sm:p-8 lg:p-9 shadow-[0_18px_60px_rgba(39,63,48,0.05)]">
              <div className="flex items-start justify-between gap-6">
                <div className="h-11 w-11 rounded-2xl bg-forest text-gold flex items-center justify-center text-sm font-medium">
                  01
                </div>

                <span className="text-[10px] uppercase tracking-[0.16em] text-sage">
                  Puppy search
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl text-forest mt-7">
                Future Puppy Owners
              </h3>

              <p className="text-sm sm:text-base text-ink/65 leading-7 mt-4">
                Searching for the right puppy? Our Haven Paws Puppy Advisors
                are here to help you choose the perfect companion based on your
                lifestyle, preferences, and family needs.
              </p>

              {settings.supportPhone && (
                <div className="mt-7 rounded-2xl bg-cream-alt/70 border border-sage/10 p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-sage mb-1.5">
                    Call Us
                  </p>

                  <a
                    href={`tel:${settings.supportPhone}`}
                    className="text-forest font-medium text-sm hover:text-forest-light transition-colors"
                  >
                    {settings.supportPhone}
                  </a>
                </div>
              )}

              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-sage mb-1">
                  Support Hours
                </p>

                <p className="text-sm text-ink/65 whitespace-pre-line leading-6">
                  {settings.supportHours}
                </p>
              </div>
            </div>

            {/* Current Puppy Families */}
            <div className="rounded-[28px] border border-sage/10 bg-white p-6 sm:p-8 lg:p-9 shadow-[0_18px_60px_rgba(39,63,48,0.05)]">
              <div className="flex items-start justify-between gap-6">
                <div className="h-11 w-11 rounded-2xl bg-gold text-forest flex items-center justify-center text-sm font-medium">
                  02
                </div>

                <span className="text-[10px] uppercase tracking-[0.16em] text-sage">
                  Existing families
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl text-forest mt-7">
                Current Puppy Families
              </h3>

              <p className="text-sm sm:text-base text-ink/65 leading-7 mt-4">
                Already adopted your puppy through Haven Paws? Our support team
                is always available to answer your questions, provide guidance,
                and help with anything related to your puppy after adoption.
              </p>

              <p className="text-sm sm:text-base text-ink/65 leading-7 mt-4">
                Visit our Help Center anytime to find answers, resources, and
                contact options.
              </p>

              <Link
                href="/help-center"
                className="inline-flex items-center justify-center mt-7 rounded-full bg-forest text-cream px-5 py-3 text-sm font-medium hover:bg-forest-light transition-colors"
              >
                Visit Help Center
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ================================================================
          BREEDER APPLICATION HERO
      ================================================================= */}

      <section
        id="breeder-application"
        className="relative bg-forest text-cream scroll-mt-20 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-[-100px] h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute top-40 right-[-30px] h-[260px] w-[260px] rounded-full border border-gold/10" />
          <div className="absolute bottom-[-180px] left-[-120px] h-[420px] w-[420px] rounded-full bg-gold/5 blur-3xl" />
        </div>

        <PageContainer className="relative max-w-7xl px-5 sm:px-6 lg:px-10">
          <div className="py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3.5 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-gold font-semibold">
                  Breeder Partnership
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-[-0.03em] mt-6">
                Build the next generation
                <span className="text-cream/45"> of trusted homes.</span>
              </h2>

              <p className="text-base sm:text-lg leading-8 text-cream/65 max-w-2xl mt-6">
                Interested in partnering with Haven Paws? Our Breeder Relations
                team is dedicated to helping responsible breeders through every
                stage of the application process. We carefully review each
                application to ensure our standards for health, ethics, and
                animal welfare are maintained.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 mt-9">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-gold text-sm font-medium">01</p>
                  <p className="text-xs text-cream/65 mt-2">
                    Submit your information
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-gold text-sm font-medium">02</p>
                  <p className="text-xs text-cream/65 mt-2">
                    Application review
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-gold text-sm font-medium">03</p>
                  <p className="text-xs text-cream/65 mt-2">
                    Team follow-up
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,0.72fr)_minmax(500px,1.28fr)] gap-8 lg:gap-12 mt-14 lg:mt-16 items-start">
              {/* Partnership information */}
              <aside className="lg:sticky lg:top-24">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.055] backdrop-blur-sm p-6 sm:p-7">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gold font-semibold">
                    Before you begin
                  </p>

                  <h3 className="font-display text-2xl sm:text-3xl text-cream mt-3">
                    A thoughtful application process.
                  </h3>

                  <p className="text-sm text-cream/60 leading-6 mt-4">
                    To get started, complete our breeder application form below,
                    or contact us by email at{" "}
                    <a
                      href={`mailto:${settings.breederEmail}`}
                      className="text-gold underline underline-offset-2"
                    >
                      {settings.breederEmail}
                    </a>
                    .
                  </p>

                  <div className="h-px bg-white/10 my-6" />

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-gold font-medium mb-1.5">
                      Office Hours
                    </p>

                    <p className="text-sm text-cream/65 whitespace-pre-line leading-6">
                      {settings.breederHours}
                    </p>
                  </div>

                  <div className="mt-7 rounded-2xl bg-gold/10 border border-gold/15 p-4">
                    <p className="text-xs text-cream/80 leading-5">
                      We carefully review each application to ensure our
                      standards for health, ethics, and animal welfare are
                      maintained.
                    </p>
                  </div>
                </div>
              </aside>

              {/* Application */}
              <div className="min-w-0">
                <BreederApplicationForm />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ================================================================
          CURRENT BREEDERS
      ================================================================= */}

      <section
        id="current-breeders"
        className="bg-white border-b border-sage/10 scroll-mt-24"
      >
        <PageContainer className="max-w-7xl px-5 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-8 lg:gap-20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-sage font-semibold">
                Partner support
              </p>

              <h3 className="font-display text-3xl sm:text-4xl text-forest mt-3">
                Current Breeders
              </h3>
            </div>

            <div className="max-w-3xl">
              <p className="text-sm sm:text-base text-ink/65 leading-7">
                Already part of the Haven Paws breeder network? Our Breeder
                Success team is available to assist with program updates,
                account support, compliance questions, and any other assistance
                you may need. We&apos;re committed to supporting our breeder
                partners every step of the way.
              </p>

              <div className="mt-6 rounded-2xl border border-sage/10 bg-cream-alt/50 p-5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-sage mb-2">
                  Breeder Success
                </p>

                <p className="text-sm text-ink/65">
                  Email us anytime at{" "}
                  <a
                    href={`mailto:${settings.breederEmail}`}
                    className="font-medium text-forest underline underline-offset-2"
                  >
                    {settings.breederEmail}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ================================================================
          FINAL CTA
      ================================================================= */}

      <section className="bg-cream-alt">
        <PageContainer className="max-w-7xl px-5 sm:px-6 lg:px-10 py-16 sm:py-20">
          <div className="relative overflow-hidden rounded-[32px] bg-gold px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border border-forest/10" />
            <div className="absolute -right-4 -top-12 h-40 w-40 rounded-full border border-forest/10" />

            <div className="relative max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-forest/60 font-semibold mb-3">
                Your next step
              </p>

              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-forest tracking-tight">
                Continue Your Puppy Search
              </h3>

              <p className="text-sm sm:text-base text-forest/70 leading-7 max-w-2xl mt-4">
                Still looking for your perfect companion? Browse our available
                puppies and discover healthy, responsibly raised companions
                from trusted Haven Paws breeders.
              </p>

              <Link
                href="/puppies"
                className="inline-flex items-center justify-center mt-7 rounded-full bg-forest text-cream px-6 py-3.5 text-sm font-medium hover:bg-forest-light transition-colors"
              >
                Browse All Puppies
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </main>
  );
}