import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import PageHeroUploader from "../../components/PageHeroUploader";
import NamedImageUploader from "../../components/NamedImageUploader";
import NamedVideoUploader from "../../components/NamedVideoUploader";

export default async function AdminDeliveryProgramsContentPage() {
  const { heroImage, extraImages, extraVideos } = await getPageImagesAdmin("delivery-programs");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-2">Delivery Programs Page</h1>
      <p className="text-sm text-sage mb-6">
        Set pricing at{" "}
        <a href="/admin/settings" className="underline text-forest">/admin/settings</a>{" "}
        under &quot;Delivery Programs Pricing.&quot;
      </p>

      <p className="font-display text-lg text-forest mb-3">Hero Image</p>
      <PageHeroUploader slug="delivery-programs" currentUrl={heroImage} />

      <p className="font-display text-lg text-forest mb-3 mt-6">Delivery Tier Images</p>
      <NamedImageUploader
        slug="delivery-programs"
        imageKey="tier_home"
        label="Home Delivery"
        currentUrl={extraImages.tier_home ?? null}
      />
      <NamedImageUploader
        slug="delivery-programs"
        imageKey="tier_meet"
        label="Meet Near Your Location"
        currentUrl={extraImages.tier_meet ?? null}
      />
      <NamedImageUploader
        slug="delivery-programs"
        imageKey="tier_express"
        label="Priority Express Delivery"
        currentUrl={extraImages.tier_express ?? null}
      />
      <NamedImageUploader
        slug="delivery-programs"
        imageKey="tier_pickup"
        label="Pickup Near the Breeder"
        currentUrl={extraImages.tier_pickup ?? null}
      />

      <p className="font-display text-lg text-forest mb-3 mt-6">Closing Section</p>
      <NamedVideoUploader
        slug="delivery-programs"
        videoKey="closing_video"
        label="Families Welcoming Puppies Home Video"
        currentUrl={extraVideos.closing_video ?? null}
      />
    </main>
  );
}