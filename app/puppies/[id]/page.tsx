import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";
import RecordPuppyView from "../../components/RecordPuppyView";
import PuppyGallery from "../../components/PuppyGallery";
import InquiryForm from "../../components/InquiryForm";
import PuppyIncluded from "../../components/PuppyIncluded";
import PuppyParents from "../../components/PuppyParents";
import PuppySiblings from "../../components/PuppySiblings";
import AboutBreeder from "../../components/AboutBreeder";
import RelatedPuppies from "../../components/RelatedPuppies";
import RelatedBreedsSection from "../../components/RelatedBreedsSection";
import BreederAttributionCard from "../../components/BreederAttributionCard";
import BreedGuideCard from "../../components/BreedGuideCard";
import Testimonials from "../../components/Testimonials";
import DeliveryInfo from "../../components/DeliveryInfo";
import PuppyBookingWidget from "../../components/PuppyBookingWidget";
import TrustBadgeRow from "../../components/TrustBadgeRow";
import PaymentExplainer from "../../components/PaymentExplainer";
import PurchaseTimeline from "../../components/PurchaseTimeline";
import { getPuppyDetail } from "@/lib/queries/puppyDetail";
import { getRelatedPuppies } from "@/lib/queries/relatedPuppies";
import { getReviews, getReviewStats } from "@/lib/queries/testimonials";
import { getSiblings } from "@/lib/queries/siblings";
import { getSettings } from "@/lib/queries/settings";
import { getBreedInfo } from "@/lib/queries/breedInfo";
import {
  getPuppiesInPriceRange,
  getRelatedBreedsByGroup,
} from "@/lib/queries/recommendations";

const statusColor: Record<string, string> = {
  available: "bg-gold text-forest",
  reserved: "bg-sage text-cream",
  sold: "border border-ink/40 text-ink/60",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const puppy = await getPuppyDetail(id);

  if (!puppy) {
    return { title: "Puppy Not Found" };
  }

  const title = `${puppy.name} — ${puppy.breed} Puppy for Adoption`;

  const description = puppy.description
    ? puppy.description.slice(0, 155)
    : `Meet ${puppy.name}, a ${puppy.breed} puppy available through Haven Paws.`;

  const image =
    puppy.media.find((m) => m.isCover)?.url ??
    puppy.media[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
      url: `/puppies/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PuppyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const puppy = await getPuppyDetail(id);

  if (!puppy) notFound();

  const [
    related,
    reviews,
    reviewStats,
    siblings,
    settings,
    breedInfo,
  ] = await Promise.all([
    getRelatedPuppies(puppy.breedId, puppy.id),
    getReviews(4),
    getReviewStats(),
    getSiblings(puppy.litterId, puppy.id),
    getSettings(),
    getBreedInfo(puppy.breedId),
  ]);

  const excludeIds = [
    puppy.id,
    ...related.map((r) => r.id),
  ];

  const [priceRangePuppies, relatedBreeds] =
    await Promise.all([
      getPuppiesInPriceRange(puppy.price, excludeIds),
      getRelatedBreedsByGroup(
        breedInfo?.breedGroup ?? null,
        puppy.breedId
      ),
    ]);

  const coverImage =
    puppy.media.find((m) => m.isCover)?.url ??
    puppy.media[0]?.url ??
    null;

  return (
    <main className="pb-20 md:pb-0">
      <Navbar />

      <RecordPuppyView
        id={puppy.id}
        name={puppy.name}
        breed={puppy.breed}
        image={coverImage}
      />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Puppies", href: "/puppies" },
            { label: puppy.name },
          ]}
        />
      </section>

      <section className="max-w-5xl mx-auto px-6 py-6 grid md:grid-cols-2 gap-10">
        <PuppyGallery
          media={puppy.media}
          name={puppy.name}
        />

        <div>
          <span
            className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${statusColor[puppy.status]}`}
          >
            {puppy.status}
          </span>

          <h1 className="font-display text-3xl text-forest mt-3 mb-1">
            {puppy.name}
          </h1>

          <p className="eyebrow mb-1">
            {puppy.breed}
          </p>

          <p className="text-sm text-ink/60 capitalize mb-3">
            {puppy.sex}
            {puppy.ageWeeks !== null
              ? ` · ${puppy.ageWeeks} weeks old`
              : ""}
          </p>

          <TrustBadgeRow
            hasBreederProfile={!!puppy.breederSlug}
            avgRating={reviewStats.avgRating}
            reviewCount={reviewStats.count}
          />

          <div className="gold-rule mb-4" />

          <p className="text-2xl text-ink font-medium mb-4">
            ${puppy.price.toLocaleString()}
          </p>

          <PuppyBookingWidget
            puppy={{
              id: puppy.id,
              name: puppy.name,
              breed: puppy.breed,
              sex: puppy.sex,
              ageWeeks: puppy.ageWeeks,
              price: puppy.price,
              depositAmount: puppy.depositAmount,
              coverImage,
              status: puppy.status,
            }}
            settings={settings}
          />

          <PaymentExplainer
            price={puppy.price}
            depositAmount={puppy.depositAmount}
          />

          {puppy.description && (
            <div className="mb-6">
              <h3 className="font-display text-lg text-forest mb-2">
                About {puppy.name}
              </h3>

              <p className="text-ink/80 leading-relaxed">
                {puppy.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm mb-2">
            <div>
              <p className="text-sage text-xs uppercase tracking-wider">
                Color
              </p>
              <p className="text-ink">
                {puppy.color ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-sage text-xs uppercase tracking-wider">
                Est. Weight
              </p>
              <p className="text-ink">
                {puppy.weightEstimate
                  ? `${puppy.weightEstimate} lbs`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-sage text-xs uppercase tracking-wider">
                Vet Checked
              </p>
              <p className="text-ink">
                {puppy.vetChecked ? "Yes" : "Pending"}
              </p>
            </div>

            <div>
              <p className="text-sage text-xs uppercase tracking-wider">
                Vaccinated
              </p>
              <p className="text-ink">
                {puppy.vaccinated ? "Yes" : "Pending"}
              </p>
            </div>

            {puppy.microchipId && (
              <div className="col-span-2">
                <p className="text-sage text-xs uppercase tracking-wider">
                  Microchip ID
                </p>
                <p className="text-ink">
                  {puppy.microchipId}
                </p>
              </div>
            )}
          </div>

          {/* Meet the Breeder */}
          <BreederAttributionCard
            puppyName={puppy.name}
            breederName={puppy.breederName}
            breederSlug={puppy.breederSlug}
          />

          {/* Automatically synchronized with this puppy's breed */}
          <BreedGuideCard breed={breedInfo} />

          <PuppyIncluded items={puppy.includedItems} />

          <div className="mt-6 border-t border-sage/15 pt-5">
            <h3 className="font-display text-lg text-forest mb-4">
              What happens next
            </h3>

            <PurchaseTimeline />
          </div>

          <div id="inquiry-form" className="mt-6">
            <InquiryForm
              puppyId={puppy.id}
              puppyName={puppy.name}
            />
          </div>
        </div>
      </section>

      <PuppyParents
        puppyName={puppy.name}
        mom={puppy.mom}
        dad={puppy.dad}
      />

      <PuppySiblings
        puppyName={puppy.name}
        siblings={siblings}
      />

      <DeliveryInfo />

      <RelatedPuppies
        puppies={related}
        breedName={puppy.breed}
      />

      <RelatedPuppies
        puppies={priceRangePuppies}
        breedName={puppy.breed}
        eyebrow="You May Also Like"
        title="Puppies in Your Price Range"
      />

      <RelatedBreedsSection
        breeds={relatedBreeds}
      />

      <Testimonials reviews={reviews} />

      <AboutBreeder settings={settings} />

      <Footer />
    </main>
  );
}