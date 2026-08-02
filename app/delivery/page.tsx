import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
    <main>
      <Navbar />

      {heroImage && (
        <div className="w-full aspect-[4/3] sm:aspect-[16/7] overflow-hidden">
          <ProtectedImage src={heroImage} alt="Haven Paws Delivery" />
        </div>
      )}

      <section className="max-w-2xl mx-auto px-6 py-14">
        <p className="eyebrow mb-3">Bringing Your Puppy Home</p>
        <h1 className="font-display text-3xl text-forest mb-6">Delivery Programs</h1>
        <p className="text-ink/80 leading-relaxed">
          No matter where you live in the U.S., Haven Paws makes it easy to choose how your
          puppy comes home. Every option is coordinated by our team and trusted transport
          partners, with your puppy&apos;s comfort and safety as the top priority. Explore the
          programs below to find the option that fits your schedule and budget.
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-14">
        <DeliveryTierAccordion tiers={tiers} />
      </section>

      <section className="bg-cream-alt py-14">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl text-forest mb-4">
            Safe Nationwide Puppy Delivery
          </h2>
          <p className="text-ink/80 leading-relaxed mb-8">
            Wherever you are in the country, Haven Paws works with experienced, trusted
            transportation professionals who put your puppy&apos;s comfort and well-being
            first at every stage of the journey — from departure to arrival at your door.
          </p>
          {extraVideos.closing_video && (
            <div className="max-w-md mx-auto">
              <p className="text-sm text-sage mb-3">
                Watch families welcome their newest companions home
              </p>
              <ProtectedVideo src={extraVideos.closing_video} className="w-full rounded-lg" />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}