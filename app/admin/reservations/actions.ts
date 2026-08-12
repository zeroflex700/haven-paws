"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateReservation(id: string, formData: FormData) {
  const supabase = await createClient();

  const depositAmount = formData.get("deposit_amount");
  const finalAmount = formData.get("final_amount");
  const finalDueDate = formData.get("final_due_date");

  const { error } = await supabase
    .from("reservations")
    .update({
      status: formData.get("status") as string,
      deposit_paid: formData.get("deposit_paid") === "on",
      deposit_amount: depositAmount ? Number(depositAmount) : null,
      final_amount: finalAmount ? Number(finalAmount) : null,
      final_due_date: finalDueDate ? (finalDueDate as string) : null,
      contract_signed: formData.get("contract_signed") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/reservations");
  revalidatePath(`/admin/reservations/${id}`);
  redirect("/admin/reservations");
}