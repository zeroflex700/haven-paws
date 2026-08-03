import { getVideoStoriesAdmin } from "@/lib/queries/homepageCollections";
import VideoStoryForm from "../components/VideoStoryForm";
import DeleteGenericButton from "../components/DeleteGenericButton";
import { deleteVideoStory } from "./actions";

export default async function AdminVideoStoriesPage() {
  const stories = await getVideoStoriesAdmin();

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">
        Homepage — &quot;See How Your Puppy Is Raised&quot; Videos
      </h1>

      <VideoStoryForm />

      {stories.map((s) => (
        <div key={s.id} className="flex justify-between items-center bg-white border border-sage/20 rounded-lg p-4 mb-3">
          <div>
            <p className="text-forest font-medium">{s.personName}</p>
            <p className="text-xs text-sage">{s.description}</p>
          </div>
          <DeleteGenericButton id={s.id} onDelete={deleteVideoStory} />
        </div>
      ))}
    </main>
  );
}