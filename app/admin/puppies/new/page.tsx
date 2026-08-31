import { getBreeds } from "@/lib/queries/breeds";
import { createClient } from "@/lib/supabase/server";
import { getLitterAutofillMap } from "@/lib/queries/adminLitters";
import PuppyForm from "../../components/PuppyForm";
import { createPuppy } from "../actions";

export default async function NewPuppyPage() {
  const breeds = await getBreeds();

  const supabase = await createClient();

  const { data: breeders } = await supabase
    .from("breeders")
    .select("id, name, breed_id")
    .order("name");

  const litterAutofillMap = await getLitterAutofillMap();

  return (
    <main className="px-5 pt-6">
      <p className="eyebrow mb-1">Haven Paws Admin</p>

      <h1 className="font-display text-2xl text-forest mb-6">
        Add a Puppy
      </h1>

      <PuppyForm
        breeds={breeds}
        breeders={breeders ?? []}
        litterAutofillMap={litterAutofillMap}
        action={createPuppy}
      />
    </main>
  );
}