import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageContainer from "../../components/PageContainer";
import Breadcrumbs from "../../components/Breadcrumbs";
import BreedGuideTabs from "../../components/BreedGuideTabs";
import BreedGuideArticleSection from "../../components/BreedGuideArticleSection";
import BreedGuideScorecard from "../../components/BreedGuideScorecard";
import BreedGuideAtAGlance from "../../components/BreedGuideAtAGlance";
import BrowsePuppiesCard from "../../components/BrowsePuppiesCard";
import BreedGuideRelated from "../../components/BreedGuideRelated";
import FaqAccordion from "../../components/FaqAccordion";
import OptimizedImage from "../../components/OptimizedImage";
import {
  getBreedGuideBySlug,
  getBreedLiveStats,
  getHealthIssues,
  getGuideFaqs,
  getRelatedBreeds,
} from "@/lib/queries/breedGuides";

export default async function BreedGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getBreedGuideBySlug(slug);

  if (!guide) notFound();

  const [stats, healthIssues, faqs, related] = await Promise.all([
    getBreedLiveStats(guide.breedId),
    getHealthIssues(guide.id),
    getGuideFaqs(guide.id),
    getRelatedBreeds(guide.relatedBreedIds),
  ]);

  return (
    <main>
      <Navbar />

      <PageContainer className="max-w-3xl pt-6 pb-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Breed Guides", href: "/breed-guides" },
            { label: `${guide.breedName}s` },
          ]}
        />
      </PageContainer>

      <PageContainer className="max-w-3xl pb-6">
        <p className="eyebrow mb-2">Get to Know</p>
        <h1 className="h1 mb-4">{guide.breedName}s</h1>

        {guide.authorName && (
          <div className="flex items-center gap-3 mb-6">
            {guide.authorPhotoUrl && (
              <div className="w-9 h-9 rounded-full overflow-hidden bg-cream-alt shrink-0">
                <OptimizedImage src={guide.authorPhotoUrl} alt={guide.authorName} sizes="36px" />
              </div>
            )}
            <p className="small-text">
              Written by {guide.authorName}
              {guide.authorCredential ? ` · ${guide.authorCredential}` : ""}
            </p>
          </div>
        )}

        {guide.heroImageUrl && (
          <div className="aspect-video rounded-lg overflow-hidden mb-2">
            <OptimizedImage src={guide.heroImageUrl} alt={guide.breedName} priority sizes="(max-width: 768px) 100vw, 700px" />
          </div>
        )}
        {guide.photoCredit && <p className="small-text">{guide.photoCredit}</p>}
      </PageContainer>

      <BreedGuideTabs />

      <PageContainer className="max-w-2xl py-8 text-center">
        {guide.overviewQuote && <p className="h2 mb-3">{guide.overviewQuote}</p>}
        {guide.overviewSupport && <p className="body-text">{guide.overviewSupport}</p>}

        <BrowsePuppiesCard
          breedName={guide.breedName}
          image={guide.heroImageUrl}
          count={stats.count}
          avgPrice={stats.avgPrice}
        />

        <BreedGuideAtAGlance scorecard={guide.scorecard} />
      </PageContainer>

      <PageContainer className="max-w-3xl">
        {guide.whyPeopleLove && (
          <BreedGuideArticleSection summary="Why People Love the Breed" body={guide.whyPeopleLove} />
        )}

        <div id="appearance" className="scroll-mt-24">
          {guide.appearanceText && (
            <BreedGuideArticleSection
              summary="Appearance"
              body={guide.appearanceText}
              image={guide.appearanceImageUrl}
              credit={guide.appearanceCredit}
            />
          )}
          {guide.groomingText && (
            <BreedGuideArticleSection
              summary="Grooming"
              body={guide.groomingText}
              image={guide.groomingImageUrl}
              credit={guide.groomingCredit}
            />
          )}
        </div>

        <div id="temperament" className="scroll-mt-24">
          {guide.temperamentText && (
            <BreedGuideArticleSection summary="Breed Temperament and Characteristics" body={guide.temperamentText} />
          )}
          {guide.exerciseText && (
            <BreedGuideArticleSection
              summary="Exercise"
              body={guide.exerciseText}
              image={guide.exerciseImageUrl}
              credit={guide.exerciseCredit}
            />
          )}
          {guide.trainingText && <BreedGuideArticleSection summary="Training" body={guide.trainingText} />}
          {guide.dietText && <BreedGuideArticleSection summary="Diet and Nutrition" body={guide.dietText} />}
        </div>

        <div id="health" className="scroll-mt-24">
          {guide.healthIntroText && (
            <BreedGuideArticleSection summary="Health Issues" body={guide.healthIntroText} />
          )}
          {healthIssues.length > 0 && (
            <div className="py-6">
              {healthIssues.map((issue) => (
                <div key={issue.id} className="mb-4">
                  <h3 className="h3 mb-1">{issue.subheading}</h3>
                  <p className="body-text">{issue.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div id="history" className="scroll-mt-24">
          {guide.historyText && (
            <BreedGuideArticleSection
              summary="History"
              body={guide.historyText}
              image={guide.historyImageUrl}
              credit={guide.historyCredit}
            />
          )}
          {guide.historyImage2Url && (
            <div className="aspect-video rounded-lg overflow-hidden my-4">
              <OptimizedImage src={guide.historyImage2Url} alt={`${guide.breedName} history`} sizes="(max-width: 768px) 100vw, 700px" />
            </div>
          )}
        </div>
      </PageContainer>

      {guide.authorName && (
        <PageContainer className="max-w-2xl py-8">
          <div className="bg-cream-alt rounded-lg p-5 flex gap-4 items-start">
            {guide.authorPhotoUrl && (
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shrink-0">
                <OptimizedImage src={guide.authorPhotoUrl} alt={guide.authorName} sizes="64px" />
              </div>
            )}
            <div>
              <p className="text-forest font-medium">{guide.authorName}</p>
              {guide.authorBio && <p className="body-text mt-1">{guide.authorBio}</p>}
            </div>
          </div>
        </PageContainer>
      )}

      <PageContainer className="max-w-2xl py-8">
        <h2 className="h2 mb-4">Breed Scorecard</h2>
        <BreedGuideScorecard scorecard={guide.scorecard} />
      </PageContainer>

      {faqs.length > 0 && (
        <PageContainer className="max-w-2xl py-8 scroll-mt-24" >
          <h2 id="faqs" className="h2 mb-6">FAQs</h2>
          <FaqAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer ?? "" }))} />
        </PageContainer>
      )}

      <PageContainer className="pb-14">
        <BreedGuideRelated breeds={related} />
      </PageContainer>

      <Footer />
    </main>
  );
}