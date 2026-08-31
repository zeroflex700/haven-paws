import { getBreeds } from "@/lib/queries/breeds";
import { createClient } from "@/lib/supabase/server";
import PuppyForm from "../../components/PuppyForm";
import { createPuppy } from "../actions";



export default async function NewPuppyPage() {
const breeds = await getBreeds();

const supabase = await createClient();

const { data: breeders } = await supabase
.from("breeders")
.select("id, name, breed_id")
.order("name");

const { data: litterRows } = await supabase
.from("puppies")
.select("litter_id")
.not("litter_id", "is", null);

const litterIds = Array.from(
new Set(
(litterRows ?? [])
.map((row) => row.litter_id as string)
.filter(Boolean)
)
).sort();

return (
<main className="px-5 pt-6">
<p className="eyebrow mb-1">Haven Paws Admin</p>

<h1 className="font-display text-2xl text-forest mb-6">  
    Add a Puppy  
  </h1>  

  <PuppyForm  
    breeds={breeds}  
    breeders={breeders ?? []}  
    litterIds={litterIds}  
    action={createPuppy}  
  />  
</main>

);
}