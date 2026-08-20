import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import TeamSection from "../components/TeamSection";
import { getPageImages } from "@/lib/queries/pageContent";
import { cldOptimized } from "@/lib/cloudinary";
import { LEADERSHIP, DIRECTORS, TEAM } from "../data/teamMembers";

export default async function AboutPage() {
  const { heroImage, heroVideo, extraImages } = await getPageImages("about");

  return (
    <main className="overflow-hidden bg-[#fcfaf6]">
      <Navbar />

      {/* =========================================================
          HERO — EDITORIAL / IMMERSIVE
      ========================================================= */}
      <section className="relative border-b border-forest/10">
        <PageContainer className="py-8 sm:py-12 lg:py-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-forest/40" />
                <p className="eyebrow mb-0">About Haven Paws</p>
              </div>

              <h1 className="text-forest font-serif text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.045em]">
                More than
                <span className="block italic font-light ml-[8%]">
                  a puppy.
                </span>
                <span className="block">A beginning.</span>
              </h1>

              <div className="mt-10 lg:mt-14 max-w-xl ml-auto lg:mr-8">
                <p className="text-lg sm:text-xl leading-relaxed text-forest/80">
                  At Haven Paws, we believe the moment you welcome a dog into
                  your life is the beginning of something extraordinary.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              {heroImage ? (
                <div className="relative">
                  <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 w-full h-full border border-forest/20 rounded-[2rem]" />

                  <div className="relative aspect-[4/5] sm:aspect-[5/6] overflow-hidden rounded-[1.75rem] bg-cream-alt">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cldOptimized(heroImage, 1000)}
                      alt="Our Story"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute -bottom-5 -left-3 sm:-bottom-7 sm:-left-7 bg-forest text-cream px-5 py-4 sm:px-7 sm:py-5 rounded-2xl shadow-xl max-w-[220px]">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-cream/60 mb-1">
                      Since
                    </p>
                    <p className="font-serif text-3xl sm:text-4xl leading-none">
                      2018
                    </p>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/5] rounded-[1.75rem] bg-cream-alt flex items-center justify-center">
                  <span className="text-forest/30 font-serif text-6xl">HP</span>
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* =========================================================
          OUR STORY
      ========================================================= */}
      <section className="relative">
        <PageContainer className="py-20 sm:py-28 lg:py-36">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs uppercase tracking-[0.22em] text-forest/50 mb-4">
                  01 / Our Story
                </p>
                <div className="w-12 h-px bg-forest/30" />
              </div>
            </div>

            <div className="lg:col-span-9">
              <h2 className="font-serif text-forest text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.03em] max-w-4xl mb-12">
                Bringing the right hearts together,
                <span className="italic font-light"> one family at a time.</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl">
                <p className="body-text">
                  At Haven Paws, we&apos;re passionate about bringing loving
                  families together with healthy, well-raised puppies from
                  carefully screened breeders across the country. Our goal is
                  to make the adoption journey safe, transparent, and enjoyable
                  while supporting ethical breeding practices and lifelong
                  responsible pet ownership.
                </p>

                <p className="body-text">
                  Every puppy deserves a nurturing start, every breeder deserves
                  a trusted partner, and every family deserves the confidence
                  that comes from choosing a puppy with care. That&apos;s the
                  philosophy behind everything we do.
                </p>

                <p className="body-text md:col-span-2 max-w-2xl md:ml-auto pt-4">
                  We&apos;ve helped many families welcome a new best friend
                  into their homes. Every successful match represents more than
                  a transaction — it&apos;s the beginning of a lifelong bond
                  filled with companionship, loyalty, and unforgettable
                  memories.
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* =========================================================
          MISSION — DARK MANIFESTO SECTION
      ========================================================= */}
      <section className="bg-forest text-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full border border-cream/10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full border border-cream/10 -translate-x-1/3 translate-y-1/3" />

        <PageContainer className="relative py-20 sm:py-28 lg:py-36">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.22em] text-cream/50">
                02 / Our Mission
              </p>
            </div>

            <div className="lg:col-span-9">
              <p className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-[1.04] tracking-[-0.035em] max-w-5xl">
                We connect exceptional puppies with exceptional families
                <span className="text-cream/45"> — without compromising on care,
                trust, or responsibility.</span>
              </p>

              <div className="mt-12 sm:mt-16 border-t border-cream/15 pt-8 grid md:grid-cols-[1fr_2fr] gap-8">
                <p className="text-xs uppercase tracking-[0.2em] text-cream/50">
                  What guides us
                </p>

                <p className="text-base sm:text-lg leading-relaxed text-cream/80 max-w-3xl">
                  Our mission is simple: connect exceptional puppies with
                  exceptional families while maintaining the highest standards
                  of animal welfare, breeder accountability, and customer care.
                  From the moment a breeder joins our network until a puppy
                  settles into its forever home, we focus on health,
                  transparency, and personalized support every step of the way.
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* =========================================================
          SINCE 2018
      ========================================================= */}
      {extraImages.years_in_business && (
        <section className="py-5 sm:py-8">
          <PageContainer>
            <div className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[720px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-forest">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cldOptimized(extraImages.years_in_business, 1400)}
                alt="Since 2018"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-12 lg:p-16">
                <div className="max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/70 mb-5">
                    Our Journey
                  </p>

                  <h2 className="font-serif text-white text-4xl sm:text-5xl lg:text-7xl leading-[1.02] tracking-[-0.035em]">
                    We&apos;ve been connecting families with healthy puppies
                    <span className="italic font-light"> since 2018.</span>
                  </h2>
                </div>
              </div>

              <div className="absolute top-7 right-7 sm:top-10 sm:right-10 w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-white/40 flex items-center justify-center">
                <span className="font-serif text-white text-lg sm:text-2xl">
                  08→
                </span>
              </div>
            </div>
          </PageContainer>
        </section>
      )}

      {/* =========================================================
          VIDEO EXPERIENCE
      ========================================================= */}
      {heroVideo && (
        <section className="py-20 sm:py-28">
          <PageContainer>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10 sm:mb-14">
                <p className="eyebrow mb-4">Real Stories</p>
                <h2 className="font-serif text-forest text-4xl sm:text-5xl lg:text-6xl tracking-[-0.035em]">
                  Life-changing,
                  <span className="italic font-light"> four paws at a time.</span>
                </h2>
              </div>

              <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl bg-black">
                <video
                  src={heroVideo}
                  controls
                  className="w-full aspect-video"
                />
              </div>
            </div>
          </PageContainer>
        </section>
      )}

      {/* =========================================================
          PEOPLE
      ========================================================= */}
      <section className="border-t border-forest/10">
        <PageContainer className="pt-20 sm:pt-28 pb-6">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">The People Behind Haven Paws</p>
            <h2 className="font-serif text-forest text-4xl sm:text-5xl lg:text-6xl leading-[1.03] tracking-[-0.035em]">
              A team built around one shared belief:
              <span className="italic font-light"> every good match matters.</span>
            </h2>
          </div>
        </PageContainer>

        <TeamSection
          title="Leadership"
          people={LEADERSHIP}
          extraImages={extraImages}
        />

        <div className="bg-cream-alt border-y border-forest/5">
          <TeamSection
            title="Directors"
            people={DIRECTORS}
            extraImages={extraImages}
          />
        </div>

        <TeamSection
          title="Our Team"
          people={TEAM}
          extraImages={extraImages}
        />
      </section>

      {/* =========================================================
          THE HAVEN PAWS STANDARD
      ========================================================= */}
      <section className="relative bg-[#efe9dd] overflow-hidden">
        <div className="absolute right-[-8%] top-[10%] text-[18rem] sm:text-[25rem] font-serif leading-none text-forest/[0.035] select-none">
          HP
        </div>

        <PageContainer className="relative py-20 sm:py-28 lg:py-36">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-xs uppercase tracking-[0.22em] text-forest/50 mb-5">
                The Haven Paws Standard
              </p>

              <h2 className="font-serif text-forest text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.045em]">
                Built on
                <span className="block italic font-light ml-8">
                  trust.
                </span>
              </h2>

              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  "Health",
                  "Transparency",
                  "Responsibility",
                  "Support",
                  "Education",
                ].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full border border-forest/15 text-xs uppercase tracking-[0.12em] text-forest/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 lg:pt-2">
              <div className="space-y-8 sm:space-y-10 max-w-3xl">
                <p className="body-text">
                  Founded in 2018, Haven Paws has grown into one of
                  America&apos;s trusted online puppy adoption platforms. Our
                  mission is to connect responsible breeders with caring
                  families while maintaining exceptional standards of health,
                  transparency, and customer support throughout every step of
                  the journey.
                </p>

                <p className="body-text">
                  Over the years, we&apos;ve helped thousands of families welcome
                  happy, healthy puppies into loving homes. By combining modern
                  technology with personalized guidance, we&apos;ve made the puppy
                  adoption process safer, simpler, and more enjoyable for
                  everyone involved.
                </p>

                <p className="body-text">
                  Every breeder accepted into the Haven Paws network goes
                  through a careful screening process designed to promote
                  responsible breeding practices and protect puppy welfare. We
                  partner only with breeders who share our commitment to ethical
                  care, proper socialization, and healthy development.
                </p>

                <p className="body-text">
                  Our experienced Puppy Advisors remain available throughout the
                  adoption process, helping families choose the right breed,
                  prepare for their new companion, and feel supported even after
                  their puppy arrives home.
                </p>

                <p className="body-text">
                  We also believe education is an important part of responsible
                  pet ownership. That&apos;s why Haven Paws provides helpful
                  resources covering puppy care, nutrition, training,
                  socialization, and long-term wellness so every family can feel
                  confident from day one.
                </p>

                <div className="pt-8 mt-4 border-t border-forest/15">
                  <p className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-snug text-forest">
                    At Haven Paws, we&apos;re more than a puppy marketplace
                    <span className="text-forest/50"> — we&apos;re a community
                    of passionate dog lovers dedicated to building lifelong
                    connections between families and their newest four-legged
                    companions.</span>
                  </p>

                  <p className="body-text mt-6">
                    Every successful adoption represents the beginning of a
                    friendship built on trust, loyalty, and unconditional love.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* =========================================================
          CLOSING BRAND MOMENT
      ========================================================= */}
      <section className="bg-forest text-cream">
        <PageContainer className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-cream/50 mb-6">
              Haven Paws
            </p>

            <p className="font-serif text-[clamp(3rem,7vw,7rem)] leading-[0.95] tracking-[-0.045em]">
              Where lifelong
              <span className="block italic font-light text-cream/80">
                friendships begin.
              </span>
            </p>

            <div className="mt-10 flex justify-center">
              <span className="w-px h-16 bg-cream/30" />
            </div>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </main>
  );
}