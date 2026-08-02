import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import PageHeroVideoUploader from "../../components/PageHeroVideoUploader";
import NamedImageUploader from "../../components/NamedImageUploader";

export default async function AdminDeliveryProgramsContentPage() {
  const { heroVideo, extraImages } = await getPageImagesAdmin("delivery-programs");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-2">Delivery Programs Page</h1>
      <p className="text-sm text-sage mb-6">
        Upload one image per delivery tier, plus a closing video shown at the
        bottom of the page.
      </p>

      <p className="font-display text-lg text-forest mb-3">Tier Images</p>
      <NamedImageUploader
        slug="delivery-programs"
        imageKey="tier-home-delivery"
        label="Home Delivery"
        currentUrl={extraImages["tier-home-delivery"] ?? null}
      />
      <NamedImageUploader
        slug="delivery-programs"
        imageKey="tier-meet-location"
        label="Meet Near Your Location"
        currentUrl={extraImages["tier-meet-location"] ?? null}
      />
      <NamedImageUploader
        slug="delivery-programs"
        imageKey="tier-priority-express"
        label="Priority Express Delivery"
        currentUrl={extraImages["tier-priority-express"] ?? null}
      />
      <NamedImageUploader
        slug="delivery-programs"
        imageKey="tier-pickup-breeder"
        label="Pickup Near the Breeder"
        currentUrl={extraImages["tier-pickup-breeder"] ?? null}
      />

      <p className="font-display text-lg text-forest mb-3 mt-6">Closing Video</p>
      <PageHeroVideoUploader slug="delivery-programs" currentUrl={heroVideo} />
    </main>
  );
}