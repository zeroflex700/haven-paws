import { createClient } from "@/lib/supabase/server";
import { getBreeds } from "@/lib/queries/breeds";
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

  const { data: puppy } = await supabase
    .from("puppies")
    .select("*")
    .eq("id", id)
    .single();

  if (!puppy) notFound();

  const updatePuppyWithId = updatePuppy.bind(null, id);

  return (
    <main className="px-5 pt-6">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Edit {puppy.name}</h1>
      <PuppyForm breeds={breeds} puppy={puppy} action={updatePuppyWithId} />
    </main>
  );
}