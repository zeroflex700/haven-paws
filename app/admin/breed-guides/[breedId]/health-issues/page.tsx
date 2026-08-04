import { createClient } from "@/lib/supabase/server";
import { addHealthIssue, deleteHealthIssue } from "../../health-issues-actions";
import DeleteGenericButton from "../../../components/DeleteGenericButton";
import { notFound } from "next/navigation";

export default async function HealthIssuesPage({
  params,
}: {
  params: Promise<{ breedId: string }>;
}) {
  const { breedId } = await params;
  const supabase = await createClient();

  const { data: breed } = await supabase.from("breeds").select("name, slug").eq("id", breedId).single();
  const { data: guide } = await supabase.from("breed_guides").select("id").eq("breed_id", breedId).single();

  if (!breed || !guide) notFound();

  const { data: issues } = await supabase
    .from("breed_guide_health_issues")
    .select("id, subheading, body")
    .eq("breed_guide_id", guide.id)
    .order("sort_order");

  const addWithIds = addHealthIssue.bind(null, guide.id, breed.slug);
  const deleteWithSlug = async (id: string) => {
    "use server";
    await deleteHealthIssue(id, breed.slug);
  };

  async function handleAdd(formData: FormData) {
    "use server";
    await addWithIds(formData.get("subheading") as string, formData.get("body") as string);
  }

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">{breed.name} — Health Issues</h1>

      <form action={handleAdd} className="bg-white border border-sage/20 rounded-lg p-4 mb-6">
        <label className="block text-sm text-ink/80 mb-1">Subheading</label>
        <input name="subheading" required className="w-full border border-sage/30 rounded-md px-3 py-2 mb-3" />
        <label className="block text-sm text-ink/80 mb-1">Description</label>
        <textarea name="body" rows={3} className="w-full border border-sage/30 rounded-md px-3 py-2 mb-4" />
        <button type="submit" className="w-full bg-forest text-cream py-2.5 rounded-full hover:bg-forest-light">
          Add Health Issue
        </button>
      </form>

      {(issues ?? []).map((issue) => (
        <div key={issue.id} className="flex justify-between items-start bg-white border border-sage/20 rounded-lg p-4 mb-3">
          <div>
            <p className="text-forest font-medium">{issue.subheading}</p>
            <p className="text-sm text-ink/70">{issue.body}</p>
          </div>
          <DeleteGenericButton id={issue.id} onDelete={deleteWithSlug} />
        </div>
      ))}
    </main>
  );
}