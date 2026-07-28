import { getAllPuppiesAdmin } from "@/lib/queries/adminPuppies";
import PuppyListView from "../components/PuppyListView";

export default async function AdminPuppiesPage() {
  const puppies = await getAllPuppiesAdmin();

  return (
    <main className="px-5 pt-6">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Manage Puppies</h1>
      <PuppyListView puppies={puppies} />
    </main>
  );
}