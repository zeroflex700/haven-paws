import Link from "next/link";
import { getAllReservationsAdmin } from "@/lib/queries/adminReservations";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-cream-alt text-ink",
  processing: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-cream-alt text-ink/50",
  failed: "bg-red-50 text-red-700",
};

export default async function AdminReservationsPage() {
  const reservations = await getAllReservationsAdmin();

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-6">Reservations</h1>

      {reservations.length === 0 ? (
        <p className="text-sage">No reservations yet.</p>
      ) : (
        <div className="space-y-2">
          {reservations.map((r) => (
            <Link
              key={r.id}
              href={`/admin/reservations/${r.id}`}
              className="flex items-center justify-between bg-white border border-sage/20 rounded-lg px-4 py-3"
            >
              <div>
                <p className="text-forest font-medium">{r.puppyName ?? "Unknown puppy"}</p>
                <p className="text-xs text-sage">
                  {r.customerName} · ${r.amount.toLocaleString()} · {r.paymentType}
                </p>
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                  STATUS_STYLES[r.status] ?? "bg-cream-alt text-ink"
                }`}
              >
                {r.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}