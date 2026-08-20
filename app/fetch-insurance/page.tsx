import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPageImages } from "@/lib/queries/pageContent";
import { cldOptimized } from "@/lib/cloudinary";

export default async function FetchInsurancePage() {
  const { heroImage, extraImages } = await getPageImages("fetch-insurance");

  return (
    <main className="overflow-hidden bg-white">
      <Navbar />

      {/* PREMIUM HERO */}
      <section className="relative bg-cream-alt">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-cream blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sage/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pt-10 sm:pt-14 lg:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sage/20 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-sage shadow-sm">
              <span className="h-2 w-2 rounded-full bg-sage" />
              Puppy Care & Protection
            </div>

            <p className="eyebrow mb-4">Puppy Care</p>

            <h1 className="font-display text-4xl leading-[1.08] text-forest sm:text-5xl lg:text-6xl">
              Protect Their
              <span className="block italic text-sage">Little Adventures.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
              Bringing home a puppy means embracing every joyful, curious, and
              unpredictable moment. Pet insurance can help you feel more prepared
              for the unexpected along the way.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-full border border-forest/10 bg-white px-5 py-2.5 shadow-sm">
                <span className="text-sm font-medium text-forest">
                  Haven Paws × Fetch
                </span>
              </div>

              <div className="rounded-full border border-forest/10 bg-white px-5 py-2.5 shadow-sm">
                <span className="text-sm font-medium text-sage">
                  Save 10% Every Month for One Full Year
                </span>
              </div>
            </div>
          </div>

          {heroImage && (
            <div className="relative mx-auto mt-12 max-w-6xl pb-10 sm:pb-14">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-white/50 blur-2xl" />

              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/80 shadow-[0_25px_80px_rgba(35,68,52,0.15)] sm:aspect-[16/7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cldOptimized(heroImage, 1600)}
                  alt="Pet insurance for your puppy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* QUICK TRUST BAR */}
      <section className="border-y border-forest/5 bg-white">
        <div className="mx-auto grid max-w-6xl divide-y divide-forest/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-6 py-7 text-center">
            <p className="font-display text-2xl text-forest">Up to 90%</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-ink/45">
              Eligible Expense Reimbursement
            </p>
          </div>

          <div className="px-6 py-7 text-center">
            <p className="font-display text-2xl text-forest">Any Vet</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-ink/45">
              Licensed U.S. or Canadian Veterinarian
            </p>
          </div>

          <div className="px-6 py-7 text-center">
            <p className="font-display text-2xl text-forest">10%</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-ink/45">
              Haven Paws Customer Savings
            </p>
          </div>
        </div>
      </section>

      {/* ARTICLE */}
      <article className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center">
          {/* DESKTOP CONTENT NAVIGATION */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-forest/5 bg-cream-alt/60 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-sage">
                On This Page
              </p>

              <nav className="mt-4 space-y-3">
                <a href="#partnership" className="block text-sm text-ink/60 transition hover:text-forest">
                  Haven Paws × Fetch
                </a>
                <a href="#what-is-insurance" className="block text-sm text-ink/60 transition hover:text-forest">
                  What Is Pet Insurance?
                </a>
                <a href="#fetch" className="block text-sm text-ink/60 transition hover:text-forest">
                  About Fetch
                </a>
                <a href="#how-it-works" className="block text-sm text-ink/60 transition hover:text-forest">
                  How It Works
                </a>
                <a href="#covered" className="block text-sm text-ink/60 transition hover:text-forest">
                  What&apos;s Covered?
                </a>
                <a href="#not-covered" className="block text-sm text-ink/60 transition hover:text-forest">
                  What&apos;s Not Covered?
                </a>
                <a href="#right-coverage" className="block text-sm text-ink/60 transition hover:text-forest">
                  Choosing Coverage
                </a>
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            {/* AUTHOR */}
            <div className="rounded-2xl border border-forest/5 bg-white p-5 shadow-[0_12px_40px_rgba(35,68,52,0.06)] sm:p-6">
              <div className="flex items-center gap-4">
                {extraImages.author_photo && (
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-cream-alt ring-4 ring-cream-alt">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cldOptimized(extraImages.author_photo, 150)}
                      alt="Dr. David Shaw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-forest">
                    By Dr. David Shaw
                  </p>
                  <p className="mt-1 text-sm text-ink/55">
                    March 27, 2021
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-forest/5 pt-5">
                <p className="text-sm italic leading-relaxed text-ink/65">
                  The author is Haven Paws&apos; Director of Digital Marketing and
                  has spent many years caring for dogs. As a proud dog owner and
                  passionate advocate for responsible breeding, they are committed
                  to helping puppies receive the best possible start in life while
                  educating pet owners with reliable information.
                </p>

                <div className="mt-4 inline-flex rounded-full bg-cream-alt px-4 py-2 text-xs font-medium text-forest">
                  Reviewed and Fact-Checked by Michael Alex, DVM
                </div>
              </div>
            </div>

            <div className="gold-rule my-10" />

            {/* INTRODUCTION */}
            <section id="partnership" className="scroll-mt-28">
              <p className="eyebrow mb-3">Peace of Mind</p>

              <h2 className="font-display text-3xl leading-tight text-forest sm:text-4xl">
                Haven Paws Has Partnered With Fetch to Offer an Exclusive
                Discount for Haven Paws Customers
              </h2>

              <div className="mt-6 space-y-5 text-[15px] leading-8 text-ink/80 sm:text-base">
                <p>
                  Bringing home a puppy is an exciting experience. Puppies are
                  naturally curious and eager to explore everything around them,
                  from unfamiliar scents to new people and interesting objects.
                  While their adventurous nature is part of the fun, it can also
                  expose them to accidents and unexpected health issues.
                </p>

                <p>
                  This is where pet insurance becomes valuable. Similar to health
                  insurance for people, pet insurance helps cover eligible
                  veterinary expenses when your puppy becomes sick or injured. It
                  offers peace of mind by reducing the financial burden of
                  unexpected medical care. But what exactly does pet insurance
                  include?
                </p>
              </div>
            </section>

            {/* WHAT IS PET INSURANCE */}
            <section id="what-is-insurance" className="scroll-mt-28 mt-12">
              <div className="rounded-2xl bg-cream-alt p-7 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-sage">
                  The Basics
                </p>

                <h2 className="mt-3 font-display text-2xl text-forest sm:text-3xl">
                  What Is Pet Insurance?
                </h2>

                <p className="mt-4 leading-8 text-ink/75">
                  Pet insurance is designed to help pay for veterinary treatment
                  when your dog becomes ill or suffers an injury.
                </p>
              </div>
            </section>

            {/* FETCH */}
            <section id="fetch" className="scroll-mt-28 mt-14">
              <div className="flex flex-col gap-8 rounded-[1.5rem] border border-forest/5 bg-white p-7 shadow-[0_15px_50px_rgba(35,68,52,0.07)] sm:p-9">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
                  <div className="max-w-xl">
                    <p className="eyebrow mb-3">Exclusive Haven Paws Offer</p>

                    <h2 className="font-display text-3xl leading-tight text-forest">
                      Fetch Pet Insurance
                    </h2>

                    <p className="mt-3 text-lg font-medium leading-relaxed text-sage">
                      Haven Paws Customers Save 10% Every Month for One Full Year
                    </p>
                  </div>

                  {extraImages.partner_logo && (
                    <div className="w-36 shrink-0 rounded-xl bg-cream-alt p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cldOptimized(extraImages.partner_logo, 300)}
                        alt="Fetch Pet Insurance"
                        className="h-auto w-full"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-5 leading-8 text-ink/80">
                  <p>
                    Fetch Pet Insurance helps reduce the cost of veterinary care
                    for both dogs and cats. Its comprehensive coverage includes
                    accidents, illnesses, hereditary conditions, dental disease
                    affecting adult teeth, examination fees, and many other
                    eligible treatments.
                  </p>

                  <p>
                    With Fetch, you can visit any licensed veterinarian in the
                    United States or Canada. The company is highly rated by
                    customers and reimburses up to 90% of eligible veterinary
                    expenses.
                  </p>

                  <p>
                    Plans are flexible and can be customized to fit different
                    budgets. Annual coverage limits range from $2,500 to
                    unlimited, and customers can choose between annual or
                    per-condition deductibles. Reimbursement options of 70%, 80%,
                    or 90% are available based on the veterinarian&apos;s invoice.
                  </p>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="scroll-mt-28 mt-16">
              <div className="mb-8 text-center">
                <p className="eyebrow mb-3">A Simple Process</p>
                <h2 className="font-display text-3xl text-forest sm:text-4xl">
                  How Fetch Works
                </h2>
              </div>

              <div className="space-y-5">
                <div className="relative overflow-hidden rounded-2xl border border-forest/5 bg-white p-6 sm:p-7">
                  <div className="absolute right-5 top-2 font-display text-7xl text-cream-alt">
                    01
                  </div>

                  <div className="relative">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-medium text-white">
                      1
                    </span>

                    <h3 className="mt-4 text-lg font-medium text-forest">
                      Visit Any Licensed Veterinarian
                    </h3>

                    <p className="mt-2 leading-7 text-ink/70">
                      You&apos;re free to continue seeing your current veterinarian
                      or choose a different one whenever needed. Coverage also
                      extends to veterinary specialists and emergency animal
                      hospitals.
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-forest/5 bg-white p-6 sm:p-7">
                  <div className="absolute right-5 top-2 font-display text-7xl text-cream-alt">
                    02
                  </div>

                  <div className="relative">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-medium text-white">
                      2
                    </span>

                    <h3 className="mt-4 text-lg font-medium text-forest">
                      Submit a Claim Quickly
                    </h3>

                    <p className="mt-2 leading-7 text-ink/70">
                      Simply upload photos of your veterinary invoices, answer a
                      few questions about your pet&apos;s treatment, and Fetch
                      handles the rest of the claims process.
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-forest/5 bg-white p-6 sm:p-7">
                  <div className="absolute right-5 top-2 font-display text-7xl text-cream-alt">
                    03
                  </div>

                  <div className="relative">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-medium text-white">
                      3
                    </span>

                    <h3 className="mt-4 text-lg font-medium text-forest">
                      Receive Your Reimbursement Faster
                    </h3>

                    <p className="mt-2 leading-7 text-ink/70">
                      Once your claim is approved, you can receive reimbursement
                      for up to 90% of eligible veterinary costs through direct
                      deposit in as little as two days. Most claims are processed
                      within 15 days after all required documents have been
                      received, and you&apos;ll receive email updates throughout the
                      process.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* COVERAGE */}
            <section id="covered" className="scroll-mt-28 mt-16">
              <div className="rounded-[1.5rem] bg-forest p-7 sm:p-9">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-cream/60">
                  Protection
                </p>

                <h2 className="mt-3 font-display text-3xl text-white">
                  What&apos;s Covered?
                </h2>

                <p className="mt-4 leading-7 text-white/70">
                  Fetch covers new illnesses and injuries that occur after the
                  waiting period has ended. Standard coverage includes:
                </p>

                <ul className="mt-6 space-y-4">
                  <li className="flex gap-3 text-sm leading-6 text-white/80">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage" />
                    Veterinary treatment for accidental injuries such as cuts,
                    broken bones, torn ACLs, and swallowed foreign objects.
                  </li>
                  <li className="flex gap-3 text-sm leading-6 text-white/80">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage" />
                    Medical treatment for illnesses ranging from digestive
                    problems and urinary tract infections to heart disease and
                    cancer.
                  </li>
                  <li className="flex gap-3 text-sm leading-6 text-white/80">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage" />
                    Examination fees associated with sick visits.
                  </li>
                  <li className="flex gap-3 text-sm leading-6 text-white/80">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage" />
                    Dental disease and injuries affecting every adult tooth and
                    gum, including periodontal disease, oral tumors, and trauma.
                  </li>
                  <li className="flex gap-3 text-sm leading-6 text-white/80">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage" />
                    Breed-related hereditary and genetic conditions.
                  </li>
                  <li className="flex gap-3 text-sm leading-6 text-white/80">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage" />
                    Alternative and holistic treatments prescribed by a
                    veterinarian, including acupuncture, chiropractic care,
                    aromatherapy, and homeopathic therapy.
                  </li>
                  <li className="flex gap-3 text-sm leading-6 text-white/80">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage" />
                    Emergency veterinary care.
                  </li>
                  <li className="flex gap-3 text-sm leading-6 text-white/80">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage" />
                    Treatment provided by veterinary specialists, including
                    orthopedic surgeons, oncologists, cardiologists, dentists,
                    and other specialists.
                  </li>
                </ul>
              </div>
            </section>

            {/* NOT COVERED */}
            <section id="not-covered" className="scroll-mt-28 mt-8">
              <div className="rounded-[1.5rem] border border-forest/10 bg-cream-alt p-7 sm:p-9">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-sage">
                  Important to Know
                </p>

                <h2 className="mt-3 font-display text-3xl text-forest">
                  What&apos;s Not Covered?
                </h2>

                <p className="mt-4 leading-7 text-ink/70">
                  Like most pet insurance plans, there are certain exclusions.
                  Coverage generally does not include:
                </p>

                <ul className="mt-6 space-y-4">
                  <li className="flex gap-3 leading-7 text-ink/75">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                    Routine wellness and preventive care, such as vaccinations,
                    annual checkups, spaying or neutering, and professional dental
                    cleanings.
                  </li>
                  <li className="flex gap-3 leading-7 text-ink/75">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                    Pre-existing medical conditions that developed before
                    enrollment or during the waiting period.
                  </li>
                  <li className="flex gap-3 leading-7 text-ink/75">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                    Illnesses or injuries that occur before coverage officially
                    becomes active.
                  </li>
                </ul>
              </div>
            </section>

            {/* FINAL DECISION */}
            <section id="right-coverage" className="scroll-mt-28 mt-16">
              <div className="border-t border-forest/10 pt-12">
                <p className="eyebrow mb-3">Making the Right Choice</p>

                <h2 className="font-display text-3xl leading-tight text-forest sm:text-4xl">
                  What Type of Coverage Is Right for You?
                </h2>

                <div className="mt-6 space-y-5 leading-8 text-ink/75">
                  <p>
                    The best pet insurance plan depends on your financial
                    situation and your comfort level with unexpected veterinary
                    expenses.
                  </p>

                  <p>
                    If you&apos;re prepared to pay large emergency medical bills
                    yourself, you may choose a plan with lower monthly premiums and
                    more limited coverage. However, if you&apos;d rather reduce the
                    risk of facing expensive veterinary costs, selecting a lower
                    deductible or higher reimbursement option may be a better
                    choice.
                  </p>

                  <p>
                    Since pet insurance plans are highly customizable, you can
                    adjust deductibles, reimbursement percentages, and annual
                    limits to create coverage that best suits both your budget and
                    your puppy&apos;s healthcare needs.
                  </p>
                </div>
              </div>

              <div className="mt-12 rounded-[1.5rem] bg-cream-alt p-8 text-center sm:p-10">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-sage">
                  For Every Adventure Ahead
                </p>

                <h3 className="mx-auto mt-3 max-w-xl font-display text-3xl leading-tight text-forest">
                  A little preparation can make the unexpected feel a little less
                  overwhelming.
                </h3>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-ink/65">
                  Your puppy&apos;s life will be filled with curious moments,
                  energetic adventures, and plenty of surprises. Understanding your
                  options can help you choose the protection that feels right for
                  your family.
                </p>
              </div>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}