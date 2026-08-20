import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import OptimizedImage from "../components/OptimizedImage";
import { getAllGuidedBreeds } from "@/lib/queries/breedGuides";

export default async function BreedGuidesIndexPage() {
  const breeds = (await getAllGuidedBreeds()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  const alphabet = Array.from(
    new Set(
      breeds
        .map((breed) => breed.name.charAt(0).toUpperCase())
        .filter((letter) => /^[A-Z]$/.test(letter))
    )
  ).sort();

  const featuredBreeds = breeds.slice(0, Math.min(3, breeds.length));

  return (
    <main className="min-h-screen bg-[#faf8f3]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-forest/10 bg-[#eef2e9]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#d9e5d2]/70 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#f3e6cf]/80 blur-3xl" />

          <div className="absolute right-[8%] top-16 text-[11rem] leading-none font-serif text-forest/[0.035] select-none">
            P
          </div>
        </div>

        <PageContainer className="relative py-16 sm:py-20 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-forest/10 bg-white/70 px-4 py-2 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#b8894c]" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-forest/70">
                For puppy parents
              </span>
            </div>

            <p className="eyebrow mb-4">The Haven Paws Breed Library</p>

            <h1 className="font-serif text-5xl leading-[0.98] tracking-tight text-forest sm:text-6xl lg:text-7xl">
              Find the breed that
              <span className="block italic text-[#a06d3b]">
                feels like home.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-forest/70 sm:text-lg">
              Explore our growing collection of detailed dog breed guides.
              Discover each breed&apos;s personality, care needs, lifestyle
              fit, and the little traits that make them wonderfully unique.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#all-breeds"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Explore all breeds
                <span aria-hidden="true">↓</span>
              </a>

              <a
                href="#featured"
                className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/70 px-6 py-3 text-sm font-semibold text-forest transition duration-300 hover:bg-white"
              >
                Discover featured breeds
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="mt-14 grid max-w-2xl grid-cols-3 border-t border-forest/10 pt-7">
              <div className="border-r border-forest/10 pr-4">
                <p className="font-serif text-3xl text-forest sm:text-4xl">
                  {breeds.length}+
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-forest/55">
                  Breed guides
                </p>
              </div>

              <div className="border-r border-forest/10 px-4">
                <p className="font-serif text-3xl text-forest sm:text-4xl">
                  A–Z
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-forest/55">
                  Easy to explore
                </p>
              </div>

              <div className="pl-4">
                <p className="font-serif text-3xl text-forest sm:text-4xl">
                  1
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-forest/55">
                  Trusted library
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* INTRO */}
      <section className="bg-[#faf8f3]">
        <PageContainer className="py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="eyebrow mb-3">Explore with confidence</p>

              <h2 className="font-serif text-4xl leading-tight text-forest sm:text-5xl">
                Every dog is different.
                <span className="block italic text-[#a06d3b]">
                  Every match matters.
                </span>
              </h2>
            </div>

            <div className="max-w-2xl lg:pb-1">
              <p className="text-base leading-8 text-forest/65 sm:text-lg">
                A breed can tell you a lot about a dog&apos;s typical needs and
                tendencies, but personality is always individual. Use these
                guides as a thoughtful starting point as you learn which dogs
                may suit your home, family, routine, and lifestyle.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* FEATURED BREEDS */}
      {featuredBreeds.length > 0 && (
        <section
          id="featured"
          className="border-y border-forest/10 bg-[#e8eee4]"
        >
          <PageContainer className="py-14 sm:py-20">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow mb-3">Start here</p>
                <h2 className="font-serif text-4xl text-forest sm:text-5xl">
                  Explore the library
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-forest/60">
                Begin with a few breeds, or head straight into the complete
                collection below.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {featuredBreeds.map((breed, index) => (
                <Link
                  key={breed.id}
                  href={`/breed-guides/${breed.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-cream-alt">
                    {breed.imageUrl ? (
                      <OptimizedImage
                        src={breed.imageUrl}
                        alt={breed.name}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#dfe9d8] to-[#f1e7d6]">
                        <span className="font-serif text-8xl text-forest/10">
                          {breed.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#173b2b]/85 via-[#173b2b]/15 to-transparent opacity-90 transition duration-500 group-hover:opacity-100" />

                    <div className="absolute left-5 top-5">
                      <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-forest backdrop-blur">
                        Featured · 0{index + 1}
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="font-serif text-3xl text-white">
                        {breed.name}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white/85 transition duration-300 group-hover:gap-3">
                        Read breed guide
                        <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
      )}

      {/* ALL BREEDS */}
      <section id="all-breeds" className="scroll-mt-24 bg-[#faf8f3]">
        <PageContainer className="py-16 sm:py-24">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow mb-3">The complete collection</p>

            <h2 className="font-serif text-4xl leading-tight text-forest sm:text-5xl">
              Browse every breed,
              <span className="block italic text-[#a06d3b]">
                from A to Z.
              </span>
            </h2>

            <p className="mt-5 text-base leading-8 text-forest/65">
              Choose a breed to explore its dedicated guide and learn more
              about the qualities that make each one unique.
            </p>
          </div>

          {breeds.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-forest/20 bg-white px-6 py-16 text-center">
              <p className="font-serif text-2xl text-forest">
                Our breed library is growing.
              </p>
              <p className="mt-3 text-sm leading-7 text-forest/60">
                No breed guides are published yet — please check back soon.
              </p>
            </div>
          ) : (
            <>
              {/* A-Z NAVIGATION */}
              <div className="mb-10 border-y border-forest/10 py-4">
                <div className="flex flex-wrap gap-2">
                  {alphabet.map((letter) => (
                    <a
                      key={letter}
                      href={`#letter-${letter}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-forest/60 transition duration-200 hover:bg-forest hover:text-white"
                    >
                      {letter}
                    </a>
                  ))}
                </div>
              </div>

              {/* BREEDS GROUPED BY LETTER */}
              <div className="space-y-16">
                {alphabet.map((letter) => {
                  const letterBreeds = breeds.filter(
                    (breed) =>
                      breed.name.charAt(0).toUpperCase() === letter
                  );

                  return (
                    <section
                      key={letter}
                      id={`letter-${letter}`}
                      className="scroll-mt-28"
                    >
                      <div className="mb-7 flex items-center gap-5">
                        <span className="font-serif text-5xl text-[#a06d3b] sm:text-6xl">
                          {letter}
                        </span>

                        <div className="h-px flex-1 bg-forest/10" />

                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-forest/45">
                          {letterBreeds.length}{" "}
                          {letterBreeds.length === 1 ? "breed" : "breeds"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {letterBreeds.map((breed) => (
                          <Link
                            key={breed.id}
                            href={`/breed-guides/${breed.slug}`}
                            className="group"
                          >
                            <article>
                              <div className="relative aspect-[4/4.5] overflow-hidden rounded-xl bg-cream-alt shadow-sm transition duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
                                {breed.imageUrl ? (
                                  <OptimizedImage
                                    src={breed.imageUrl}
                                    alt={breed.name}
                                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#e7eee1] to-[#f3e8d9]">
                                    <span className="font-serif text-6xl text-forest/10 sm:text-7xl">
                                      {breed.name.charAt(0)}
                                    </span>
                                  </div>
                                )}

                                <div className="absolute inset-0 bg-forest/0 transition duration-500 group-hover:bg-forest/[0.04]" />

                                <div className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/90 text-forest opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                  →
                                </div>
                              </div>

                              <div className="flex items-start justify-between gap-2 pt-3">
                                <p className="text-sm font-semibold leading-5 text-forest transition group-hover:text-[#a06d3b]">
                                  {breed.name}
                                </p>

                                <span className="mt-0.5 text-xs text-forest/35 transition group-hover:text-[#a06d3b]">
                                  ↗
                                </span>
                              </div>
                            </article>
                          </Link>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          )}
        </PageContainer>
      </section>

      {/* DISCOVERY CTA */}
      <section className="bg-forest">
        <PageContainer className="py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7b77b]">
                Choosing a companion
              </p>

              <h2 className="font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                The best breed isn&apos;t simply the most beautiful one.
                <span className="block italic text-[#d7b77b]">
                  It&apos;s the one that fits your life.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                Consider your home, daily routine, experience, activity level,
                and the kind of relationship you hope to build. The right
                companion is about more than appearance — it&apos;s about a
                life that works beautifully together.
              </p>
            </div>

            <a
              href="#all-breeds"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-forest transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Explore all {breeds.length} breeds
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </main>
  );
}