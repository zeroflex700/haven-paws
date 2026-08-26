import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
import FavoriteButton from "../../components/FavoriteButton";
import RelatedBreedsSection from "../../components/RelatedBreedsSection";
import BreederAttributionCard from "../../components/BreederAttributionCard";
import BreedGuideCard from "../../components/BreedGuideCard";
import PuppyBookingWidget from "../../components/PuppyBookingWidget";
import PuppyBioSection from "../../components/PuppyBioSection";
import Testimonials from "../../components/Testimonials";
import DeliveryInfo from "../../components/DeliveryInfo";
import TrustBadgeRow from "../../components/TrustBadgeRow";
import PaymentExplainer from "../../components/PaymentExplainer";
import PurchaseTimeline from "../../components/PurchaseTimeline";

import { getPuppyDetail } from "@/lib/queries/puppyDetail";
import { getRelatedPuppies } from "@/lib/queries/relatedPuppies";
import {
  getReviews,
  getReviewStats,
} from "@/lib/queries/testimonials";
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
    return {
      title: "Puppy Not Found",
    };
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

  if (!puppy) {
    notFound();
  }

  const [
    related,
    reviews,
    reviewStats,
    siblings,
    settings,
    breedInfo,
  ] = await Promise.all([
    getRelatedPuppies(
      puppy.breedId,
      puppy.id
    ),
    getReviews(4),
    getReviewStats(),
    getSiblings(
      puppy.litterId,
      puppy.id
    ),
    getSettings(),
    getBreedInfo(
      puppy.breedId
    ),
  ]);

  const excludeIds = [
    puppy.id,
    ...related.map((r) => r.id),
  ];

  const [
    priceRangePuppies,
    relatedBreeds,
  ] = await Promise.all([
    getPuppiesInPriceRange(
      puppy.price,
      excludeIds
    ),
    getRelatedBreedsByGroup(
      breedInfo?.breedGroup ?? null,
      puppy.breedId
    ),
  ]);

  const coverImage =
    puppy.media.find(
      (m) => m.isCover
    )?.url ??
    puppy.media[0]?.url ??
    null;

  return (
    <main className="min-h-screen bg-cream pb-20 md:pb-0">
      <Navbar />

      {/* ================================================================ */}
      {/* RECORD / RECENTLY VIEWED                                         */}
      {/* ================================================================ */}

      <RecordPuppyView
        id={puppy.id}
        name={puppy.name}
        breed={puppy.breed}
        image={coverImage}
      />

      {/* ================================================================ */}
      {/* BREADCRUMBS                                                       */}
      {/* ================================================================ */}

      <section className="border-b border-sage/10 bg-cream">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-4">
          <Breadcrumbs
            items={[
              {
                label: "Home",
                href: "/",
              },
              {
                label: "Puppies",
                href: "/puppies",
              },
              {
                label: puppy.name,
              },
            ]}
          />
        </div>
      </section>

      {/* ================================================================ */}
      {/* HERO                                                              */}
      {/* ================================================================ */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-6 sm:pt-8 lg:pt-10 pb-10 lg:pb-14">

          <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.65fr)] gap-8 xl:gap-12 items-start">

            {/* ========================================================== */}
            {/* GALLERY                                                     */}
            {/* ========================================================== */}

            <div className="min-w-0">

              <div className="relative rounded-[28px] overflow-hidden bg-white border border-sage/10 shadow-[0_18px_60px_rgba(39,63,48,0.08)]">

                <PuppyGallery
                  media={puppy.media}
                  name={puppy.name}
                />

              </div>

              {/* Small visual trust strip */}
              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">

                <div className="rounded-2xl border border-sage/10 bg-white px-3 py-3 sm:px-4">
                  <div className="flex items-center gap-2 text-forest">
                    <ShieldCheck
                      size={15}
                      strokeWidth={1.7}
                    />
                    <span className="text-[11px] sm:text-xs font-medium">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-sage/10 bg-white px-3 py-3 sm:px-4">
                  <div className="flex items-center gap-2 text-forest">
                    <Check
                      size={15}
                      strokeWidth={1.8}
                    />
                    <span className="text-[11px] sm:text-xs font-medium">
                      Trusted process
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-sage/10 bg-white px-3 py-3 sm:px-4">
                  <div className="flex items-center gap-2 text-forest">
                    <Sparkles
                      size={15}
                      strokeWidth={1.7}
                    />
                    <span className="text-[11px] sm:text-xs font-medium">
                      Haven Paws
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* ========================================================== */}
            {/* PURCHASE / INFORMATION PANEL                               */}
            {/* ========================================================== */}

            <div className="lg:sticky lg:top-24 min-w-0">

              <div className="rounded-[28px] border border-sage/15 bg-white shadow-[0_18px_60px_rgba(39,63,48,0.08)] overflow-hidden">

                {/* ------------------------------------------------------ */}
                {/* Header                                                  */}
                {/* ------------------------------------------------------ */}

                <div className="p-5 sm:p-7 lg:p-8">

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <span
                        className={`inline-flex items-center text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full ${statusColor[puppy.status]}`}
                      >
                        {puppy.status}
                      </span>

                      <p className="eyebrow mt-5 mb-2">
                        {puppy.breed}
                      </p>

                      <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] leading-[0.98] tracking-[-0.025em] text-forest">
                        {puppy.name}
                      </h1>

                      <p className="text-sm text-ink/55 capitalize mt-3">
                        {puppy.sex}
                        {puppy.ageWeeks !== null
                          ? ` · ${puppy.ageWeeks} weeks old`
                          : ""}
                      </p>

                    </div>

                   <div className="shrink-0">
  <FavoriteButton
    puppyId={puppy.id}
    size={18}
    className="h-10 w-10 border border-sage/10 bg-cream-alt"
  />
</div>

                  </div>

                  {/* ---------------------------------------------------- */}
                  {/* Trust                                                   */}
                  {/* ---------------------------------------------------- */}

                  <div className="mt-6">
                    <TrustBadgeRow
                      hasBreederProfile={
                        !!puppy.breederSlug
                      }
                      avgRating={
                        reviewStats.avgRating
                      }
                      reviewCount={
                        reviewStats.count
                      }
                    />
                  </div>

                  <div className="h-px bg-sage/10 my-6" />

                  {/* ---------------------------------------------------- */}
                  {/* Price                                                   */}
                  {/* ---------------------------------------------------- */}

                  <div className="mb-5">

                    <p className="text-[10px] uppercase tracking-[0.16em] text-sage mb-1.5">
                      Adoption price
                    </p>

                    <p className="text-3xl sm:text-4xl font-medium tracking-tight text-ink">
                      ${puppy.price.toLocaleString()}
                    </p>

                  </div>

                  {/* ---------------------------------------------------- */}
                  {/* Booking                                                 */}
                  {/* ---------------------------------------------------- */}

                  <div className="rounded-2xl bg-cream-alt/45 border border-sage/10 p-4 sm:p-5">

                    <PuppyBookingWidget
                      puppy={{
                        id: puppy.id,
                        name: puppy.name,
                        breed: puppy.breed,
                        sex: puppy.sex,
                        ageWeeks: puppy.ageWeeks,
                        price: puppy.price,
                        depositAmount:
                          puppy.depositAmount,
                        coverImage,
                        status: puppy.status,
                      }}
                      settings={settings}
                    />

                  </div>

                  <div className="mt-4">
                    <PaymentExplainer
                      price={puppy.price}
                      depositAmount={
                        puppy.depositAmount
                      }
                    />
                  </div>

                </div>

                {/* ------------------------------------------------------ */}
                {/* Quick facts                                              */}
                {/* ------------------------------------------------------ */}

                <div className="border-t border-sage/10 bg-cream-alt/30 px-5 sm:px-7 lg:px-8 py-5">

                  <div className="grid grid-cols-2 gap-x-5 gap-y-5">

                    <DetailFact
                      label="Color"
                      value={puppy.color ?? "—"}
                    />

                    <DetailFact
                      label="Est. Weight"
                      value={
                        puppy.weightEstimate
                          ? `${puppy.weightEstimate} lbs`
                          : "—"
                      }
                    />

                    <DetailFact
                      label="Vet Checked"
                      value={
                        puppy.vetChecked
                          ? "Yes"
                          : "Pending"
                      }
                    />

                    <DetailFact
                      label="Vaccinated"
                      value={
                        puppy.vaccinated
                          ? "Yes"
                          : "Pending"
                      }
                    />

                    {puppy.microchipId && (
                      <div className="col-span-2">
                        <DetailFact
                          label="Microchip ID"
                          value={
                            puppy.microchipId
                          }
                        />
                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* STORY / DETAILS                                                   */}
      {/* ================================================================ */}

      <section className="border-t border-sage/10 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-12 lg:py-16">

          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-10 xl:gap-16 items-start">

            {/* Main editorial column */}
            <div className="min-w-0 space-y-10">

              {/* About */}
              {puppy.description && (
                <section>
                  <div className="max-w-3xl">

                    <p className="text-[10px] uppercase tracking-[0.2em] text-sage font-medium mb-3">
                      Meet {puppy.name}
                    </p>

                    <h2 className="font-display text-3xl sm:text-4xl text-forest tracking-tight mb-5">
                      About {puppy.name}
                    </h2>

                    <p className="text-base sm:text-lg text-ink/75 leading-8">
                      {puppy.description}
                    </p>

                  </div>
                </section>
              )}

              {/* Breeder */}
              <section className="rounded-[24px] border border-sage/10 bg-cream-alt/35 p-5 sm:p-7">

                <BreederAttributionCard
                  puppyName={puppy.name}
                  breederName={puppy.breederName}
                  breederSlug={puppy.breederSlug}
                  breederPhotoUrl={
                    puppy.breederPhotoUrl
                  }
                />

              </section>

              {/* Breed guide */}
              <section className="rounded-[24px] border border-sage/10 bg-white">

                <BreedGuideCard
                  breed={breedInfo}
                />

              </section>

              {/* Included */}
              <section className="rounded-[24px] border border-sage/10 bg-white overflow-hidden">

                <PuppyIncluded
                  items={puppy.includedItems}
                />

              </section>

              {/* Timeline */}
              <section className="rounded-[24px] border border-sage/10 bg-cream-alt/35 p-5 sm:p-7">

                <div className="mb-6">

                  <p className="text-[10px] uppercase tracking-[0.2em] text-sage font-medium mb-2">
                    Your journey
                  </p>

                  <h2 className="font-display text-2xl sm:text-3xl text-forest">
                    What happens next
                  </h2>

                </div>

                <PurchaseTimeline />

              </section>

              {/* Inquiry */}
              <section
                id="inquiry-form"
                className="scroll-mt-28 rounded-[24px] border border-sage/10 bg-white overflow-hidden"
              >
                <InquiryForm
                  puppyId={puppy.id}
                  puppyName={puppy.name}
                />
              </section>

            </div>

            {/* Side reassurance panel */}
            <aside className="lg:sticky lg:top-24 space-y-4">

              <div className="rounded-[24px] border border-sage/10 bg-cream-alt/45 p-5 sm:p-6">

                <div className="flex items-start gap-3">

                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-sage/10 flex items-center justify-center text-forest">
                    <ShieldCheck
                      size={18}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div>

                    <p className="text-sm font-medium text-forest">
                      A more thoughtful way to adopt
                    </p>

                    <p className="text-xs text-ink/60 leading-5 mt-1.5">
                      Haven Paws keeps the puppy journey organized,
                      transparent, and secure.
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-[24px] border border-sage/10 bg-white p-5 sm:p-6">

                <p className="text-[10px] uppercase tracking-[0.18em] text-sage font-medium mb-3">
                  Puppy profile
                </p>

                <div className="space-y-3">

                  <MiniFact
                    label="Breed"
                    value={puppy.breed}
                  />

                  <MiniFact
                    label="Sex"
                    value={puppy.sex}
                  />

                  {puppy.ageWeeks !== null && (
                    <MiniFact
                      label="Age"
                      value={`${puppy.ageWeeks} weeks old`}
                    />
                  )}

                  <MiniFact
                    label="Status"
                    value={puppy.status}
                  />

                </div>

              </div>

            </aside>

          </div>
        </div>
      </section>

{/* ================================================================ */}
      {/* PUPPY BIO                                                         */}
      {/* ================================================================ */}

      <section className="bg-white border-t border-sage/10">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20">

          <div className="max-w-2xl mb-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sage font-medium mb-3">
              Details
            </p>

            <h2 className="font-display text-3xl sm:text-4xl text-forest tracking-tight">
              About {puppy.name}
            </h2>
          </div>

          <PuppyBioSection
            puppyName={puppy.name}
            color={puppy.color}
            markings={puppy.markings}
            size={puppy.size}
            generation={puppy.generation}
          />

        </div>
      </section>
      {/* ================================================================ */}
      {/* FAMILY                                                            */}
      {/* ================================================================ */}

      <section className="bg-cream border-t border-sage/10">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20">

          <div className="max-w-2xl mb-10">

            <p className="text-[10px] uppercase tracking-[0.2em] text-sage font-medium mb-3">
              Family
            </p>

            <h2 className="font-display text-3xl sm:text-4xl text-forest tracking-tight">
              {puppy.name}&apos;s family
            </h2>

          </div>

          <div className="space-y-12">

            <PuppyParents
              puppyName={puppy.name}
              mom={puppy.mom}
              dad={puppy.dad}
            />

            <PuppySiblings
              puppyName={puppy.name}
              siblings={siblings}
            />

          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/* DELIVERY                                                          */}
      {/* ================================================================ */}

      <section className="bg-white border-t border-sage/10">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20">

          <DeliveryInfo />

        </div>

      </section>

      {/* ================================================================ */}
      {/* RELATED PUPPIES                                                   */}
      {/* ================================================================ */}

      <section className="bg-cream border-t border-sage/10">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20 space-y-16">

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

        </div>

      </section>

      {/* ================================================================ */}
      {/* SOCIAL PROOF                                                      */}
      {/* ================================================================ */}

      <section className="bg-white border-t border-sage/10">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20">

          <Testimonials
            reviews={reviews}
          />

        </div>

      </section>

      {/* ================================================================ */}
      {/* BREEDER                                                           */}
      {/* ================================================================ */}

      <section className="bg-cream border-t border-sage/10">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20">

          <AboutBreeder
            settings={settings}
          />

        </div>

      </section>

      <Footer />
    </main>
  );
}

/* ========================================================================== */
/* SMALL PRESENTATIONAL HELPERS                                               */
/* ========================================================================== */

function DetailFact({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.16em] text-sage font-medium mb-1">
        {label}
      </p>

      <p className="text-sm text-ink font-medium break-words">
        {value}
      </p>
    </div>
  );
}

function MiniFact({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-sage/10 pb-3 last:border-0 last:pb-0">

      <span className="text-xs text-sage">
        {label}
      </span>

      <span className="text-xs font-medium text-forest text-right capitalize">
        {value}
      </span>

    </div>
  );
}