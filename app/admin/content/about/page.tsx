import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import PageHeroUploader from "../../components/PageHeroUploader";
import PageHeroVideoUploader from "../../components/PageHeroVideoUploader";
import NamedImageUploader from "../../components/NamedImageUploader";
import { ALL_PEOPLE } from "@/app/data/teamMembers";

export default async function AdminAboutContentPage() {
  const { heroImage, heroVideo, extraImages } = await getPageImagesAdmin("about");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">About Us Page</h1>

      <p className="font-display text-lg text-forest mb-3">Hero Image (Our Story)</p>
      <PageHeroUploader slug="about" currentUrl={heroImage} />

      <p className="font-display text-lg text-forest mb-3 mt-6">
        &quot;Years in Business&quot; Image
      </p>
      <NamedImageUploader
        slug="about"
        imageKey="years_in_business"
        label="Years in Business Photo"
        currentUrl={extraImages.years_in_business ?? null}
      />

      <p className="font-display text-lg text-forest mb-3 mt-6">
        Real Life-Changing Experiences Video
      </p>
      <PageHeroVideoUploader slug="about" currentUrl={heroVideo} />

      <p className="font-display text-lg text-forest mb-3 mt-6">Team Photos</p>
      <p className="text-sm text-sage mb-4">
        Upload a photo for each team member below.
      </p>
      {ALL_PEOPLE.map((p) => (
        <NamedImageUploader
          key={p.slug}
          slug="about"
          imageKey={`person_${p.slug}`}
          label={p.name}
          currentUrl={extraImages[`person_${p.slug}`] ?? null}
        />
      ))}
    </main>
  );
}