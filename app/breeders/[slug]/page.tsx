import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import { ProtectedImage } from "../../components/ProtectedMedia";
import BreederQAList from "../../components/BreederQAList";
import BreederPhotoStrip from "../../components/BreederPhotoStrip";
import BreederHomeGallery from "../../components/BreederHomeGallery";
import BreederContractSection from "../../components/BreederContractSection";
import BreederIncludedList from "../../components/BreederIncludedList";
import BreederIconTextSection from "../../components/BreederIconTextSection";
import BreederQualificationsGrid from "../../components/BreederQualificationsGrid";
import BreedGuideCard from "../../components/BreedGuideCard";
import { cldOptimized } from "@/lib/cloudinary";
import { ShieldCheck, BadgeCheck } from "lucide-react";
import {
  getBreederBySlug,
  getBreederHomePhotos,
  getBreederQA,
  getBreederPhotos,
  getBreederIncludedItems,
  getBreederMoreAbout,
  getBreederQualifications,
  getBreederHealthTesting,
} from "@/lib/queries/breeders";
import { getBreedInfo } from "@/lib/queries/breedInfo";

export default async function BreederProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const breeder = await getBreederBySlug(slug);

  if (!breeder) notFound();

  const [
    homePhotos,
    qa,
    photos,
    included,
    moreAbout,
    qualifications,
    healthTesting,
    breedInfo,
  ] = await Promise.all([
    getBreederHomePhotos(breeder.id),
    getBreederQA(breeder.id),
    getBreederPhotos(breeder.id),
    getBreederIncludedItems(breeder.id),
    getBreederMoreAbout(breeder.id),
    getBreederQualifications(breeder.id),
    getBreederHealthTesting(breeder.id),
    breeder.breedName
      ? getBreedInfoByName(breeder.breedName)
      : Promise.resolve(null),
  ]);

  return (
    <main>
      <Navbar />

      <PageContainer className="py-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-cream-alt shrink-0">
            {breeder.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cldOptimized(breeder.photoUrl, 150)}
                alt={breeder.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div>
            <h1 className="h2">{breeder.name}</h1>

            {breeder.breedName && (
              <p className="small-text">
                Breeder of {breeder.breedName}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink/70 mb-10">
          <span className="flex items-center gap-1.5">
            <ShieldCheck
              size={13}
              className="text-gold"
              strokeWidth={1.5}
            />
            Reviewed and approved by Haven Paws
          </span>

          {qualifications.length > 0 && (
            <span className="flex items-center gap-1.5">
              <BadgeCheck
                size={13}
                className="text-gold"
                strokeWidth={1.5}
              />
              {qualifications.length} verified qualification
              {qualifications.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Meet the Breeder */}
        <section className="mb-6">
          <h2 className="h2 mb-4">
            Meet the breeder
          </h2>

          {breeder.meetBreederImageUrl && (
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <ProtectedImage
                src={breeder.meetBreederImageUrl}
                alt={breeder.name}
              />
            </div>
          )}

          {breeder.meetBreederText && (
            <p className="body-text whitespace-pre-line">
              {breeder.meetBreederText}
            </p>
          )}
        </section>

        {/* Automatically synchronized with this breeder's breed */}
        <BreedGuideCard breed={breedInfo} />

        {/* Home Gallery */}
        <BreederHomeGallery
          title={breeder.homeGalleryTitle}
          photos={homePhotos}
        />

        <BreederQAList
          breederName={breeder.name}
          items={qa}
        />

        <BreederPhotoStrip
          breederName={breeder.name}
          photos={photos}
        />

        {breeder.gettingAPuppyText && (
          <section className="mb-12">
            <h2 className="h2 mb-4">
              Getting a puppy from {breeder.name}
            </h2>

            <p className="body-text whitespace-pre-line">
              {breeder.gettingAPuppyText}
            </p>
          </section>
        )}

        <BreederContractSection
          breederName={breeder.name}
        />

        <BreederIncludedList items={included} />

        <BreederIconTextSection
          title={`More about ${breeder.name}`}
          items={moreAbout}
        />

        <BreederQualificationsGrid
          items={qualifications}
        />

        <BreederIconTextSection
          title="Parent health testing"
          items={healthTesting}
        />
      </PageContainer>

      <Footer />
    </main>
  );
}