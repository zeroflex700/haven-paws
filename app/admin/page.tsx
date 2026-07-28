import { getAllPuppiesAdmin } from "@/lib/queries/adminPuppies";
import PuppyListView from "./components/PuppyListView";
import SignOutButton from "./components/SignOutButton";

export default async function AdminDashboardPage() {
  const puppies = await getAllPuppiesAdmin();

  return (
    <main className="px-5 pt-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="eyebrow mb-1">Haven Paws Admin</p>
          <h1 className="font-display text-2xl text-forest">All Puppies</h1>
        </div>
        <SignOutButton />
      </div>
      <PuppyListView puppies={puppies} />
    </main>
  );
}