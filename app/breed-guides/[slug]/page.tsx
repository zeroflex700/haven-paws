import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import Breadcrumbs from "../../components/Breadcrumbs";
import BreedGuideTabs from "../../components/BreedGuideTabs";
import BreedGuideArticleSection from "../../components/BreedGuideArticleSection";
import BreedGuideScorecard from "../../components/BreedGuideScorecard";
import BreedGuideAtAGlance from "../../components/BreedGuideAtAGlance";
import BrowsePuppiesCard from "../../components/BrowsePuppiesCard";
import BreedGuideRelated from "../../components/BreedGuideRelated";
import FaqAccordion from "../../components/FaqAccordion";
import OptimizedImage from "../../components/OptimizedImage";
import {
  getBreedGuideBySlug,
  getBreedLiveStats,
  getHealthIssues,
  getGuideFaqs,
  getRelatedBreeds,
} from "@/lib/queries/breedGuides";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-forest/60">
      {children}
    </p>
  );
}

export default async function BreedGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getBreedGuideBySlug(slug);

  if (!guide) notFound();

  const [stats, healthIssues, faqs, related] = await Promise.all([
    getBreedLiveStats(guide.breedId),
    getHealthIssues(guide.id),
    getGuideFaqs(guide.id),
    getRelatedBreeds(guide.relatedBreedIds),
  ]);

  const breedPlural = `${guide.breedName}s`;

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navbar />

      {/* ─────────────────────────────────────────────────────────────
          BREADCRUMBS
      ───────────────────────────────────────────────────────────── */}
      <PageContainer className="max-w-7xl pt-6 pb-5">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Breed Guides", href: "/breed-guides" },
            { label: breedPlural },
          ]}
        />
      </PageContainer>

      {/* ─────────────────────────────────────────────────────────────
          HERO
      ───────────────────────────────────────────────────────────── */}
      <PageContainer className="max-w-7xl pb-8 md:pb-12">
        <section className="relative overflow-hidden rounded-[2rem] bg-forest">
          <div className="absolute inset-0">
            {guide.heroImageUrl ? (
              <>
                <OptimizedImage
                  src={guide.heroImageUrl}
                  alt={guide.breedName}
                  priority
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-forest via-[#244536] to-[#10291d]" />
            )}
          </div>

          <div className="relative flex min-h-[500px] items-end px-6 py-8 sm:px-10 sm:py-12 lg:min-h-[620px] lg:px-16 lg:py-16">
            <div className="max-w-3xl text-white">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#d8b77b]" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                  Complete Breed Guide
                </span>
              </div>

              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/65">
                Get to know
              </p>

              <h1 className="mb-5 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
                {breedPlural}
              </h1>

              {guide.overviewSupport && (
                <p className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl">
                  {guide.overviewSupport}
                </p>
              )}

              {guide.authorName && (
                <div className="mt-8 flex items-center gap-3">
                  {guide.authorPhotoUrl && (
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/30 bg-white/10">
                      <OptimizedImage
                        src={guide.authorPhotoUrl}
                        alt={guide.authorName}
                        sizes="40px"
                      />
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-white">
                      Written by {guide.authorName}
                    </p>
                    {guide.authorCredential && (
                      <p className="text-xs text-white/60">
                        {guide.authorCredential}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Premium bottom detail */}
          <div className="relative border-t border-white/10 bg-black/15 px-6 py-4 backdrop-blur-sm sm:px-10 lg:px-16">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
              <span>
                Temperament · Health · Grooming · Training · History
              </span>
              {guide.photoCredit && (
                <span className="text-white/45">{guide.photoCredit}</span>
              )}
            </div>
          </div>
        </section>
      </PageContainer>

      {/* ─────────────────────────────────────────────────────────────
          STICKY SECTION NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 border-y border-black/5 bg-[#faf9f6]/90 backdrop-blur-xl">
        <BreedGuideTabs />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          EDITORIAL OVERVIEW
      ───────────────────────────────────────────────────────────── */}
      <PageContainer className="max-w-7xl py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div className="max-w-3xl">
            <SectionLabel>The breed, in a nutshell</SectionLabel>

            {guide.overviewQuote && (
              <h2 className="max-w-3xl text-3xl font-semibold leading-[1.12] tracking-[-0.035em] text-forest sm:text-4xl lg:text-5xl">
                {guide.overviewQuote}
              </h2>
            )}

            {!guide.overviewQuote && (
              <h2 className="text-3xl font-semibold tracking-[-0.035em] text-forest sm:text-4xl">
                Everything you need to know before bringing one home.
              </h2>
            )}

            {guide.overviewSupport && (
              <div className="mt-7 max-w-2xl border-l-2 border-[#d8b77b] pl-5">
                <p className="body-text text-lg leading-relaxed">
                  {guide.overviewSupport}
                </p>
              </div>
            )}

            <div className="mt-10">
              <BrowsePuppiesCard
                breedName={guide.breedName}
                image={guide.heroImageUrl}
                count={stats.count}
                avgPrice={stats.avgPrice}
              />
            </div>
          </div>

          {/* Desktop breed intelligence panel */}
          <aside className="rounded-[1.75rem] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(24,46,35,0.08)] lg:sticky lg:top-28">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <SectionLabel>Quick profile</SectionLabel>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-forest">
                  At a Glance
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3efe7] text-lg">
                🐾
              </div>
            </div>

            <BreedGuideAtAGlance scorecard={guide.scorecard} />
          </aside>
        </div>
      </PageContainer>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT
      ───────────────────────────────────────────────────────────── */}
      <PageContainer className="max-w-7xl pb-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* ARTICLE */}
          <article className="min-w-0">
            {guide.whyPeopleLove && (
              <section className="mb-14 rounded-[1.75rem] border border-black/[0.05] bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
                <SectionLabel>Why owners fall in love</SectionLabel>
                <BreedGuideArticleSection
                  summary="Why People Love the Breed"
                  body={guide.whyPeopleLove}
                />
              </section>
            )}

            {/* APPEARANCE */}
            <section
              id="appearance"
              className="scroll-mt-32 border-t border-black/[0.08] py-12 md:py-16"
            >
              <div className="mb-8">
                <SectionLabel>Looks & maintenance</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.035em] text-forest sm:text-4xl">
                  Appearance & Grooming
                </h2>
              </div>

              <div className="space-y-6">
                {guide.appearanceText && (
                  <BreedGuideArticleSection
                    summary="Appearance"
                    body={guide.appearanceText}
                    image={guide.appearanceImageUrl}
                    credit={guide.appearanceCredit}
                  />
                )}

                {guide.groomingText && (
                  <BreedGuideArticleSection
                    summary="Grooming"
                    body={guide.groomingText}
                    image={guide.groomingImageUrl}
                    credit={guide.groomingCredit}
                  />
                )}
              </div>
            </section>

            {/* TEMPERAMENT */}
            <section
              id="temperament"
              className="scroll-mt-32 border-t border-black/[0.08] py-12 md:py-16"
            >
              <div className="mb-8">
                <SectionLabel>Personality & lifestyle</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.035em] text-forest sm:text-4xl">
                  Temperament & Characteristics
                </h2>
              </div>

              <div className="space-y-6">
                {guide.temperamentText && (
                  <BreedGuideArticleSection
                    summary="Breed Temperament and Characteristics"
                    body={guide.temperamentText}
                  />
                )}

                {guide.exerciseText && (
                  <BreedGuideArticleSection
                    summary="Exercise"
                    body={guide.exerciseText}
                    image={guide.exerciseImageUrl}
                    credit={guide.exerciseCredit}
                  />
                )}

                {guide.trainingText && (
                  <BreedGuideArticleSection
                    summary="Training"
                    body={guide.trainingText}
                  />
                )}

                {guide.dietText && (
                  <BreedGuideArticleSection
                    summary="Diet and Nutrition"
                    body={guide.dietText}
                  />
                )}
              </div>
            </section>

            {/* HEALTH */}
            <section
              id="health"
              className="scroll-mt-32 border-t border-black/[0.08] py-12 md:py-16"
            >
              <div className="mb-8">
                <SectionLabel>Care with confidence</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.035em] text-forest sm:text-4xl">
                  Health & Wellness
                </h2>
              </div>

              {guide.healthIntroText && (
                <div className="mb-8">
                  <BreedGuideArticleSection
                    summary="Health Issues"
                    body={guide.healthIntroText}
                  />
                </div>
              )}

              {healthIssues.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {healthIssues.map((issue, index) => (
                    <div
                      key={issue.id}
                      className="group rounded-2xl border border-black/[0.06] bg-white p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-forest/45">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f1e9] text-sm">
                          ♥
                        </span>
                      </div>

                      <h3 className="mb-3 text-xl font-semibold tracking-[-0.02em] text-forest">
                        {issue.subheading}
                      </h3>

                      <p className="body-text text-sm leading-relaxed">
                        {issue.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* HISTORY */}
            <section
              id="history"
              className="scroll-mt-32 border-t border-black/[0.08] py-12 md:py-16"
            >
              <div className="mb-8">
                <SectionLabel>Where it all began</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.035em] text-forest sm:text-4xl">
                  History & Heritage
                </h2>
              </div>

              {guide.historyText && (
                <BreedGuideArticleSection
                  summary="History"
                  body={guide.historyText}
                  image={guide.historyImageUrl}
                  credit={guide.historyCredit}
                />
              )}

              {guide.historyImage2Url && (
                <div className="group relative mt-8 aspect-[3/4] overflow-hidden rounded-[1.5rem]">
                  <OptimizedImage
                    src={guide.historyImage2Url}
                    alt={`${guide.breedName} history`}
                    sizes="(max-width: 768px) 100vw, 900px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      Breed Heritage
                    </p>
                  </div>
                </div>
              )}
            </section>
          </article>

          {/* DESKTOP CONTENT MAP */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-[1.5rem] border border-black/[0.06] bg-white p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-forest/50">
                On this page
              </p>

              <nav className="space-y-1">
                {[
                  ["Appearance & Grooming", "#appearance"],
                  ["Temperament", "#temperament"],
                  ["Health & Wellness", "#health"],
                  ["History & Heritage", "#history"],
                  ["FAQs", "#faqs"],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className="block rounded-lg px-3 py-2.5 text-sm text-forest/65 transition-colors hover:bg-[#f5f1e9] hover:text-forest"
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <div className="mt-6 border-t border-black/[0.06] pt-5">
                <p className="text-sm font-medium text-forest">
                  Thinking about bringing one home?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-forest/60">
                  Explore currently available {guide.breedName} puppies.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>

      {/* ─────────────────────────────────────────────────────────────
          SCORECARD
      ───────────────────────────────────────────────────────────── */}
      <section className="border-y border-black/[0.06] bg-[#f2eee6]">
        <PageContainer className="max-w-7xl py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Personality, care & lifestyle</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-forest sm:text-4xl lg:text-5xl">
              The {guide.breedName} Scorecard
            </h2>
            <p className="mx-auto mt-4 max-w-2xl body-text">
              A quick way to understand what life with this breed can look like.
              Use these ratings as a starting point and remember that every dog
              is an individual.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl rounded-[1.75rem] bg-white p-6 shadow-[0_20px_60px_rgba(24,46,35,0.08)] sm:p-8">
            <BreedGuideScorecard scorecard={guide.scorecard} />
          </div>
        </PageContainer>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          AUTHOR
      ───────────────────────────────────────────────────────────── */}
      {guide.authorName && (
        <PageContainer className="max-w-4xl py-14">
          <section className="overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white">
            <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:items-center">
              {guide.authorPhotoUrl && (
                <div className="h-24 w-24 overflow-hidden rounded-full bg-[#f3efe7] ring-8 ring-[#faf9f6]">
                  <OptimizedImage
                    src={guide.authorPhotoUrl}
                    alt={guide.authorName}
                    sizes="96px"
                  />
                </div>
              )}

              <div>
                <SectionLabel>Meet the author</SectionLabel>

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-2xl font-semibold tracking-[-0.025em] text-forest">
                    {guide.authorName}
                  </h2>

                  {guide.authorCredential && (
                    <span className="text-sm text-forest/50">
                      {guide.authorCredential}
                    </span>
                  )}
                </div>

                {guide.authorBio && (
                  <p className="body-text mt-4 max-w-2xl leading-relaxed">
                    {guide.authorBio}
                  </p>
                )}
              </div>
            </div>
          </section>
        </PageContainer>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FAQ
      ───────────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section
          id="faqs"
          className="scroll-mt-32 border-t border-black/[0.06] bg-white"
        >
          <PageContainer className="max-w-4xl py-14 md:py-20">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <SectionLabel>Questions, answered</SectionLabel>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-forest sm:text-4xl lg:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="body-text mt-4">
                The things prospective owners most often want to know about
                {` ${breedPlural}`}.
              </p>
            </div>

            <FaqAccordion
              items={faqs.map((f) => ({
                question: f.question,
                answer: f.answer ?? "",
              }))}
            />
          </PageContainer>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          RELATED BREEDS
      ───────────────────────────────────────────────────────────── */}
      <PageContainer className="max-w-7xl py-14 md:py-20">
        <div className="mb-10 max-w-2xl">
          <SectionLabel>Keep exploring</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-forest sm:text-4xl">
            You might also love these breeds
          </h2>
          <p className="body-text mt-4">
            Discover more breeds with fascinating personalities, histories, and
            lifestyles to explore.
          </p>
        </div>

        <BreedGuideRelated breeds={related} />
      </PageContainer>

      <Footer />
    </main>
  );
}