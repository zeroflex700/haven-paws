import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import PageHeroUploader from "../../components/PageHeroUploader";
import TextFieldEditor from "../../components/TextFieldEditor";

export default async function AdminHelpCenterContentPage() {
  const { heroImage, extraText } = await getPageImagesAdmin("help-center");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Help Center Page</h1>

      <p className="font-display text-lg text-forest mb-3">Hero Image</p>
      <PageHeroUploader slug="help-center" currentUrl={heroImage} />

      <p className="font-display text-lg text-forest mb-3 mt-6">Text</p>
      <TextFieldEditor
        slug="help-center"
        textKey="intro"
        label="Intro paragraph (optional)"
        currentValue={extraText.intro ?? ""}
        multiline
      />
    </main>
  );
}