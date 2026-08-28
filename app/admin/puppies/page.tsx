import Link from "next/link";
import { getAllPuppiesAdmin } from "@/lib/queries/adminPuppies";
import PuppyListView from "../components/PuppyListView";
import PuppyUrlImporter from "../components/PuppyUrlImporter";

export default async function AdminPuppiesPage() {
  const puppies = await getAllPuppiesAdmin();

  return (
    <main className="px-5 pt-6 pb-10">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="eyebrow mb-1">
            Haven Paws Admin
          </p>

          <h1 className="font-display text-2xl text-forest">
            Manage Puppies
          </h1>
        </div>

        <Link
          href="/admin/puppies/new"
          className="bg-forest text-cream text-sm px-4 py-2 rounded-full hover:bg-forest-light"
        >
          + Add
        </Link>
      </div>

      <Link
        href="/admin/breeds"
        className="text-sm text-forest border-b border-gold pb-0.5 mb-6 inline-block"
      >
        Manage Breed Info →
      </Link>

      <PuppyUrlImporter />

      <PuppyListView puppies={puppies} />
    </main>
  );
}