import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import NamedImageUploader from "../../components/NamedImageUploader";

export default async function AdminAccountMenuContentPage() {
  const { extraImages } = await getPageImagesAdmin("account-menu");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Profile Menu Thumbnails</h1>

      <NamedImageUploader
        slug="account-menu"
        imageKey="how_it_works"
        label="How It Works"
        currentUrl={extraImages.how_it_works ?? null}
      />
      <NamedImageUploader
        slug="account-menu"
        imageKey="learning_center"
        label="Visit the Learning Center"
        currentUrl={extraImages.learning_center ?? null}
      />
      <NamedImageUploader
        slug="account-menu"
        imageKey="our_standards"
        label="Learn About Our Standards"
        currentUrl={extraImages.our_standards ?? null}
      />
    </main>
  );
}