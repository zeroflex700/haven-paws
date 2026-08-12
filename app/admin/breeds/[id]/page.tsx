import { getBreedInfoAdmin } from "@/lib/queries/breedInfo";
import { updateBreedInfo, updateBreedNameAndSlug } from "../actions";
import BreedImageUploader from "../../components/BreedImageUploader";
import { notFound } from "next/navigation";

export default async function EditBreedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const breed = await getBreedInfoAdmin(id);

  if (!breed) notFound();

  const updateWithId = updateBreedInfo.bind(null, id);
  const updateNameSlugWithId = updateBreedNameAndSlug.bind(null, id, breed.slug ?? null);
  const inputClass =
    "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">{breed.name}</h1>

      <div className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
        <h2 className="text-sm font-medium text-forest mb-3">Name &amp; Breed Guide URL</h2>
        <form action={updateNameSlugWithId}>
          <label className="block text-sm text-ink/80 mb-1">Breed Name</label>
          <input
            name="name"
            defaultValue={breed.name}
            required
            className={`${inputClass} mb-4`}
          />

          <label className="block text-sm text-ink/80 mb-1">
            Breed Guide URL Slug (optional — auto-generated from name if left blank)
          </label>
          <input
            name="slug"
            defaultValue={breed.slug ?? ""}
            placeholder="e.g. golden-retriever"
            className={`${inputClass} mb-1`}
          />
          {breed.slug && (
            <p className="text-xs text-sage mb-4">
              Current: /breed-guides/{breed.slug}
            </p>
          )}

          <button
            type="submit"
            className="w-full border border-forest/30 text-forest py-2 rounded-full text-sm hover:border-forest"
          >
            Save Name &amp; Slug
          </button>
        </form>
      </div>

      <BreedImageUploader breedId={id} currentUrl={breed.imageUrl} />

      <form action={updateWithId}>
        <label className="block text-sm text-ink/80 mb-1">Temperament</label>
        <input
          name="temperament"
          defaultValue={breed.temperament ?? ""}
          placeholder="e.g. Curious, Friendly, Brave"
          className={`${inputClass} mb-4`}
        />

        <label className="block text-sm text-ink/80 mb-1">Energy Level</label>
        <input
          name="energy_level"
          defaultValue={breed.energyLevel ?? ""}
          placeholder="e.g. Moderate"
          className={`${inputClass} mb-4`}
        />

        <label className="block text-sm text-ink/80 mb-1">Breed Group</label>
        <input
          name="breed_group"
          defaultValue={breed.breedGroup ?? ""}
          placeholder="e.g. Hound"
          className={`${inputClass} mb-4`}
        />

        <label className="block text-sm text-ink/80 mb-1">Description</label>
        <textarea
          name="blurb"
          defaultValue={breed.blurb ?? ""}
          rows={4}
          placeholder="A short, engaging description of this breed"
          className={`${inputClass} mb-6`}
        />

        <button
          type="submit"
          className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light"
        >
          Save
        </button>
      </form>
    </main>
  );
}