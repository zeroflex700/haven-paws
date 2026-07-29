import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PuppyGallery from "../../components/PuppyGallery";
import InquiryForm from "../../components/InquiryForm";
import PuppyIncluded from "../../components/PuppyIncluded";
import PuppyParents from "../../components/PuppyParents";
import PuppySiblings from "../../components/PuppySiblings";
import AboutBreeder from "../../components/AboutBreeder";
import BreedFacts from "../../components/BreedFacts";
import RelatedPuppies from "../../components/RelatedPuppies";
import Testimonials from "../../components/Testimonials";
import DeliveryInfo from "../../components/DeliveryInfo";
import StickyReserveBar from "../../components/StickyReserveBar";
import { getPuppyDetail } from "@/lib/queries/puppyDetail";
import { getRelatedPuppies } from "@/lib/queries/relatedPuppies";
import { getReviews } from "@/lib/queries/testimonials";
import { getSiblings } from "@/lib/queries/siblings";
import { getSettings } from "@/lib/queries/settings";
import { getBreedInfo } from "@/lib/queries/breedInfo";

const statusColor: Record<string, string> = {
  available: "bg-gold text-forest",
  reserved: "bg-sage text-cream",
  sold: "border border-ink/40 text-ink/60",
};

export default async function PuppyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const puppy = await getPuppyDetail(id);

  if (!puppy) notFound();

  const [related, reviews, siblings, settings, breedInfo] = await Promise.all([
    getRelatedPuppies(puppy.breedId, puppy.id),
    getReviews(4),
    getSiblings(puppy.litterId, puppy.id),
    getSettings(),
    getBreedInfo(puppy.breedId),
  ]);

  return (
    <main className="pb-20 md:pb-0">
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        <PuppyGallery media={puppy.media} name={puppy.name} />

        <div>
          <span
            className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${statusColor[puppy.status]}`}
          >
            {puppy.status}
          </span>
          <h1 className="font-display text-3xl text-forest mt-3 mb-1">{puppy.name}</h1>
          <p className="eyebrow mb-1">{puppy.breed}</p>
          <p className="text-sm text-ink/60 capitalize mb-4">
            {puppy.sex}
            {puppy.ageWeeks !== null ? ` · ${puppy.ageWeeks} weeks old` : ""}
          </p>
          <div className="gold-rule mb-4" />

          <p className="text-2xl text-ink font-medium mb-6">
            ${puppy.price.toLocaleString()}
          </p>

          {puppy.description && (
            <div className="mb-6">
              <h3 className="font-display text-lg text-forest mb-2">
                About {puppy.name}
              </h3>
              <p className="text-ink/80 leading-relaxed">{puppy.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm mb-2">
            <div>
              <p className="text-sage text-xs uppercase tracking-wider">Color</p>
              <p className="text-ink">{puppy.color ?? "—"}</p>
            </div>
            <div>
              <p className="text-sage text-xs uppercase tracking-wider">Est. Weight</p>
              <p className="text-ink">
                {puppy.weightEstimate ? `${puppy.weightEstimate} lbs` : "—"}
              </p>
            </div>
            <div>
              <p className="text-sage text-xs uppercase tracking-wider">Vet Checked</p>
              <p className="text-ink">{puppy.vetChecked ? "Yes" : "Pending"}</p>
            </div>
            <div>
              <p className="text-sage text-xs uppercase tracking-wider">Vaccinated</p>
              <p className="text-ink">{puppy.vaccinated ? "Yes" : "Pending"}</p>
            </div>
            {puppy.microchipId && (
              <div className="col-span-2">
                <p className="text-sage text-xs uppercase tracking-wider">Microchip ID</p>
                <p className="text-ink">{puppy.microchipId}</p>
              </div>
            )}
          </div>

          <PuppyIncluded />

          <div id="inquiry-form" className="mt-6">
            <InquiryForm puppyId={puppy.id} puppyName={puppy.name} />
          </div>
        </div>
      </section>

      <PuppyParents puppyName={puppy.name} mom={puppy.mom} dad={puppy.dad} />
      <PuppySiblings puppyName={puppy.name} siblings={siblings} />
      <DeliveryInfo />
      <RelatedPuppies puppies={related} breedName={puppy.breed} />
      <Testimonials reviews={reviews} />
      <BreedFacts breed={breedInfo} />
      <AboutBreeder settings={settings} />

      <Footer />
      <StickyReserveBar price={puppy.price} status={puppy.status} />
    </main>
  );
}