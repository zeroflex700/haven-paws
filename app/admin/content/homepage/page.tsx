import Link from "next/link";
import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import PageHeroUploader from "../../components/PageHeroUploader";
import PageHeroVideoUploader from "../../components/PageHeroVideoUploader";
import NamedImageUploader from "../../components/NamedImageUploader";

export default async function AdminHomepageContentPage() {
  const { heroImage, heroVideo, extraImages } =
    await getPageImagesAdmin("homepage");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>

      <h1 className="font-display text-2xl text-forest mb-2">
        Homepage
      </h1>

      <p className="text-sm text-sage mb-6">
        Manage repeatable sections separately: video stories at{" "}
        <Link
          href="/admin/video-stories"
          className="underline text-forest"
        >
          /admin/video-stories
        </Link>
        , location cards at{" "}
        <Link
          href="/admin/location-cards"
          className="underline text-forest"
        >
          /admin/location-cards
        </Link>
        , &quot;Keep Exploring&quot; cards at{" "}
        <Link
          href="/admin/exploring-cards"
          className="underline text-forest"
        >
          /admin/exploring-cards
        </Link>
        .
      </p>

      {/* HERO */}
      <p className="font-display text-lg text-forest mb-3">
        Hero Fallback Image
      </p>

      <PageHeroUploader
        slug="homepage"
        currentUrl={heroImage}
      />

      {/* HERO VIDEO */}
      <p className="font-display text-lg text-forest mb-3 mt-6">
        Hero Background Video
      </p>

      <PageHeroVideoUploader
        slug="homepage"
        currentUrl={heroVideo}
      />

      {/* CLOSING BANNER */}
      <p className="font-display text-lg text-forest mb-3 mt-6">
        Closing Banner Image
      </p>

      <NamedImageUploader
        slug="homepage"
        imageKey="closing_banner"
        label="Closing Banner Image"
        currentUrl={extraImages.closing_banner ?? null}
      />

      {/* VERIFICATION BADGES */}
      <div className="mt-10 pt-8 border-t border-sage/20">
        <p className="eyebrow mb-1">
          Homepage Trust Section
        </p>

        <h2 className="font-display text-xl text-forest mb-2">
          Verification Badges
        </h2>

        <p className="text-sm text-sage mb-6 max-w-xl">
          Upload up to four verification, certification, media,
          or trust badges. These images will appear on the homepage
          in the verification badge section.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <NamedImageUploader
            slug="homepage"
            imageKey="verification_badge_1"
            label="Verification Badge 1"
            currentUrl={extraImages.verification_badge_1 ?? null}
          />

          <NamedImageUploader
            slug="homepage"
            imageKey="verification_badge_2"
            label="Verification Badge 2"
            currentUrl={extraImages.verification_badge_2 ?? null}
          />

          <NamedImageUploader
            slug="homepage"
            imageKey="verification_badge_3"
            label="Verification Badge 3"
            currentUrl={extraImages.verification_badge_3 ?? null}
          />

          <NamedImageUploader
            slug="homepage"
            imageKey="verification_badge_4"
            label="Verification Badge 4"
            currentUrl={extraImages.verification_badge_4 ?? null}
          />
        </div>
      </div>
    </main>
  );
}