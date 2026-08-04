import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BreedGuideTabs from "../../components/BreedGuideTabs";
import BreedGuideArticleSection from "../../components/BreedGuideArticleSection";
import BreedGuideScorecard from "../../components/BreedGuideScorecard";
import BreedGuideAtAGlance from "../../components/BreedGuideAtAGlance";
import BrowsePuppiesCard from "../../components/BrowsePuppiesCard";
import BreedGuideRelated from "../../components/BreedGuideRelated";
import FaqAccordion from "../../components/FaqAccordion";
import { ProtectedImage } from "../../components/ProtectedMedia";
import { cldOptimized } from "@/lib/cloudinary";
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

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-6">
        <p className="eyebrow mb-2">Get to Know</p>
        <h1 className="font-display text-4xl text-forest mb-4">{guide.breedName}s</h1>

        {guide.authorName && (
          <div className="flex items-center gap-3 mb-6">
            {guide.authorPhotoUrl && (
              <div className="w-9 h-9 rounded-full overflow-hidden bg-cream-alt shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cldOptimized(guide.authorPhotoUrl, 100)}
                  alt={guide.authorName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-sm text-ink/70">
              Written by {guide.authorName}
              {guide.authorCredential ? ` · ${guide.authorCredential}` : ""}
            </p>
          </div>
        )}

        {guide.heroImageUrl && (
          <div className="aspect-video rounded-lg overflow-hidden mb-2">
            <ProtectedImage src={guide.heroImageUrl} alt={guide.breedName} />
          </div>
        )}
        {guide.photoCredit && <p className="text-xs text-sage">{guide.photoCredit}</p>}
      </section>

      <BreedGuideTabs />

      <section id="overview" className="max-w-2xl mx-auto px-6 py-10 text-center scroll-mt-24">
        {guide.overviewQuote && (
          <p className="font-display text-2xl text-forest leading-snug mb-3">
            {guide.overviewQuote}
          </p>
        )}
        {guide.overviewSupport && <p className="text-ink/70">{guide.overviewSupport}</p>}

        <BrowsePuppiesCard
          breedName={guide.breedName}
          image={guide.heroImageUrl}
          count={stats.count}
          avgPrice={stats.avgPrice}
        />

        <BreedGuideAtAGlance scorecard={guide.scorecard} />
      </section>

      <section className="max-w-3xl mx-auto px-6">
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
          {guide.trainingText && (
            <BreedGuideArticleSection summary="Training" body={guide.trainingText} />
          )}
          {guide.dietText && (
            <BreedGuideArticleSection summary="Diet and Nutrition" body={guide.dietText} />
          )}
        </div>

        <div id="health" className="scroll-mt-24">
          {guide.healthIntroText && (
            <BreedGuideArticleSection summary="Health Issues" body={guide.healthIntroText} />
          )}
          {healthIssues.length > 0 && (
            <div className="py-6">
              {healthIssues.map((issue) => (
                <div key={issue.id} className="mb-4">
                  <h3 className="text-forest font-medium mb-1">{issue.subheading}</h3>
                  <p className="text-sm text-ink/80 leading-relaxed">{issue.body}</p>
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
              <ProtectedImage src={guide.historyImage2Url} alt={`${guide.breedName} history`} />
            </div>
          )}
        </div>
      </section>

      {guide.authorName && (
        <section className="max-w-2xl mx-auto px-6 py-10">
          <div className="bg-cream-alt rounded-lg p-6 flex gap-4 items-start">
            {guide.authorPhotoUrl && (
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cldOptimized(guide.authorPhotoUrl, 150)}
                  alt={guide.authorName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-forest font-medium">{guide.authorName}</p>
              {guide.authorBio && <p className="text-sm text-ink/70 mt-1">{guide.authorBio}</p>}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl text-forest mb-4">Breed Scorecard</h2>
        <BreedGuideScorecard scorecard={guide.scorecard} />
      </section>

      {faqs.length > 0 && (
        <section id="faqs" className="max-w-2xl mx-auto px-6 py-10 scroll-mt-24">
          <h2 className="font-display text-2xl text-forest mb-6">FAQs</h2>
          <FaqAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer ?? "" }))} />
        </section>
      )}

      <section className="max-w-5xl mx-auto px-6 pb-14">
        <BreedGuideRelated breeds={related} />
      </section>

      <Footer />
    </main>
  );
}