import { getExploringCardsAdmin } from "@/lib/queries/homepageCollections";
import ExploringCardForm from "../components/ExploringCardForm";
import DeleteGenericButton from "../components/DeleteGenericButton";
import { deleteExploringCard } from "./actions";

export default async function AdminExploringCardsPage() {
  const cards = await getExploringCardsAdmin();

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">
        Homepage — &quot;Keep Exploring&quot; Grid
      </h1>

      <ExploringCardForm />

      {cards.map((c) => (
        <div key={c.id} className="flex justify-between items-center bg-white border border-sage/20 rounded-lg p-4 mb-3">
          <p className="text-forest font-medium">{c.caption}</p>
          <DeleteGenericButton id={c.id} onDelete={deleteExploringCard} />
        </div>
      ))}
    </main>
  );
}