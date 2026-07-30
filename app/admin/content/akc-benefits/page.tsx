import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import PageHeroUploader from "../../components/PageHeroUploader";

export default async function AdminAkcBenefitsContentPage() {
  const { heroImage } = await getPageImagesAdmin("akc-benefits");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">AKC Benefits Page</h1>
      <p className="text-sm text-sage mb-4">
        Upload the hero image for this page. The written content is already in place.
      </p>
      <PageHeroUploader slug="akc-benefits" currentUrl={heroImage} />
    </main>
  );
}