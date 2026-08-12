import { getReservationAdmin } from "@/lib/queries/adminReservations";
import { updateReservation } from "../actions";
import { notFound } from "next/navigation";

export default async function AdminReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = await getReservationAdmin(id);
  if (!reservation) notFound();

  const updateWithId = updateReservation.bind(null, id);
  const inputClass = "w-full border border-sage/30 rounded-md px-3 py-2 focus:outline-none focus:border-gold";
  const labelClass = "block text-sm text-ink/80 mb-1 mt-4";

  return (
    <main className="px-5 pt-6 pb-10">
      <p className="eyebrow mb-1">Haven Paws Admin</p>
      <h1 className="font-display text-2xl text-forest mb-1">
        {reservation.puppyName ?? "Reservation"}
      </h1>
      <p className="text-sm text-sage mb-6">
        {reservation.customerName} — {reservation.customerEmail} — {reservation.customerPhone}
      </p>

      <div className="bg-white border border-sage/20 rounded-lg p-4 mb-6 text-sm space-y-1.5">
        <div className="flex justify-between">
          <span className="text-ink/70">Total amount</span>
          <span className="text-ink">${reservation.amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink/70">Payment type</span>
          <span className="text-ink capitalize">{reservation.paymentType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink/70">Delivery method</span>
          <span className="text-ink capitalize">{reservation.deliveryMethod ?? "—"}</span>
        </div>
      </div>

      <form action={updateWithId}>
        <label className={labelClass}>Status</label>
        <select name="status" defaultValue={reservation.status} className={inputClass}>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="failed">Failed</option>
        </select>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            name="deposit_paid"
            id="deposit_paid"
            defaultChecked={reservation.depositPaid}
            className="w-4 h-4"
          />
          <label htmlFor="deposit_paid" className="text-sm text-ink/80">
            Deposit paid
          </label>
        </div>

        <label className={labelClass}>Deposit Amount ($)</label>
        <input
          name="deposit_amount"
          type="number"
          step="0.01"
          defaultValue={reservation.depositAmount ?? ""}
          className={inputClass}
        />

        <label className={labelClass}>Final Amount ($)</label>
        <input
          name="final_amount"
          type="number"
          step="0.01"
          defaultValue={reservation.finalAmount ?? ""}
          className={inputClass}
        />

        <label className={labelClass}>Final Payment Due Date</label>
        <input
          name="final_due_date"
          type="date"
          defaultValue={reservation.finalDueDate ?? ""}
          className={inputClass}
        />

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            name="contract_signed"
            id="contract_signed"
            defaultChecked={reservation.contractSigned}
            className="w-4 h-4"
          />
          <label htmlFor="contract_signed" className="text-sm text-ink/80">
            Contract signed
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-forest text-cream py-3 rounded-full mt-8 hover:bg-forest-light transition-colors"
        >
          Save Reservation
        </button>
      </form>
    </main>
  );
}