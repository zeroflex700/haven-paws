import { getPageImagesAdmin } from "@/lib/queries/pageContent";
import NamedImageUploader from "../../components/NamedImageUploader";
import { LIFESTYLE_CATEGORIES } from "@/app/data/lifestyleCategories";

export default async function AdminLifestyleContentPage() {
  const { extraImages } = await getPageImagesAdmin("lifestyle");

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-2">Explore by Lifestyle Page</h1>
      <p className="text-sm text-sage mb-6">
        Upload one hero image per category. Breed photos come from{" "}
        <a href="/admin/breeds" className="underline text-forest">/admin/breeds</a>.
      </p>

      {LIFESTYLE_CATEGORIES.map((c) => (
        <NamedImageUploader
          key={c.key}
          slug="lifestyle"
          imageKey={`hero_${c.key}`}
          label={c.title}
          currentUrl={extraImages[`hero_${c.key}`] ?? null}
        />
      ))}
    </main>
  );
}