import Link from "next/link";
import { getBreedGuideAdmin } from "@/lib/queries/breedGuides";
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

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-1">{guide.breedName} Guide</h1>
      {guide.id && (
        <div className="flex gap-4 mb-6">
          <Link
            href={`/admin/breed-guides/${breedId}/health-issues`}
            className="text-sm text-forest border-b border-gold pb-0.5"
          >
            Manage Health Issues →
          </Link>
          <Link
            href={`/admin/breed-guides/${breedId}/faqs`}
            className="text-sm text-forest border-b border-gold pb-0.5"
          >
            Manage FAQs →
          </Link>
        </div>
      )}
      {!guide.id && (
        <p className="text-sm text-sage mb-6">
          Save this guide first, then manage health issues and FAQs.
        </p>
      )}

      <BreedGuideForm
        breedId={breedId}
        breedSlug={guide.breedSlug}
        guide={guide}
        allBreeds={allBreeds ?? []}
      />
    </main>
  );
}