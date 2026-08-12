import { createClient } from "@/lib/supabase/server";

export type AdminReservation = {
  id: string;
  puppyId: string;
  puppyName: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: string | null;
  paymentType: string;
  amount: number;
  depositAmount: number | null;
  finalAmount: number | null;
  depositPaid: boolean;
  finalDueDate: string | null;
  contractSigned: boolean;
  status: string;
  createdAt: string;
};

function mapRow(r: Record<string, unknown>): AdminReservation {
  const puppy = r.puppies as { name: string } | null;
  return {
    id: r.id as string,
    puppyId: r.puppy_id as string,
    puppyName: puppy?.name ?? null,
    customerName: r.customer_name as string,
    customerEmail: r.customer_email as string,
    customerPhone: r.customer_phone as string,
    deliveryMethod: r.delivery_method as string | null,
    paymentType: r.payment_type as string,
    amount: Number(r.amount),
    depositAmount: r.deposit_amount != null ? Number(r.deposit_amount) : null,
    finalAmount: r.final_amount != null ? Number(r.final_amount) : null,
    depositPaid: !!r.deposit_paid,
    finalDueDate: r.final_due_date as string | null,
    contractSigned: !!r.contract_signed,
    status: r.status as string,
    createdAt: r.created_at as string,
  };
}

export async function getAllReservationsAdmin(): Promise<AdminReservation[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reservations")
    .select(
      `id, puppy_id, customer_name, customer_email, customer_phone, delivery_method,
       payment_type, amount, deposit_amount, final_amount, deposit_paid, final_due_date,
       contract_signed, status, created_at,
       puppies ( name )`
    )
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapRow);
}

export async function getReservationAdmin(id: string): Promise<AdminReservation | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reservations")
    .select(
      `id, puppy_id, customer_name, customer_email, customer_phone, delivery_method,
       payment_type, amount, deposit_amount, final_amount, deposit_paid, final_due_date,
       contract_signed, status, created_at,
       puppies ( name )`
    )
    .eq("id", id)
    .single();
  return data ? mapRow(data) : null;
}