import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FaqAccordion from "../components/FaqAccordion";

const SECTIONS = [
  {
    question: "1. Puppy Purchase Value",
    answer:
      "For all purposes under this Agreement and Haven Paws' Health Commitment, the puppy's value is limited solely to the amount paid for the puppy at purchase.\n\nThis value does not include taxes, delivery charges, store credits, veterinary expenses, health certificates, travel crates, registration costs, or any other additional fees, losses, or expenses the customer may incur before or after receiving the puppy.",
  },
  {
    question: "2. Responsible Pet Ownership Policy",
    answer:
      "All puppies offered through Haven Paws are intended strictly as companion animals.\n\nBy purchasing a puppy, the customer agrees that the puppy will not be used for breeding purposes unless otherwise permitted in writing. The customer also agrees to have the puppy spayed or neutered at the appropriate age, following the advice of a licensed veterinarian.\n\nThe customer accepts full responsibility for providing lifelong humane care, including nutritious food and clean drinking water, safe and comfortable shelter, routine veterinary care, daily exercise and affection, and proper identification and licensing where required by law.\n\nThe puppy should live indoors as a family companion, remain under responsible supervision, and wear identification whenever appropriate.\n\nHaven Paws Responsible Ownership Guidelines\n\nOwning a dog is a long-term commitment. Every owner is expected to provide a loving and stable home throughout the dog's entire life. Customers should carefully choose a breed that matches their lifestyle, available space, activity level, and experience.\n\nBefore bringing your puppy home, ensure you have sufficient time, financial resources, and dedication to provide healthy nutrition, fresh water, safe housing, veterinary care, grooming, exercise, and daily companionship. Essential supplies — including food, treats, toys, a leash, collar, bedding, and grooming equipment — should be prepared before the puppy arrives.\n\nTo create a safe environment: remove dangerous objects from reach, keep electrical cords secured, restrict access to hazardous rooms, and store toxic plants, medications, foods, and chemicals safely. Outdoor areas should be securely fenced whenever possible, and dogs should remain on a leash whenever required outside enclosed spaces. When traveling, always transport your dog safely using an approved travel crate or pet safety restraint.\n\nEarly socialization and consistent positive training are encouraged to promote confidence and appropriate behavior. Owners should prevent their pets from disturbing neighbors, harming wildlife, or creating environmental issues by cleaning waste promptly and maintaining responsible supervision.\n\nCustomers should establish an ongoing relationship with a licensed veterinarian shortly after bringing their puppy home, and continue vaccinations, wellness exams, and parasite prevention throughout the dog's life. Dogs should always have current identification, including tags or a registered microchip where available.\n\nHaven Paws strongly recommends spaying or neutering pets unless otherwise approved, to help reduce unwanted animal populations. As dogs age, owners should work closely with their veterinarian to make compassionate healthcare decisions that prioritize comfort and quality of life.",
  },
  {
    question: "3. Registration Documents",
    answer:
      "Registration paperwork is provided only for puppies that qualify for registration. Processing may not begin until proof of spay or neuter has been received when applicable.\n\nMost registration documents are mailed within several weeks after Haven Paws receives all required documentation, although processing times may occasionally be longer.\n\nAny fees associated with replacing, updating, or renewing registration documents are the customer's responsibility. If original paperwork is lost, Haven Paws may assist with replacement requests whenever possible, but all related costs remain the responsibility of the customer.",
  },
  {
    question: "4. Information Published on the Website",
    answer:
      "Haven Paws works diligently to keep all puppy listings as accurate and current as possible. Information may include breed, color, sex, birth date, estimated weight, parent information, and registration details supplied by participating breeders.\n\nAlthough Haven Paws reviews information for accuracy whenever practical, occasional errors, omissions, or outdated information may occur. Haven Paws cannot guarantee that every listing is completely free of typographical, photographic, or informational inaccuracies.",
  },
  {
    question: "5. Puppy Transportation",
    answer:
      "Your puppy is generally expected to arrive within approximately 2–3 weeks after your purchase is finalized. In some cases, the breeder may require additional time before the puppy is ready for travel, based on the puppy's health as assessed by the breeder and attending veterinarian.\n\nHaven Paws coordinates transportation using trusted delivery partners where necessary. While every effort is made to meet estimated delivery dates, unexpected events such as severe weather, transportation disruptions, equipment issues, or other circumstances beyond our control may cause delays.\n\nHaven Paws cannot be held responsible for any direct or indirect inconvenience, expenses, or losses resulting from travel delays. Delivery delays alone do not qualify as a reason to cancel a purchase or request compensation. No refunds will be issued due to airline delays, airport disruptions, flight cancellations, or similar transportation-related issues, whether the shipment is within the country or internationally.\n\nCustomers are responsible for obtaining any required import permits, health certificates, vaccination records, or other documentation needed when transporting a puppy outside the United States or Canada.",
  },
  {
    question: "6. Customer Cancellation Policy",
    answer:
      "Before the breeder or Haven Paws confirms your puppy's scheduled delivery date, you may request to cancel your order by contacting our customer support team.\n\nIf you decide to cancel, cancellation fees may apply depending on the stage of your purchase. These charges help cover administrative work, breeder preparation, and other costs already incurred.\n\nCancellation Timeline\n\n• Reservation Hold: Puppies may be reserved before full payment is completed. A reservation remains active for up to 72 hours while payment is finalized.\n• Cancellation Within 72 Hours of Purchase: Cancellation fees may apply according to your purchase agreement.\n• Cancellation After 72 Hours: Higher cancellation charges may apply because additional preparation and travel arrangements may already be underway.\n• Cancellation Within 72 Hours of Scheduled Delivery: Customers may be responsible for a larger portion of the purchase costs due to completed arrangements.\n\nImportant Notes\n\nThe total invoice includes the puppy, transportation, health documentation, and any optional products or packages purchased. Taxes and promotional discounts are not included when calculating cancellation charges, and taxes already paid on non-refundable items may not be reimbursed.",
  },
  {
    question: "7. Disclaimer of Warranties",
    answer:
      "Haven Paws provides puppies in good faith but makes no guarantees regarding future appearance, temperament, adult size, weight, coat color, personality, DNA results, or compliance with breed standards. We also do not guarantee that all information supplied by breeders is completely free from errors or omissions.\n\nEach puppy receives a comprehensive veterinary examination before travel to confirm it is healthy enough for transportation. However, some minor conditions are considered normal, temporary, breed-related, or otherwise acceptable at the time of travel, including: minor bite alignment variations, coccidia, ticks, giardia, fleas, ear debris, breed-standard underbite, repaired hernias, hookworms, mild ear discharge, corrected or repaired narrowed nostrils, docked tails, tapeworms, ear mites, cropped ears, removed dew claws, whipworms, undescended testicles, and open fontanel measuring less than 1 cm — as well as healthy body condition scores within normal veterinary ranges, and spayed or neutered status.\n\nIf a veterinarian identifies a more significant medical concern before delivery, Haven Paws will make reasonable efforts to notify you promptly and discuss available options before the puppy travels.\n\nCustomers are encouraged to educate themselves about common puppy health concerns and continue regular veterinary care after bringing their puppy home.",
  },
  {
    question: "8. Refund Policy",
    answer:
      "All puppy sales through Haven Paws are considered final. Returns for monetary refunds will not be accepted because of allergies, housing restrictions, family circumstances, adjustment challenges, lifestyle changes, or similar reasons.\n\nIt is normal for puppies to require time to adapt to a new environment. If you experience behavioral or adjustment concerns after bringing your puppy home, our team is available to provide guidance and support whenever possible.",
  },
  {
    question: "9. Returning a Puppy",
    answer:
      "If, at any point during the puppy's lifetime, you become unable to properly care for your dog, you agree to contact Haven Paws before making other arrangements.\n\nShould the puppy need to be returned, the surrender will be accepted without a refund or store credit. The customer is responsible for all transportation and related expenses associated with the return.\n\nAfter the puppy is returned, Haven Paws will make reasonable efforts to locate a safe, suitable new home that meets our adoption standards.",
  },
  {
    question: "10. Understanding the Breed You Have Selected",
    answer:
      "Every dog breed has its own unique physical traits, personality, energy level, and care requirements. Before completing your purchase, we encourage you to research the breed you have chosen so you understand its typical characteristics, grooming needs, health considerations, and temperament.\n\nA helpful place to begin is the American Kennel Club (AKC) breed directory, which provides general information on recognized dog breeds. Haven Paws does not guarantee against breed-specific traits, physical characteristics, or conditions commonly accepted as normal within certain breeds.\n\nBrachycephalic (Short-Muzzled) Breeds\n\n\"Brachycephalic\" refers to dogs with shortened skulls and flattened faces — brachy meaning \"short,\" cephalic relating to the head. These breeds have compact facial structures that can make breathing more difficult, especially during hot weather or strenuous exercise. Owners should avoid excessive heat, use a harness instead of attaching a leash to the collar whenever possible, and monitor their dog closely during physical activity.\n\nExamples include Affenpinscher, American Bulldog, American Staffordshire Terrier, Boston Terrier, Boxer, Brussels Griffon, Bullmastiff, Bulldog, Cane Corso, Cavalier King Charles Spaniel, Chihuahua (Apple Head), Chinese Shar-Pei, Chow Chow, Dogo Argentino, French Bulldog, Japanese Chin, Lhasa Apso, Mastiff, Neapolitan Mastiff, Newfoundland, Pekingese, Pug, Shih Tzu, and short-muzzled Yorkshire Terrier varieties. Because of airline regulations, certain short-nosed breeds or mixes may face transportation restrictions or may not qualify for some commercial pet travel services.\n\nBreeds Commonly Associated with Underbites\n\nAn underbite occurs when the lower jaw extends farther forward than the upper jaw. In many breeds this is inherited and considered an accepted breed characteristic rather than a defect — commonly seen in Boston Terrier, Boxer, Brussels Griffon, Bulldog, English Bulldog, French Bulldog, Lhasa Apso, Pekingese, Pug, Puggle, and Shih Tzu.\n\nOpen Fontanelle\n\nAn open fontanelle is a small soft opening between the bones of a puppy's skull, similar to the soft spot found on human infants. Small-breed puppies often have open fontanelles early in life that normally close between 9 and 12 weeks of age, though in some breeds they may remain open longer as a normal breed characteristic — including Chihuahua, Miniature Dachshund, Pomeranian, Shih Tzu, Yorkshire Terrier, Maltese, Lhasa Apso, and Pekingese. Among Chihuahuas this is sometimes called a molera. Most dogs with persistent open fontanelles live healthy, normal lives, though owners should take reasonable care to avoid head injuries.\n\nHeterochromia\n\nHeterochromia is a naturally occurring variation where a dog's eyes differ in color from one another, or where a single eye contains multiple colors, resulting from variations in melanin. This trait is seen more frequently in certain breeds, including Siberian Husky, Welsh Corgi, Shetland Sheepdog, Great Dane, Alaskan Malamute, Dachshund, Dalmatian, Australian Shepherd, Border Collie, Catahoula Leopard Dog, Beagle, Chihuahua, and Shih Tzu. In most cases this is purely cosmetic and does not affect the dog's vision or overall health.",
  },
  {
    question: "11. Privacy Policy",
    answer:
      "Your use of the Haven Paws website and services is subject to the Haven Paws Privacy Policy. This policy explains how personal information may be collected, stored, used, shared, and protected when you visit our website or purchase our products and services. We encourage every customer to review the Privacy Policy carefully so they understand how their information is handled.",
  },
  {
    question: "12. Consent to Receive Calls and Electronic Communications",
    answer:
      "By signing this agreement electronically, you authorize Haven Paws, its trusted business partners, affiliated companies, and approved service providers to contact you using the phone number or contact information you supplied during your purchase or inquiry.\n\nThese communications may include telephone calls, text messages (SMS), prerecorded voice messages, or automated dialing systems when permitted by applicable law, and may be used to provide updates about your puppy or order, complete documentation related to your purchase, coordinate delivery or transportation, respond to customer service requests, and inform you about relevant products, services, or promotions.\n\nYour decision to receive these communications is voluntary. Declining marketing calls or text messages will not prevent you from purchasing a puppy or receiving essential customer service.",
  },
  {
    question: "13. Agreement to Individual Arbitration and Waiver of Class Actions",
    answer:
      "PLEASE READ THIS SECTION CAREFULLY, AS IT AFFECTS YOUR LEGAL RIGHTS.\n\nExcept where prohibited by law, you and Haven Paws agree that any dispute, claim, or disagreement arising from your purchase, this Agreement, or the services provided by Haven Paws will be resolved through binding individual arbitration instead of a lawsuit filed in court.\n\nBy accepting this Agreement, both parties waive the right to have disputes decided by a judge or jury, to participate in or bring a class action, collective action, or representative lawsuit, and to combine claims with those of other customers unless required by applicable law.\n\nArbitration will be conducted by a neutral arbitrator whose decision will be final and legally binding. Each party will have the opportunity to present evidence and arguments during the arbitration process. Nothing in this section limits any legal rights that cannot legally be waived under applicable law.",
  },
];

export default function TermsPage() {
  return (
    <main>
      <Navbar />
      <section className="bg-cream-alt py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-display text-3xl text-forest">Terms &amp; Conditions</h1>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-6 py-12">
        <FaqAccordion items={SECTIONS} />
      </section>
      <Footer />
    </main>
  );
}