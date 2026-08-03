import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import PageHeroUploader from "../../components/PageHeroUploader";
import PageHeroVideoUploader from "../../components/PageHeroVideoUploader";
import NamedImageUploader from "../../components/NamedImageUploader";

export default async function AdminHomepageContentPage() {
  const { heroImage, heroVideo, extraImages } = await getPageImagesAdmin("homepage");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-2">Homepage</h1>
      <p className="text-sm text-sage mb-6">
        Manage repeatable sections separately: video stories at{" "}
        <a href="/admin/video-stories" className="underline text-forest">/admin/video-stories</a>,
        location cards at{" "}
        <a href="/admin/location-cards" className="underline text-forest">/admin/location-cards</a>,
        &quot;Keep Exploring&quot; cards at{" "}
        <a href="/admin/exploring-cards" className="underline text-forest">/admin/exploring-cards</a>.
      </p>

      <p className="font-display text-lg text-forest mb-3">Hero Fallback Image</p>
      <PageHeroUploader slug="homepage" currentUrl={heroImage} />

      <p className="font-display text-lg text-forest mb-3 mt-6">Hero Background Video</p>
      <PageHeroVideoUploader slug="homepage" currentUrl={heroVideo} />

      <p className="font-display text-lg text-forest mb-3 mt-6">Closing Banner Image</p>
      <NamedImageUploader
        slug="homepage"
        imageKey="closing_banner"
        label="Closing Banner Image"
        currentUrl={extraImages.closing_banner ?? null}
      />
    </main>
  );
}