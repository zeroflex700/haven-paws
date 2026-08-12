import { createClient } from "@/lib/supabase/server";

export type AdminInquiry = {
  id: string;
  puppyId: string | null;
  puppyName: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  message: string | null;
  status: string;
  createdAt: string;
};

function mapRow(r: Record<string, unknown>): AdminInquiry {
  const puppy = r.puppies as { name: string } | null;
  return {
    id: r.id as string,
    puppyId: r.puppy_id as string | null,
    puppyName: puppy?.name ?? null,
    customerName: r.customer_name as string,
    customerEmail: r.customer_email as string,
    customerPhone: r.customer_phone as string | null,
    message: r.message as string | null,
    status: r.status as string,
    createdAt: r.created_at as string,
  };
}

export async function getAllInquiriesAdmin(): Promise<AdminInquiry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inquiries")
    .select(
      `id, puppy_id, customer_name, customer_email, customer_phone, message, status, created_at,
       puppies ( name )`
    )
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapRow);
}