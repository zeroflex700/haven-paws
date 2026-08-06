import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import FaqAccordion from "../components/FaqAccordion";

const ABOUT_HAVEN_PAWS = [
  {
    question: "Is Haven Paws a puppy mill?",
    answer:
      "Absolutely not. Haven Paws is a trusted marketplace that connects responsible families with carefully screened, ethical breeders across the United States. Our breeder community raises healthy puppies from both well-known and uncommon breeds while following strict standards of animal care.\n\nTo become part of Haven Paws, breeders must work closely with a licensed veterinarian who regularly evaluates the health and condition of their breeding dogs. Veterinary oversight helps confirm that parent dogs are healthy, breeding is conducted responsibly, and every puppy receives appropriate medical attention before joining its new family.",
  },
  {
    question: "Is Haven Paws a legitimate company?",
    answer:
      "Yes. Since our launch in 2018, Haven Paws has helped thousands of families find healthy puppies through a network of trusted breeders. We support both breeders and puppy parents throughout the entire journey — from the first inquiry to delivery and beyond.\n\nOur goal is to make the process transparent, safe, and enjoyable by matching families with reputable breeders who prioritize the health, happiness, and welfare of every puppy.",
  },
  {
    question: "How long has Haven Paws been in business?",
    answer:
      "Haven Paws was established in 2018 and has been dedicated to connecting responsible breeders with loving families ever since.",
  },
  {
    question: "Where is Haven Paws located?",
    answer:
      "Haven Paws operates from its headquarters in New Jersey while working with remote team members across the country. Our trusted breeder network is located throughout the United States, allowing us to connect families with puppies from a variety of regions and breeds.",
  },
  {
    question: "Where is the safest place to connect with a responsible breeder?",
    answer:
      "We believe Haven Paws provides one of the safest ways to find a reputable breeder. Every breeder in our network goes through a detailed review process before joining our platform. We also verify that prospective puppy owners are prepared to provide loving, responsible homes.\n\nOur commitment to health, transparency, and ethical breeding helps ensure every puppy is matched with the right family. We proudly stand behind every placement with our customer satisfaction commitment.",
  },
  {
    question: "Is Haven Paws a rescue organization?",
    answer:
      "No. Haven Paws is not an animal rescue or shelter. We are a service that connects responsible breeders with families searching for a specific breed, personality, size, or temperament.\n\nFor those looking for purebred or purpose-bred companion dogs, Haven Paws offers a trusted alternative while promoting responsible breeding practices and lifelong animal welfare.",
  },
  {
    question: "Aren't pet adoption services only offered by shelters and rescues?",
    answer:
      "Not necessarily. Pet adoption simply means welcoming a dog into a permanent, loving home. While many people adopt through shelters or rescue organizations, others choose to bring home a puppy from an ethical breeder.\n\nThe breeders partnered with Haven Paws dedicate significant time and care to raising their puppies responsibly. Their goal is to place every puppy with a family that can provide lifelong love, attention, and proper care. Regardless of where a puppy comes from, responsible ownership and commitment are what truly matter.",
  },
  {
    question: "Have customers had positive experiences with Haven Paws?",
    answer:
      "Yes. Since launching in 2018, Haven Paws has helped connect thousands of healthy puppies with loving homes.\n\nWe continuously improve our services by listening to customer feedback and maintaining high expectations for ourselves and our breeder partners. Our goal is to provide an outstanding experience from your first inquiry until long after your puppy arrives home.",
  },
];

const TRUST_AND_PRICING = [
  {
    question: "Why is Haven Paws more expensive than some other puppy marketplaces?",
    answer:
      "While puppies available through Haven Paws may sometimes cost more than listings found elsewhere, the price reflects the extra care, screening, and support included with every placement.\n\nOur network consists of carefully evaluated breeders who meet strict standards for health, ethics, and responsible breeding. Every puppy is matched with families through a guided process, backed by experienced Puppy Advisors who assist from the first inquiry through bringing your puppy home.\n\nOur pricing also includes comprehensive customer support, breeder verification, health commitments, satisfaction guarantees, and ongoing assistance after your puppy arrives. We believe peace of mind, healthy puppies, and trusted breeders provide lasting value that goes far beyond the purchase price.",
  },
  {
    question: "How can I tell if a puppy seller is trustworthy?",
    answer:
      "There are generally two types of unreliable puppy sellers: scammers and irresponsible commercial breeders. Watch for these warning signs:\n\n• Stolen or reused photos — reverse-search puppy photos or listing descriptions to see whether they're copied from other websites.\n• Unsafe payment requests — be cautious if a seller asks for wire transfers, gift cards, cryptocurrency, or other non-secure payment methods. Paying by credit card or trusted payment services generally provides better protection.\n• Prices that seem unrealistically low — if the price is far below the normal market value for that breed, proceed carefully and verify registrations and breeder information with recognized kennel organizations whenever possible.\n\nResponsible buyers should always research both the breeder and the puppy before making a commitment.",
  },
  {
    question: "What is a puppy mill?",
    answer:
      "A puppy mill is a breeding operation that prioritizes profit instead of the health and welfare of dogs.\n\nAt Haven Paws, we believe responsible breeding has nothing to do with the size of a breeding program. Small and large breeders alike can provide outstanding care — or poor care. What truly matters is how the dogs are treated.\n\nWe work with breeders who maintain excellent veterinary relationships, follow structured health programs, provide clean and enriching living environments, and raise puppies with proper nutrition, socialization, and daily care. Breeders are expected to maintain facilities that support animal welfare, including appropriate housing, sanitation, ventilation, temperature control, bedding, lighting, outdoor exercise areas, and preventative healthcare.",
  },
  {
    question: "How can I be sure Haven Paws puppies don't come from puppy mills?",
    answer:
      "This is one of the most common questions we receive. At Haven Paws, the well-being of every puppy comes first. We partner only with breeders who meet strict quality and welfare requirements, and our breeder network is continuously monitored to ensure they consistently maintain these standards.\n\nWe work with breeders who follow all applicable licensing and regulatory requirements. They are expected to have ongoing veterinary support through qualified professionals and comprehensive health care programs for their dogs.\n\nBreeding facilities should provide clean, safe, and comfortable living conditions, including appropriate space, proper ventilation, temperature control, quality bedding, sanitation, pest management, exercise areas, and other welfare essentials.\n\nOur commitment is built around carefully evaluating every breeder before they join Haven Paws and maintaining high expectations throughout our partnership. We are dedicated to ethical breeding — not puppy mills.",
  },
  {
    question: "Does Haven Paws offer financing?",
    answer:
      "Financing options may be available for qualified buyers depending on location and eligibility. Availability can vary because of state regulations and lending requirements.\n\nOur Puppy Advisors can explain the financing options available for your specific situation.",
  },
];

const PUPPIES_AND_DELIVERY = [
  {
    question: "Are Haven Paws puppies microchipped?",
    answer:
      "Most puppies available through Haven Paws are microchipped before joining their new families because responsible breeders understand the importance of permanent identification.\n\nSome exceptions may exist, such as breeders whose religious beliefs prevent the use of microchips. Whenever applicable, we inform buyers before purchase whether a puppy has already been microchipped.\n\nIf a puppy has not yet been chipped, we strongly recommend arranging microchipping with your veterinarian shortly after bringing your puppy home.",
  },
  {
    question: "Does Haven Paws offer home delivery?",
    answer:
      "Yes. Haven Paws provides convenient delivery options to make bringing your puppy home as simple as possible. Depending on your location and preference, you may choose home delivery, delivery to a nearby meeting location, or picking up your puppy directly from the breeder.\n\nOur team will help you select the option that works best for your schedule and budget.",
  },
  {
    question: "How does the Haven Paws adoption process work?",
    answer:
      "Getting started is easy. Begin by deciding what type of puppy best fits your lifestyle, family, home environment, and activity level. Once you've identified your ideal breed, browse the available puppies on the Haven Paws website.\n\nEvery listed puppy comes from one of our carefully screened breeder partners. Before completing your reservation, you'll have the opportunity to communicate with the breeder and receive any information you need.\n\nOur customer care specialists are available throughout the process to answer questions, coordinate delivery, and guide you every step of the way. After your reservation is confirmed, we'll help prepare you for your puppy's arrival by providing helpful information on feeding, home preparation, training tips, and expected delivery updates.\n\nDelivery timing depends on your puppy's age, health requirements, and transportation arrangements. When you choose Haven Paws, you're purchasing directly from the breeder, while we handle communication, logistics, and customer support to ensure everything goes smoothly.",
  },
  {
    question: "Where do Haven Paws puppies come from?",
    answer:
      "Every puppy listed on Haven Paws comes from carefully selected breeders who meet our strict quality standards.\n\nOur breeder partners are expected to comply with all applicable state and federal regulations while maintaining strong veterinary relationships and comprehensive health care programs for their dogs.\n\nWe evaluate every aspect of a breeder's program, including puppy health, maternal care, nutrition, cleanliness, housing conditions, enrichment, and overall breeding practices. Facilities should provide spacious, clean, and well-maintained environments with proper ventilation, lighting, temperature control, sanitation, bedding, outdoor exercise areas, and safe accommodations.\n\nTrust is the foundation of Haven Paws. We work hard to ensure every puppy receives exceptional care before joining its forever family.",
  },
];

const SERVICES = [
  {
    question: "What services does Haven Paws provide for breeders?",
    answer:
      "• Expanded Marketing Reach — we help trusted breeders gain greater visibility through strategic advertising and marketing, allowing their puppies to reach more qualified families.\n• High-Quality Listings — our team helps create professional puppy profiles with optimized photos, videos, and descriptions to attract the right buyers faster.\n• Reliable Payments & Quick Payouts — secure transactions, fraud prevention, protection against chargebacks, and dependable payment schedules.\n• Simple Annual Compliance — reminders, guidance, and easy-to-follow checklists to help breeders maintain Haven Paws standards year after year.\n• Market Insights & Pricing Tools — access to a Breeder Dashboard for demand trends, pricing recommendations, and sales analytics.\n• Expert Regulatory Guidance — advisory specialists monitor changing industry standards and provide updates so breeders remain compliant.\n• Nationwide Delivery Coordination — we organize transportation, pickup scheduling, and safe delivery logistics.\n• Lifetime Rehoming Assistance — if an owner's circumstances change, we help responsibly find the puppy a suitable new home.\n• Customer Care & Health Claim Support — our team manages post-sale support, including customer inquiries and eligible puppy health claims.\n• Buyer Communication — we handle FAQs, document collection, progress updates, and delivery coordination, reducing administrative work for breeders.\n• Qualified Buyer Screening — every prospective buyer is carefully reviewed to help ensure puppies are placed in loving, responsible homes.\n• Breeder Management Platform — easily update puppy listings, edit information, and manage records through your breeder account dashboard.\n• Dedicated Support Team — ongoing assistance and direct access to experienced Haven Paws account specialists.",
  },
  {
    question: "What services does Haven Paws offer customers?",
    answer:
      "• Safe Checkout & Purchase Protection — every payment is processed through trusted payment providers with built-in fraud protection.\n• Trusted Breeder Network — only carefully screened breeders who meet Haven Paws quality standards can list puppies.\n• Meet Your Breeder Before Buying — schedule a virtual or in-person meeting with your breeder before making a purchase.\n• See Your Future Puppy — during your meeting, you may request to watch your puppy with the breeder to better understand its personality.\n• Safe Door-to-Door Delivery — Haven Paws coordinates secure transportation with shipment updates.\n• Lifetime Rehoming Support — if life circumstances change, we help responsibly rehome your dog instead of placing strain on animal shelters.\n• 10-Year Health Commitment — long-term health protection designed to support your puppy throughout its life (insurance enrollment may be required).\n• Vet-Certified Travel Preparation — puppies travel only after receiving a veterinary examination, health certificate, and age-appropriate vaccinations.\n• New Puppy Care Guidance — helpful advice for the first few weeks after your puppy arrives home, with breeder assistance available when needed.\n• Pet Insurance Savings — eligible customers can receive special discounts on pet insurance along with temporary introductory coverage.\n• Direct Access to Your Breeder — stay connected with your breeder for questions, recommendations, and personalized care advice.\n• Exclusive New Pet Savings — special offers on food, training, toys, accessories, and other essentials.\n• Registration Assistance — step-by-step guidance to help you complete your puppy's registration quickly and accurately.",
  },
];

export default function FaqsPage() {
  return (
    <main>
      <Navbar />

      <section className="bg-cream-alt py-10">
        <PageContainer className="max-w-3xl">
          <h1 className="h1">FAQs About Bringing Home a Puppy from Haven Paws</h1>
        </PageContainer>
      </section>

      <PageContainer className="max-w-3xl py-8">
        <p className="eyebrow mb-3">About Haven Paws</p>
        <FaqAccordion items={ABOUT_HAVEN_PAWS} />
      </PageContainer>

      <PageContainer className="max-w-3xl py-8">
        <p className="eyebrow mb-3">Trust &amp; Pricing</p>
        <FaqAccordion items={TRUST_AND_PRICING} />
      </PageContainer>

      <PageContainer className="max-w-3xl py-8">
        <p className="eyebrow mb-3">Puppies &amp; Delivery</p>
        <FaqAccordion items={PUPPIES_AND_DELIVERY} />
      </PageContainer>

      <PageContainer className="max-w-3xl py-8">
        <p className="eyebrow mb-3">Our Services</p>
        <FaqAccordion items={SERVICES} />
      </PageContainer>

      <Footer />
    </main>
  );
}