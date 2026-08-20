import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import DeliveryTierAccordion from "../components/DeliveryTierAccordion";
import { ProtectedImage, ProtectedVideo } from "../components/ProtectedMedia";
import { getPageImages } from "@/lib/queries/pageContent";
import { getSettings } from "@/lib/queries/settings";

export default async function DeliveryPage() {
  const { heroImage, extraImages, extraVideos } = await getPageImages(
    "delivery-programs"
  );

  const settings = await getSettings();

  const tiers = [
    {
      title: "Home Delivery",
      price: `$${settings.deliveryHomePrice.toLocaleString()}`,
      summary: "Delivered safely to your door — no travel required.",
      image: extraImages.tier_home ?? null,
      body:
        "Our trusted transportation partners handle the entire trip, bringing your puppy from their breeder's home directly to yours. Once your reservation is confirmed, you'll receive an estimated delivery window within about 72 hours, with a more precise schedule shared as the date approaches.\n\nFor safe travel, puppies must be at least 8 weeks old, and puppies under 2.5 lbs may need to stay a bit longer — closer to 12 weeks — before making the trip. Most home deliveries are completed within 2–4 weeks, depending on your puppy's age, veterinary clearance, and route scheduling.",
    },
    {
      title: "Meet Near Your Location",
      price: `$${settings.deliveryMeetPrice.toLocaleString()}`,
      summary: "A convenient, nearby meeting point for pickup.",
      image: extraImages.tier_meet ?? null,
      body:
        "We coordinate with licensed pet transportation professionals to bring your puppy to a pre-arranged meeting point, typically somewhere between 20 minutes and 2 hours from your home. After your reservation is confirmed, you'll get an estimated delivery week within about 72 hours, followed by your exact pickup date, time, and location as it approaches — most meetings happen Wednesday through Saturday.\n\nThe same age and weight guidelines apply as with home delivery. In rare cases where ground transport isn't practical — such as remote areas — your puppy may travel by an approved commercial airline's live-animal service instead, with pickup arranged at the nearest participating airport. Our team will walk you through every step if this applies to you.",
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
      body:
        "If you'd rather not wait, Priority Express gives your puppy top scheduling priority, often getting them to a convenient meeting point near you in as little as 1–2 weeks, depending on availability. Eligibility depends on a few things — your puppy's breed, the breeder's location, available transport routes, and how soon your reservation is confirmed.\n\nThe standard age and weight travel guidelines still apply. Your Haven Paws Puppy Advisor can confirm whether Priority Express is available for the specific puppy you have in mind.",
    },
    {
      title: "Pickup Near the Breeder",
      price: settings.deliveryPickupPriceLabel,
      summary: "The most flexible option — meet the breeder yourself.",
      image: extraImages.tier_pickup ?? null,
      body:
        "Prefer to travel a bit yourself? This option lets you meet the breeder (or their authorized representative) in person and bring your puppy home directly. Pickups within 10 miles of the breeder are free. If you'd like an alternate nearby meeting spot — like a local airport or another convenient location — a small coordination fee of up to $60 may apply.\n\nOur team will help arrange a pickup date, time, and location once your reservation is confirmed. The same age and weight travel guidelines apply, and pickup is typically available within 1–2 weeks once your puppy clears their health check.",
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
    <main className="bg-[#f8f6f1]">
      <Navbar />

      {/* Compact Editorial Hero */}
      <section className="border-b border-forest/10">
        <PageContainer className="py-8 sm:py-12 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="max-w-xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-forest/40" />
                <p className="eyebrow !mb-0">Bringing Them Home</p>
              </div>

              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-forest sm:text-5xl lg:text-6xl">
                The journey home,
                <span className="block font-light italic text-forest/75">
                  made simple.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-forest/75 sm:text-lg">
                No matter where you live in the U.S., Haven Paws makes it
                easy to choose how your puppy comes home. Every option is
                coordinated by our team and trusted transport partners, with
                your puppy&apos;s comfort and safety as the top priority.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 border-t border-forest/15 pt-6 sm:grid-cols-4">
                <div>
                  <p className="text-2xl font-semibold text-forest">4</p>
                  <p className="mt-1 text-xs leading-5 text-forest/60">
                    flexible ways to bring your puppy home
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-semibold text-forest">U.S.</p>
                  <p className="mt-1 text-xs leading-5 text-forest/60">
                    delivery options coordinated nationwide
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-semibold text-forest">72h</p>
                  <p className="mt-1 text-xs leading-5 text-forest/60">
                    estimated delivery window after confirmation
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-semibold text-forest">1–4</p>
                  <p className="mt-1 text-xs leading-5 text-forest/60">
                    weeks for most journeys, depending on the option
                  </p>
                </div>
              </div>
            </div>

            {/* Image kept compact */}
            {heroImage && (
              <div className="relative">
                <div className="overflow-hidden rounded-[2rem] bg-cream-alt shadow-[0_20px_60px_rgba(24,49,39,0.12)]">
                  <div className="aspect-[5/4]">
                    <ProtectedImage
                      src={heroImage}
                      alt="Haven Paws puppy delivery"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-3 hidden max-w-[220px] rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur sm:block">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
                    Your choice
                  </p>
                  <p className="mt-2 text-sm leading-6 text-forest">
                    Choose the journey that works best for your family,
                    schedule, and location.
                  </p>
                </div>
              </div>
            )}
          </div>
        </PageContainer>
      </section>

      {/* Main Options */}
      <section className="py-10 sm:py-14 lg:py-16">
        <PageContainer className="max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 border-b border-forest/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-2">Choose Your Journey</p>
              <h2 className="text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
                Four ways to get home.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-forest/65">
              Explore each delivery program to find the option that fits your
              schedule, location, and budget.
            </p>
          </div>

          <DeliveryTierAccordion tiers={tiers} />
        </PageContainer>
      </section>

      {/* Trust Section */}
      <section className="border-y border-forest/10 bg-white">
        <PageContainer className="py-10 sm:py-14">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
                Step 01
              </p>
              <h3 className="text-xl font-semibold text-forest">
                Confirm your puppy
              </h3>
              <p className="mt-3 text-sm leading-7 text-forest/65">
                Once your reservation is confirmed, our team begins
                coordinating the next steps for your puppy&apos;s journey.
              </p>
            </div>

            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
                Step 02
              </p>
              <h3 className="text-xl font-semibold text-forest">
                We coordinate the journey
              </h3>
              <p className="mt-3 text-sm leading-7 text-forest/65">
                Timing, transportation, health requirements, and logistics are
                coordinated with your puppy&apos;s safety and comfort in mind.
              </p>
            </div>

            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-forest/50">
                Step 03
              </p>
              <h3 className="text-xl font-semibold text-forest">
                Welcome them home
              </h3>
              <p className="mt-3 text-sm leading-7 text-forest/65">
                You&apos;ll receive the details you need as your delivery date
                approaches, so you&apos;re ready for your new companion.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Closing */}
      <section className="py-10 sm:py-14 lg:py-16">
        <PageContainer className="max-w-4xl">
          <div className="overflow-hidden rounded-[2rem] bg-forest px-6 py-10 text-center text-white sm:px-10 sm:py-14">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/55">
              Safe Nationwide Puppy Delivery
            </p>

            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
              Every journey begins with care.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              Wherever you are in the country, Haven Paws works with
              experienced, trusted transportation professionals who put your
              puppy&apos;s comfort and well-being first at every stage of the
              journey — from departure to arrival.
            </p>

            {extraVideos.closing_video && (
              <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl">
                <ProtectedVideo
                  src={extraVideos.closing_video}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </PageContainer>
      </section>

      <Footer />
    </main>
  );
}