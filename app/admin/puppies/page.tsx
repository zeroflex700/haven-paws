import Link from "next/link";
import { getAllPuppiesAdmin } from "@/lib/queries/adminPuppies";
import PuppyListView from "../components/PuppyListView";

export default async function AdminPuppiesPage() {
  const puppies = await getAllPuppiesAdmin();

  return (
    <main className="px-5 pt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="eyebrow mb-1">Haven Paws Admin</p>
          <h1 className="font-display text-2xl text-forest">Manage Puppies</h1>
        </div>
        <Link
          href="/admin/puppies/new"
          className="bg-forest text-cream text-sm px-4 py-2 rounded-full hover:bg-forest-light"
        >
          + Add
        </Link>
      </div>
      <PuppyListView puppies={puppies} />
    </main>
  );
}