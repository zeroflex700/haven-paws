import ExpandableSection from "./ExpandableSection";

export default function PaymentExplainer({
  price,
  depositAmount,
}: {
  price: number;
  depositAmount: number;
}) {
  const hasDeposit = depositAmount > 0;

  return (
    <div className="border border-sage/20 rounded-lg px-4 mb-6">
      <ExpandableSection title="How payment works">
        {hasDeposit ? (
          <div className="space-y-2">
            <p>
              You can reserve this puppy with a <strong>${depositAmount.toLocaleString()} deposit</strong>,
              with the remaining balance due before delivery — or pay the full{" "}
              ${price.toLocaleString()} now.
            </p>
            <p>
              Deposits and payments are made securely through our checkout. You can track your
              balance and due dates anytime from your account.
            </p>
          </div>
        ) : (
          <p>
            This puppy&apos;s full amount of ${price.toLocaleString()} is due at reservation,
            paid securely through our checkout.
          </p>
        )}
      </ExpandableSection>
    </div>
  );
}