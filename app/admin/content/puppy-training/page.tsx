import Link from "next/link";
import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import PageHeroUploader from "../../components/PageHeroUploader";
import NamedImageUploader from "../../components/NamedImageUploader";
import TextFieldEditor from "../../components/TextFieldEditor";

export default async function AdminPuppyTrainingContentPage() {
  const { heroImage, extraImages, extraText } = await getPageImagesAdmin("puppy-training");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-2">Puppy Training Program</h1>
      <p className="text-sm text-sage mb-6">
        The testimonial shown in the locked popup is managed at{" "}
        <Link href="/admin/reviews/new" className="underline text-forest">/admin/reviews</Link>{" "}
        — add one with category &quot;Puppy Training Program.&quot;
      </p>

      <p className="font-display text-lg text-forest mb-3">Landing Hero Image</p>
      <PageHeroUploader slug="puppy-training" currentUrl={heroImage} />

      <p className="font-display text-lg text-forest mb-3 mt-6">Success Illustration</p>
      <NamedImageUploader
        slug="puppy-training"
        imageKey="success_illustration"
        label="Success Illustration"
        currentUrl={extraImages.success_illustration ?? null}
      />

      <p className="font-display text-lg text-forest mb-3 mt-6">Popular Courses Images</p>
      <NamedImageUploader
        slug="puppy-training"
        imageKey="course_house_training"
        label="House Training"
        currentUrl={extraImages.course_house_training ?? null}
      />
      <NamedImageUploader
        slug="puppy-training"
        imageKey="course_manners"
        label="Manners"
        currentUrl={extraImages.course_manners ?? null}
      />
      <NamedImageUploader
        slug="puppy-training"
        imageKey="course_socialization"
        label="Socialization"
        currentUrl={extraImages.course_socialization ?? null}
      />

      <p className="font-display text-lg text-forest mb-3 mt-6">Text</p>
      <TextFieldEditor
        slug="puppy-training"
        textKey="popup_intro"
        label="Locked popup intro paragraph"
        currentValue={extraText.popup_intro ?? ""}
        multiline
      />
      <TextFieldEditor
        slug="puppy-training"
        textKey="landing_description"
        label="Landing page description paragraph"
        currentValue={extraText.landing_description ?? ""}
        multiline
      />
      <TextFieldEditor
        slug="puppy-training"
        textKey="success_description"
        label="&quot;Set your dog up for success&quot; paragraph"
        currentValue={extraText.success_description ?? ""}
        multiline
      />
      <TextFieldEditor
        slug="puppy-training"
        textKey="protection_pricing"
        label="Protection & Support pricing tiers (one per line)"
        currentValue={extraText.protection_pricing ?? ""}
        multiline
      />
    </main>
  );
}