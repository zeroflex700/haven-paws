import type { ReservationStatus } from "@/lib/queries/reservations";

const STATUS_MAP: Record<ReservationStatus, { label: string; className: string }> = {
  action_required: { label: "Action required", className: "bg-red-50 text-red-700 border border-red-200" },
  due_now: { label: "Due now", className: "bg-gold/15 text-forest border border-gold/40" },
  pending: { label: "Due before pickup", className: "bg-cream-alt text-ink border border-sage/30" },
  processing: { label: "Processing", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  completed: { label: "Completed", className: "bg-green-50 text-green-700 border border-green-200" },
  upcoming: { label: "Upcoming", className: "bg-cream-alt text-sage border border-sage/20" },
  failed: { label: "Payment failed", className: "bg-red-50 text-red-700 border border-red-200" },
  cancelled: { label: "Cancelled", className: "bg-cream-alt text-ink/50 border border-sage/20" },
};

export default function TransactionStatusBadge({ status }: { status: ReservationStatus }) {
  const meta = STATUS_MAP[status];
  return (
    <span className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-full ${meta.className}`}>
      {meta.label}
    </span>
  );
}