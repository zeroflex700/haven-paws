import { supabase } from "@/lib/supabase/client";

export type ReservationStatus =
  | "action_required"
  | "due_now"
  | "pending"
  | "processing"
  | "completed"
  | "upcoming"
  | "failed"
  | "cancelled";

export type Reservation = {
  id: string;
  puppyId: string;
  puppyName: string | null;
  puppyImage: string | null;
  breed: string | null;
  paymentType: "deposit" | "full";
  amount: number;
  depositAmount: number | null;
  finalAmount: number | null;
  depositPaid: boolean;
  finalDueDate: string | null;
  contractSigned: boolean;
  deliveryMethod: string | null;
  rawStatus: string;
  createdAt: string;
};

function computeStatus(r: {
  rawStatus: string;
  depositPaid: boolean;
  finalAmount: number | null;
  finalDueDate: string | null;
}): ReservationStatus {
  const s = r.rawStatus?.toLowerCase() ?? "";

  if (s === "cancelled") return "cancelled";
  if (s === "failed") return "failed";
  if (s === "completed" || s === "paid") return "completed";
  if (s === "processing") return "processing";

  if (!r.depositPaid) return "action_required";

  if (r.finalAmount && r.finalDueDate) {
    const due = new Date(r.finalDueDate);
    const now = new Date();
    const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 0) return "due_now";
    if (daysUntil <= 7) return "pending";
    return "upcoming";
  }

  return "pending";
}

export async function getMyReservations(): Promise<(Reservation & { status: ReservationStatus })[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user?.email) return [];

  const { data } = await supabase
    .from("reservations")
    .select(
      `id, puppy_id, payment_type, amount, deposit_amount, final_amount, deposit_paid,
       final_due_date, contract_signed, delivery_method, status, created_at,
       puppies ( name, breed_id, breeds ( name ), puppy_media ( url, is_cover ) )`
    )
    .eq("customer_email", userData.user.email)
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => {
    const puppy = r.puppies as unknown as {
      name: string;
      breeds: { name: string } | null;
      puppy_media: { url: string; is_cover: boolean }[] | null;
    } | null;
    const cover = puppy?.puppy_media?.find((m) => m.is_cover)?.url ?? puppy?.puppy_media?.[0]?.url ?? null;

    const base = {
      id: r.id,
      puppyId: r.puppy_id,
      puppyName: puppy?.name ?? null,
      puppyImage: cover,
      breed: puppy?.breeds?.name ?? null,
      paymentType: r.payment_type as "deposit" | "full",
      amount: Number(r.amount),
      depositAmount: r.deposit_amount != null ? Number(r.deposit_amount) : null,
      finalAmount: r.final_amount != null ? Number(r.final_amount) : null,
      depositPaid: r.deposit_paid,
      finalDueDate: r.final_due_date,
      contractSigned: r.contract_signed,
      deliveryMethod: r.delivery_method,
      rawStatus: r.status,
      createdAt: r.created_at,
    };

    return { ...base, status: computeStatus(base) };
  });
}