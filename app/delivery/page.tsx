import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import DeliveryTierAccordion from "../components/DeliveryTierAccordion";
import { ProtectedImage, ProtectedVideo } from "../components/ProtectedMedia";
import { getPageImages } from "@/lib/queries/pageContent";
import { getSettings } from "@/lib/queries/settings";

export default async function DeliveryPage() {
  const { heroImage, extraImages, extraVideos } = await getPageImages("delivery-programs");
  const settings = await getSettings();

  const tiers = [
    {
      title: "Home Delivery",
      price: `$${settings.deliveryHomePrice.toLocaleString()}`,
      summary: "Delivered safely to your door — no travel required.",
      image: extraImages.tier_home ?? null,
      body: "Our trusted transportation partners handle the entire trip, bringing your puppy from their breeder's home directly to yours. Once your reservation is confirmed, you'll receive an estimated delivery window within about 72 hours, with a more precise schedule shared as the date approaches.\n\nFor safe travel, puppies must be at least 8 weeks old, and puppies under 2.5 lbs may need to stay a bit longer — closer to 12 weeks — before making the trip. Most home deliveries are completed within 2–4 weeks, depending on your puppy's age, veterinary clearance, and route scheduling.",
    },
    {
      title: "Meet Near Your Location",
      price: `$${settings.deliveryMeetPrice.toLocaleString()}`,
      summary: "A convenient, nearby meeting point for pickup.",
      image: extraImages.tier_meet ?? null,
      body: "We coordinate with licensed pet transportation professionals to bring your puppy to a pre-arranged meeting point, typically somewhere between 20 minutes and 2 hours from your home. After your reservation is confirmed, you'll get an estimated delivery week within about 72 hours, followed by your exact pickup date, time, and location as it approaches — most meetings happen Wednesday through Saturday.\n\nThe same age and weight guidelines apply as with home delivery. In rare cases where ground transport isn't practical — such as remote areas — your puppy may travel by an approved commercial airline's live-animal service instead, with pickup arranged at the nearest participating airport. Our team will walk you through every step if this applies to you.",
      checklist: [
        "A soft-sided pet carrier",
        "A properly fitted leash and collar",
        "Fresh water and a portable bowl",
        "A small amount of puppy food",
        "A nutritional supplement (recommended for puppies under 5 lbs)",
      ],
    },
    {
      title: "Priority Express Delivery",
      price: `$${settings.deliveryExpressPrice.toLocaleString()}`,
      summary: "The fastest way to bring your puppy home.",
      image: extraImages.tier_express ?? null,
      body: "If you'd rather not wait, Priority Express gives your puppy top scheduling priority, often getting them to a convenient meeting point near you in as little as 1–2 weeks, depending on availability. Eligibility depends on a few things — your puppy's breed, the breeder's location, available transport routes, and how soon your reservation is confirmed.\n\nThe standard age and weight travel guidelines still apply. Your Haven Paws Puppy Advisor can confirm whether Priority Express is available for the specific puppy you have in mind.",
    },
    {
      title: "Pickup Near the Breeder",
      price: settings.deliveryPickupPriceLabel,
      summary: "The most flexible option — meet the breeder yourself.",
      image: extraImages.tier_pickup ?? null,
      body: "Prefer to travel a bit yourself? This option lets you meet the breeder (or their authorized representative) in person and bring your puppy home directly. Pickups within 10 miles of the breeder are free. If you'd like an alternate nearby meeting spot — like a local airport or another convenient location — a small coordination fee of up to $60 may apply.\n\nOur team will help arrange a pickup date, time, and location once your reservation is confirmed. The same age and weight travel guidelines apply, and pickup is typically available within 1–2 weeks once your puppy clears their health check.",
      checklist: [
        "A soft-sided pet carrier",
        "Fresh drinking water and a portable bowl",
        "A leash and properly fitted collar",
        "A small supply of your puppy's current food",
        "A nutritional supplement for puppies under 5 lbs (optional but recommended)",
      ],
    },
  ];

  return (
    <main className="overflow-hidden bg-[#f8f6f1]">
      <Navbar />

      {/* HERO — Editorial, immersive, intentionally different from the rest of the site */}
      <section className="relative isolate bg-[#173b2c] text-white">
        <div className="absolute inset-0 overflow-hidden">
          {heroImage && (
            <>
              <ProtectedImage
                src={heroImage}
                alt="Haven Paws puppy delivery"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#10291e]/95 via-[#173b2c]/75 to-[#173b2c]/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10291e]/70 via-transparent to-transparent" />
            </>
          )}
        </div>

        {/* Decorative layers */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute bottom-0 left-[8%] h-px w-[84%] bg-white/15" />

        <PageContainer className="relative z-10">
          <div className="grid min-h-[680px] items-end gap-10 py-16 sm:min-h-[720px] lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
            <div className="max-w-3xl pb-4 lg:pb-10">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-10 bg-[#d9c6a1]" />
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e5d5b8]">
                  Bringing Them Home
                </p>
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl">
                The journey home
                <span className="block font-normal italic text-[#e5d5b8]">
                  begins with care.
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
                No matter where you live in the U.S., Haven Paws makes it easy
                to choose how your puppy comes home. Every option is coordinated
                by our team and trusted transport partners, with your puppy&apos;s
                comfort and safety as the top priority.
              </p>
            </div>

            {/* Floating hero information panel */}
            <div className="self-end lg:justify-self-end">
              <div className="max-w-md border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e5d5b8]">
                  Your journey, your choice
                </p>

                <div className="mt-6 grid grid-cols-2 gap-6 border-t border-white/15 pt-6">
                  <div>
                    <p className="text-2xl font-semibold">4</p>
                    <p className="mt-1 text-sm leading-5 text-white/65">
                      flexible ways to bring your puppy home
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-semibold">U.S.</p>
                    <p className="mt-1 text-sm leading-5 text-white/65">
                      delivery options coordinated nationwide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* INTRO / TRUST STRIP */}
      <section className="relative border-b border-[#173b2c]/10 bg-[#f8f6f1]">
        <PageContainer className="py-0">
          <div className="grid divide-y divide-[#173b2c]/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            <div className="py-7 lg:px-8 lg:first:pl-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d765f]">
                Step 01
              </p>
              <p className="mt-2 font-medium text-[#173b2c]">
                Reserve your puppy
              </p>
            </div>

            <div className="py-7 lg:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d765f]">
                Step 02
              </p>
              <p className="mt-2 font-medium text-[#173b2c]">
                We coordinate the journey
              </p>
            </div>

            <div className="py-7 lg:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d765f]">
                Step 03
              </p>
              <p className="mt-2 font-medium text-[#173b2c]">
                Welcome your puppy home
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* EDITORIAL INTRO */}
      <section className="relative py-20 sm:py-28">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d765f]">
                Delivery Programs
              </p>

              <div className="mt-5 h-px w-16 bg-[#bca67a]" />
            </div>

            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#173b2c] sm:text-5xl">
                One very important journey.
                <span className="block font-normal italic text-[#7d765f]">
                  Several thoughtful ways to make it happen.
                </span>
              </h2>

              <p className="mt-8 max-w-2xl text-base leading-8 text-[#425448] sm:text-lg">
                Explore the programs below to find the option that best fits
                your schedule and budget. Whether you want the convenience of
                delivery to your door, a nearby meeting point, faster scheduling,
                or the flexibility to meet your breeder yourself, we&apos;ll help
                coordinate the details along the way.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* PROGRAMS */}
      <section className="relative bg-[#ece9e1] py-16 sm:py-24">
        <div className="absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-[#f8f6f1] to-transparent" />

        <PageContainer className="relative">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d765f]">
                Choose Your Route
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#173b2c] sm:text-4xl">
                Find the journey that fits.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#5b695f] sm:text-right">
              Each option is designed around one goal: helping your puppy arrive
              safely and comfortably while giving you a delivery experience that
              works for your family.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 hidden h-full w-px bg-[#173b2c]/10 lg:block" />

            <div className="grid gap-8 lg:grid-cols-[120px_minmax(0,1fr)]">
              <div className="hidden lg:block">
                <div className="sticky top-28">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d765f]">
                    Options
                  </p>
                  <p className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[#173b2c]/20">
                    04
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#173b2c]/10 bg-[#f8f6f1] p-3 shadow-[0_20px_80px_rgba(23,59,44,0.06)] sm:p-5">
                <DeliveryTierAccordion tiers={tiers} />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="bg-[#173b2c] py-20 text-white sm:py-28">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e5d5b8]">
                Along The Way
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
                Clear coordination.
                <span className="block font-normal italic text-[#d9c6a1]">
                  No unnecessary guesswork.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/70">
                Once your reservation is confirmed, our team helps coordinate
                the next steps and keeps you informed as your puppy&apos;s travel
                plans come together.
              </p>
            </div>

            <div className="grid gap-0 border-t border-white/15">
              <div className="grid gap-5 border-b border-white/15 py-7 sm:grid-cols-[72px_1fr]">
                <span className="text-3xl font-light text-[#d9c6a1]">01</span>
                <div>
                  <h3 className="text-lg font-semibold">Reservation confirmed</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    Your delivery planning begins once your puppy has been reserved.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 border-b border-white/15 py-7 sm:grid-cols-[72px_1fr]">
                <span className="text-3xl font-light text-[#d9c6a1]">02</span>
                <div>
                  <h3 className="text-lg font-semibold">Travel planning begins</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    Estimated timing is shared as transport availability, puppy age,
                    and travel requirements are coordinated.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 border-b border-white/15 py-7 sm:grid-cols-[72px_1fr]">
                <span className="text-3xl font-light text-[#d9c6a1]">03</span>
                <div>
                  <h3 className="text-lg font-semibold">Final details shared</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    As the date approaches, you&apos;ll receive more precise information
                    about when and where you&apos;ll meet your newest family member.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 py-7 sm:grid-cols-[72px_1fr]">
                <span className="text-3xl font-light text-[#d9c6a1]">04</span>
                <div>
                  <h3 className="text-lg font-semibold">Welcome home</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    The journey ends with the moment you&apos;ve been waiting for:
                    bringing your puppy into their new home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* SAFETY / REASSURANCE */}
      <section className="py-20 sm:py-28">
        <PageContainer>
          <div className="rounded-[2rem] border border-[#173b2c]/10 bg-[#f1eee7] p-7 sm:p-10 lg:p-14">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d765f]">
                  Nationwide Care
                </p>

                <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#173b2c] sm:text-4xl">
                  Safe nationwide
                  <span className="block font-normal italic text-[#7d765f]">
                    puppy delivery.
                  </span>
                </h2>
              </div>

              <div>
                <p className="text-base leading-8 text-[#425448] sm:text-lg">
                  Wherever you are in the country, Haven Paws works with experienced,
                  trusted transportation professionals who put your puppy&apos;s comfort
                  and well-being first at every stage of the journey — from departure
                  to arrival at your door.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="border border-[#173b2c]/10 bg-white/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7d765f]">
                      Priority
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#173b2c]">
                      Comfort & care
                    </p>
                  </div>

                  <div className="border border-[#173b2c]/10 bg-white/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7d765f]">
                      Planning
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#173b2c]">
                      Clear coordination
                    </p>
                  </div>

                  <div className="border border-[#173b2c]/10 bg-white/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7d765f]">
                      Destination
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#173b2c]">
                      Your puppy, home
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* CLOSING VIDEO */}
      {extraVideos.closing_video && (
        <section className="relative bg-[#10291e] py-20 sm:py-28">
          <PageContainer>
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e5d5b8]">
                The Best Part
              </p>

              <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                Every journey leads to
                <span className="block font-normal italic text-[#d9c6a1]">
                  a very special hello.
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">
                Watch families welcome their newest companions home — the moment
                all the planning, travel, and anticipation finally comes together.
              </p>

              <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
                <ProtectedVideo
                  src={extraVideos.closing_video}
                  className="w-full"
                />
              </div>
            </div>
          </PageContainer>
        </section>
      )}

      <Footer />
    </main>
  );
}