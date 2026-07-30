import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import PageHeroUploader from "../../components/PageHeroUploader";
import NamedImageUploader from "../../components/NamedImageUploader";

export default async function AdminFetchInsuranceContentPage() {
  const { heroImage, extraImages } = await getPageImagesAdmin("fetch-insurance");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Fetch Insurance Page</h1>

      <p className="text-sm text-ink/80 mb-2 font-medium">Hero Image (vet with puppy)</p>
      <PageHeroUploader slug="fetch-insurance" currentUrl={heroImage} />

      <NamedImageUploader
        slug="fetch-insurance"
        imageKey="author_photo"
        label="Author Photo"
        currentUrl={extraImages.author_photo ?? null}
      />

      <NamedImageUploader
        slug="fetch-insurance"
        imageKey="partner_logo"
        label="Fetch Logo"
        currentUrl={extraImages.partner_logo ?? null}
      />
    </main>
  );
}