import { createClient } from "@/lib/supabase/server";
import BreederFullForm from "../../components/BreederFullForm";

export default async function NewBreederPage() {
  const supabase = await createClient();
  const { data: breeds } = await supabase.from("breeds").select("id, name").order("name");

  return (
    <main className="px-5 pt-6">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-xl text-forest mb-6">Add Breeder</h1>
      <BreederFullForm breeds={breeds ?? []} />
    </main>
  );
}