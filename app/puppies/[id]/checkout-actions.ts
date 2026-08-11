"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type CheckoutData = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  deliveryMethod: "pickup" | "delivery";
  essentials: string[];
  paymentType: "deposit" | "full";
  amount: number;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://haven-paws-pi.vercel.app";

export async function submitTakeMeHome(
  puppyId: string,
  puppyName: string,
  data: CheckoutData
) {
  const supabase = await createClient();

  const { data: reservation, error } = await supabase
    .from("reservations")
    .insert({
      puppy_id: puppyId,
      customer_name: `${data.firstName} ${data.lastName}`,
      customer_email: data.email,
      customer_phone: data.phone,
      customer_address: data.address + (data.apt ? `, ${data.apt}` : ""),
      customer_city: data.city,
      customer_state: data.state,
      customer_zip: data.zip,
      delivery_method: data.deliveryMethod,
      essentials: data.essentials,
      payment_type: data.paymentType,
      amount: data.amount,
      deposit_paid: 0,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !reservation) {
    throw new Error(error?.message ?? "Could not save your request");
  }

  let checkoutUrl: string | null = null;

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_RESERVATION_VARIANT_ID;

  if (apiKey && storeId && variantId) {
    try {
      const redirectUrl = `${SITE_URL}/account/your-puppy?checkout=success&puppy=${puppyId}&reservation=${reservation.id}`;

      const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              custom_price: Math.round(data.amount * 100),
              product_options: {
                redirect_url: redirectUrl,
              },
              checkout_data: {
                email: data.email,
                name: `${data.firstName} ${data.lastName}`,
                custom: { reservation_id: reservation.id, puppy_name: puppyName },
              },
            },
            relationships: {
              store: { data: { type: "stores", id: storeId } },
              variant: { data: { type: "variants", id: variantId } },
            },
          },
        }),
      });

      const json = await res.json();
      checkoutUrl = json?.data?.attributes?.url ?? null;

      if (checkoutUrl) {
        await supabase
          .from("reservations")
          .update({ lemonsqueezy_checkout_url: checkoutUrl })
          .eq("id", reservation.id);
      }
    } catch {
      checkoutUrl = null;
    }
  }

  revalidatePath("/admin/reservations");

  return { reservationId: reservation.id, checkoutUrl };
}