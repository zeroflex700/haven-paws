import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBreeds } from "@/lib/queries/breeds";
import { getLitterAutofillMap } from "@/lib/queries/adminLitters";
import PuppyForm from "../../components/PuppyForm";
import { updatePuppy } from "../actions";
import { notFound } from "next/navigation";

export default async function EditPuppyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const breeds = await getBreeds();

  const { data: breeders } = await supabase
    .from("breeders")
    .select("id, name, breed_id")
    .order("name");

  const { data: puppy } = await supabase
    .from("puppies")
    .select("*")
    .eq("id", id)
    .single();

  if (!puppy) notFound();

  const litterAutofillMap = await getLitterAutofillMap();

  const updatePuppyWithId = updatePuppy.bind(null, id);

  return (
    <main className="px-5 pt-6">
      <p className="eyebrow mb-1">Haven Paws Admin</p>

      <h1 className="font-display text-2xl text-forest mb-1">
        Edit {puppy.name}
      </h1>

      <div className="flex gap-4 mb-6">
        <Link
          href={`/admin/puppies/${id}/media`}
          className="text-sm text-forest border-b border-gold pb-0.5"
        >
          Manage Photos & Videos →
        </Link>

        <Link
          href={`/admin/puppies/${id}/parents`}
          className="text-sm text-forest border-b border-gold pb-0.5"
        >
          Manage Parents →
        </Link>
      </div>

      <PuppyForm
        breeds={breeds}
        breeders={breeders ?? []}
        puppy={puppy}
        litterAutofillMap={litterAutofillMap}
        action={updatePuppyWithId}
      />
    </main>
  );
}