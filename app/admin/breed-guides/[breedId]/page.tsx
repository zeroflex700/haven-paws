import { getBreedGuideAdmin, getGuideFaqs, getHealthIssues } from "@/lib/queries/breedGuides";
import { createClient } from "@/lib/supabase/server";
import BreedGuideForm from "../../components/BreedGuideForm";
import { notFound } from "next/navigation";

export default async function EditBreedGuidePage({
  params,
}: {
  params: Promise<{ breedId: string }>;
}) {
  const { breedId } = await params;
  const guide = await getBreedGuideAdmin(breedId);
  if (!guide) notFound();

  const supabase = await createClient();
  const { data: allBreeds } = await supabase.from("breeds").select("id, name").order("name");

  const [initialFaqs, initialHealthIssues] = guide.id
    ? await Promise.all([getGuideFaqs(guide.id), getHealthIssues(guide.id)])
    : [[], []];

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">{guide.breedName} Guide</h1>

      <BreedGuideForm
        breedId={breedId}
        breedSlug={guide.breedSlug}
        guide={guide}
        allBreeds={allBreeds ?? []}
        initialFaqs={initialFaqs}
        initialHealthIssues={initialHealthIssues}
      />
    </main>
  );
}