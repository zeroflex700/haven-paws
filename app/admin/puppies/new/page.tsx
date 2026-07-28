import { getBreeds } from "@/lib/queries/breeds";
import PuppyForm from "../../components/PuppyForm";
import { createPuppy } from "../actions";

export default async function NewPuppyPage() {
  const breeds = await getBreeds();

  return (
    <main className="px-5 pt-6">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Add a Puppy</h1>
      <PuppyForm breeds={breeds} action={createPuppy} />
    </main>
  );
}