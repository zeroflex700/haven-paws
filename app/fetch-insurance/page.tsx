import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPageImages } from "@/lib/queries/pageContent";
import { cldOptimized } from "@/lib/cloudinary";

export default async function FetchInsurancePage() {
  const { heroImage, extraImages } = await getPageImages("fetch-insurance");

  return (
    <main>
      <Navbar />

      {heroImage && (
        <div className="w-full aspect-[4/3] sm:aspect-[16/7] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cldOptimized(heroImage, 1200)}
            alt="Pet insurance for your puppy"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className="max-w-7xl mx-auto px-6 py-12">
        <p className="eyebrow mb-3">Puppy Care</p>
        <h1 className="font-display text-2xl text-forest mb-6 leading-tight">
          Why You Should Consider Pet Insurance for Your Puppy
        </h1>

        <div className="flex items-center gap-3 mb-6">
          {extraImages.author_photo && (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-cream-alt shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cldOptimized(extraImages.author_photo, 100)}
                alt="Dr. David Shaw"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <p className="text-sm text-ink/70">
            By Dr. David Shaw · March 27, 2021
          </p>
        </div>

        <p className="text-sm text-ink/70 leading-relaxed mb-4 italic">
          The author is Haven Paws&apos; Director of Digital Marketing and has spent many
          years caring for dogs. As a proud dog owner and passionate advocate for responsible
          breeding, they are committed to helping puppies receive the best possible start in
          life while educating pet owners with reliable information.
        </p>

        <p className="text-sm text-ink/70 mb-8">
          Reviewed and Fact-Checked by Michael Alex, DVM
        </p>

        <div className="gold-rule mb-8" />

        <h2 className="font-display text-xl text-forest mb-3">
          Haven Paws Has Partnered With Fetch to Offer an Exclusive Discount for Haven Paws
          Customers
        </h2>
        <p className="text-ink/80 leading-relaxed mb-4">
          Bringing home a puppy is an exciting experience. Puppies are naturally curious and
          eager to explore everything around them, from unfamiliar scents to new people and
          interesting objects. While their adventurous nature is part of the fun, it can also
          expose them to accidents and unexpected health issues.
        </p>
        <p className="text-ink/80 leading-relaxed mb-8">
          This is where pet insurance becomes valuable. Similar to health insurance for
          people, pet insurance helps cover eligible veterinary expenses when your puppy
          becomes sick or injured. It offers peace of mind by reducing the financial burden
          of unexpected medical care. But what exactly does pet insurance include?
        </p>

        <h2 className="font-display text-xl text-forest mb-3">What Is Pet Insurance?</h2>
        <p className="text-ink/80 leading-relaxed mb-8">
          Pet insurance is designed to help pay for veterinary treatment when your dog
          becomes ill or suffers an injury.
        </p>

        <h2 className="font-display text-xl text-forest mb-3">
          Fetch Pet Insurance — Haven Paws Customers Save 10% Every Month for One Full Year
        </h2>
        <p className="text-ink/80 leading-relaxed mb-4">
          Fetch Pet Insurance helps reduce the cost of veterinary care for both dogs and
          cats. Its comprehensive coverage includes accidents, illnesses, hereditary
          conditions, dental disease affecting adult teeth, examination fees, and many other
          eligible treatments.
        </p>
        <p className="text-ink/80 leading-relaxed mb-8">
          With Fetch, you can visit any licensed veterinarian in the United States or Canada.
          The company is highly rated by customers and reimburses up to 90% of eligible
          veterinary expenses.
        </p>
        <p className="text-ink/80 leading-relaxed mb-8">
          Plans are flexible and can be customized to fit different budgets. Annual coverage
          limits range from $2,500 to unlimited, and customers can choose between annual or
          per-condition deductibles. Reimbursement options of 70%, 80%, or 90% are available
          based on the veterinarian&apos;s invoice.
        </p>

        {extraImages.partner_logo && (
          <div className="w-40 mx-auto my-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cldOptimized(extraImages.partner_logo, 300)}
              alt="Fetch Pet Insurance"
              className="w-full h-auto"
            />
          </div>
        )}

        <h2 className="font-display text-xl text-forest mb-3">How Fetch Works</h2>

        <h3 className="text-forest font-medium mb-2">Visit Any Licensed Veterinarian</h3>
        <p className="text-ink/80 leading-relaxed mb-6">
          You&apos;re free to continue seeing your current veterinarian or choose a different
          one whenever needed. Coverage also extends to veterinary specialists and emergency
          animal hospitals.
        </p>

        <h3 className="text-forest font-medium mb-2">Submit a Claim Quickly</h3>
        <p className="text-ink/80 leading-relaxed mb-6">
          Simply upload photos of your veterinary invoices, answer a few questions about your
          pet&apos;s treatment, and Fetch handles the rest of the claims process.
        </p>

        <h3 className="text-forest font-medium mb-2">Receive Your Reimbursement Faster</h3>
        <p className="text-ink/80 leading-relaxed mb-8">
          Once your claim is approved, you can receive reimbursement for up to 90% of
          eligible veterinary costs through direct deposit in as little as two days. Most
          claims are processed within 15 days after all required documents have been
          received, and you&apos;ll receive email updates throughout the process.
        </p>

        <h2 className="font-display text-xl text-forest mb-3">What&apos;s Covered?</h2>
        <p className="text-ink/80 leading-relaxed mb-3">
          Fetch covers new illnesses and injuries that occur after the waiting period has
          ended. Standard coverage includes:
        </p>
        <ul className="list-disc pl-5 text-ink/80 leading-relaxed mb-8 space-y-1">
          <li>Veterinary treatment for accidental injuries such as cuts, broken bones, torn ACLs, and swallowed foreign objects.</li>
          <li>Medical treatment for illnesses ranging from digestive problems and urinary tract infections to heart disease and cancer.</li>
          <li>Examination fees associated with sick visits.</li>
          <li>Dental disease and injuries affecting every adult tooth and gum, including periodontal disease, oral tumors, and trauma.</li>
          <li>Breed-related hereditary and genetic conditions.</li>
          <li>Alternative and holistic treatments prescribed by a veterinarian, including acupuncture, chiropractic care, aromatherapy, and homeopathic therapy.</li>
          <li>Emergency veterinary care.</li>
          <li>Treatment provided by veterinary specialists, including orthopedic surgeons, oncologists, cardiologists, dentists, and other specialists.</li>
        </ul>

        <h2 className="font-display text-xl text-forest mb-3">What&apos;s Not Covered?</h2>
        <p className="text-ink/80 leading-relaxed mb-3">
          Like most pet insurance plans, there are certain exclusions. Coverage generally
          does not include:
        </p>
        <ul className="list-disc pl-5 text-ink/80 leading-relaxed mb-8 space-y-1">
          <li>Routine wellness and preventive care, such as vaccinations, annual checkups, spaying or neutering, and professional dental cleanings.</li>
          <li>Pre-existing medical conditions that developed before enrollment or during the waiting period.</li>
          <li>Illnesses or injuries that occur before coverage officially becomes active.</li>
        </ul>

        <h2 className="font-display text-xl text-forest mb-3">
          What Type of Coverage Is Right for You?
        </h2>
        <p className="text-ink/80 leading-relaxed mb-4">
          The best pet insurance plan depends on your financial situation and your comfort
          level with unexpected veterinary expenses.
        </p>
        <p className="text-ink/80 leading-relaxed mb-4">
          If you&apos;re prepared to pay large emergency medical bills yourself, you may
          choose a plan with lower monthly premiums and more limited coverage. However, if
          you&apos;d rather reduce the risk of facing expensive veterinary costs, selecting a
          lower deductible or higher reimbursement option may be a better choice.
        </p>
        <p className="text-ink/80 leading-relaxed">
          Since pet insurance plans are highly customizable, you can adjust deductibles,
          reimbursement percentages, and annual limits to create coverage that best suits
          both your budget and your puppy&apos;s healthcare needs.
        </p>
      </article>

      <Footer />
    </main>
  );
}