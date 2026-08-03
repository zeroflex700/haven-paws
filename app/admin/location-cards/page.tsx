import { getLocationCardsAdmin } from "@/lib/queries/homepageCollections";
import LocationCardForm from "../components/LocationCardForm";
import DeleteGenericButton from "../components/DeleteGenericButton";
import { deleteLocationCard } from "./actions";

export default async function AdminLocationCardsPage() {
  const cards = await getLocationCardsAdmin();

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">
        Homepage — Location Cards
      </h1>

      <LocationCardForm />

      {cards.map((c) => (
        <div key={c.id} className="flex justify-between items-center bg-white border border-sage/20 rounded-lg p-4 mb-3">
          <p className="text-forest font-medium">{c.cityName}</p>
          <DeleteGenericButton id={c.id} onDelete={deleteLocationCard} />
        </div>
      ))}
    </main>
  );
}