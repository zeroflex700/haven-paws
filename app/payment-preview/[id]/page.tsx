import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PaymentPrototype from "../../components/PaymentPrototype";
import { getPuppyDetail } from "@/lib/queries/puppyDetail";

type LineItem = { label: string; amount: number };

export default async function PaymentPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ amount?: string; subtotal?: string; lineItems?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const puppy = await getPuppyDetail(id);

  if (!puppy) notFound();

  const coverImage = puppy.media.find((m) => m.isCover)?.url ?? puppy.media[0]?.url ?? null;
  const hasDeposit = puppy.depositAmount > 0;

  let amount = hasDeposit ? puppy.depositAmount : puppy.price;
  let subtotal = puppy.price;
  let lineItems: LineItem[] = [{ label: puppy.name, amount: puppy.price }];

  if (sp.amount && sp.subtotal && sp.lineItems) {
    try {
      const parsedItems = JSON.parse(sp.lineItems);
      if (Array.isArray(parsedItems)) {
        amount = Number(sp.amount);
        subtotal = Number(sp.subtotal);
        lineItems = parsedItems;
      }
    } catch {
      // malformed params — fall back to the defaults computed above
    }
  }

  return (
    <main>
      <Navbar />
      <div className="bg-gold/10 text-center py-2 text-[11px] text-forest font-medium">
        Test Mode — Prototype Payment (no real charge)
      </div>
      <PaymentPrototype
        puppyId={puppy.id}
        puppyName={puppy.name}
        puppyImage={coverImage}
        transactionTitle={hasDeposit ? `Deposit for ${puppy.name}` : `Payment for ${puppy.name}`}
        nonRefundable={hasDeposit}
        amount={amount}
        lineItems={lineItems}
        subtotal={subtotal}
      />
      <Footer />
    </main>
  );
}