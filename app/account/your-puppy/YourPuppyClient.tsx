"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PawPrint, ShieldCheck, FileText, CreditCard, Package, CheckCircle2, X, FlaskConical } from "lucide-react";
import OptimizedImage from "../../components/OptimizedImage";
import TransactionStatusBadge from "../../components/TransactionStatusBadge";
import ExpandableSection from "../../components/ExpandableSection";
import { getMyReservations, type Reservation, type ReservationStatus } from "@/lib/queries/reservations";
import { estimateDeliveryWindow } from "@/lib/deliveryEstimate";

type ReservationWithStatus = Reservation & { status: ReservationStatus };

function progressPercent(status: ReservationStatus, depositPaid: boolean): number {
  if (status === "completed") return 100;
  if (status === "cancelled" || status === "failed") return 0;
  if (depositPaid) return 65;
  return 20;
}

function SuccessBanner({ testMode, onDismiss }: { testMode: boolean; onDismiss: () => void }) {
  if (testMode) {
    return (
      <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <FlaskConical size={18} className="text-forest shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-forest font-medium">Test Mode / Prototype Payment</p>
          <p className="text-xs text-ink/70 mt-0.5">
            You completed a simulated test payment. No real charge was made, and no reservation
            has been created yet — this was a preview of the checkout experience only.
          </p>
        </div>
        <button onClick={onDismiss} aria-label="Dismiss" className="shrink-0 text-forest">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
      <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-green-800 font-medium">Reservation submitted</p>
        <p className="text-xs text-green-700 mt-0.5">
          You&apos;ve completed checkout with Lemon Squeezy. We&apos;ll confirm your payment and
          update your reservation status shortly — you can track everything here.
        </p>
      </div>
      <button onClick={onDismiss} aria-label="Dismiss" className="shrink-0 text-green-700">
        <X size={16} />
      </button>
    </div>
  );
}

function TransactionCard({ r }: { r: ReservationWithStatus }) {
  const progress = progressPercent(r.status, r.depositPaid);
  const deliveryWindow = estimateDeliveryWindow(r.deliveryMethod, r.createdAt);
  const remaining = r.finalAmount ?? Math.max(0, r.amount - (r.depositAmount ?? 0));

  return (
    <div className="bg-white border border-sage/20 rounded-xl overflow-hidden mb-6">
      <div className="bg-gold/10 p-5 flex gap-4 items-center">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-alt shrink-0">
          <OptimizedImage src={r.puppyImage} alt={r.puppyName ?? "Puppy"} sizes="64px" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg text-forest truncate">{r.puppyName ?? "Your Puppy"}</p>
          {r.breed && <p className="text-xs text-sage">{r.breed}</p>}
          <div className="mt-2">
            <TransactionStatusBadge status={r.status} />
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="w-full h-1.5 bg-cream-alt rounded-full overflow-hidden">
          <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[11px] text-sage mt-1.5">{progress}% complete</p>
      </div>

      <div className="p-5">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-ink/70">Total purchase</span>
            <span className="text-ink font-medium">${r.amount.toLocaleString()}</span>
          </div>
          {r.depositAmount != null && (
            <div className="flex justify-between text-sm">
              <span className="text-ink/70">Deposit</span>
              <span className={r.depositPaid ? "text-green-700" : "text-ink"}>
                ${r.depositAmount.toLocaleString()} {r.depositPaid ? "· Paid" : "· Not yet paid"}
              </span>
            </div>
          )}
          {r.finalAmount != null && (
            <div className="flex justify-between text-sm">
              <span className="text-ink/70">Remaining balance</span>
              <span className="text-ink font-medium">${remaining.toLocaleString()}</span>
            </div>
          )}
          {r.finalDueDate && (
            <div className="flex justify-between text-sm">
              <span className="text-ink/70">Balance due</span>
              <span className="text-ink">
                {new Date(r.finalDueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          )}
        </div>

        {(r.status === "action_required" || r.status === "due_now") && (
          <button className="w-full bg-forest text-cream text-sm py-3 rounded-full hover:bg-forest-light active:scale-[0.98] transition-all mb-2">
            {r.status === "action_required" ? "Complete Deposit" : "Pay Remaining Balance"}
          </button>
        )}
        <button className="w-full border border-sage/30 text-forest text-sm py-2.5 rounded-full active:scale-[0.98] transition-transform">
          View Payment Methods
        </button>

        <div className="flex items-center gap-2 mt-3 text-[11px] text-sage">
          <ShieldCheck size={13} className="text-gold shrink-0" />
          Payments are protected through Haven Paws&apos; secure checkout.
        </div>
      </div>

      <div className="px-5">
        <ExpandableSection title="Delivery estimate" defaultOpen={false}>
          <div className="flex items-start gap-2">
            <Package size={15} className="text-gold shrink-0 mt-0.5" />
            <p>
              {deliveryWindow
                ? `Estimated arrival window: ${deliveryWindow}, based on your selected delivery method.`
                : "Delivery window will be shared once your puppy's readiness date is confirmed."}
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection title="Contract & agreement">
          <div className="flex items-start gap-2">
            <FileText size={15} className="text-gold shrink-0 mt-0.5" />
            <p>
              {r.contractSigned
                ? "Your adoption contract has been signed and is on file."
                : "Your adoption contract is not yet signed. You'll receive it once your deposit is confirmed."}
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection title="Insurance & preparation">
          <div className="flex items-start gap-2">
            <PawPrint size={15} className="text-gold shrink-0 mt-0.5" />
            <p>
              Fetch Pet Insurance details and a puppy preparation checklist are sent by email
              once your deposit is confirmed. See{" "}
              <Link href="/fetch-insurance" className="text-forest underline">
                Fetch Insurance
              </Link>{" "}
              for coverage details.
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection title="Payment method on file">
          <div className="flex items-start gap-2">
            <CreditCard size={15} className="text-gold shrink-0 mt-0.5" />
            <p>Manage your saved payment method from Account Settings → Payment Settings.</p>
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
}

export default function YourPuppyClient() {
  const searchParams = useSearchParams();
  const [reservations, setReservations] = useState<ReservationWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(searchParams.get("checkout") === "success");
  const isTestMode = searchParams.get("mode") === "test";

  useEffect(() => {
    getMyReservations()
      .then(setReservations)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchParams.get("checkout") !== "success" || isTestMode) return;
    const puppyId = searchParams.get("puppy");
    if (!puppyId) return;
    try {
      localStorage.removeItem(`havenpaws_checkout_${puppyId}`);
    } catch {
      // ignore
    }
  }, [searchParams, isTestMode]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="h-56 bg-cream-alt rounded-xl" />
        ))}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div>
        {showSuccess && <SuccessBanner testMode={isTestMode} onDismiss={() => setShowSuccess(false)} />}
        <div className="text-center py-14">
          <PawPrint size={28} className="text-sage mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-ink font-medium text-sm mb-1">No puppies reserved yet</p>
          <p className="small-text mb-5">Once you reserve a puppy, you&apos;ll track your purchase here.</p>
          <Link
            href="/puppies"
            className="inline-block bg-forest text-cream text-sm px-6 py-2.5 rounded-full hover:bg-forest-light transition-colors"
          >
            Browse Puppies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showSuccess && <SuccessBanner testMode={isTestMode} onDismiss={() => setShowSuccess(false)} />}
      {reservations.map((r) => (
        <TransactionCard key={r.id} r={r} />
      ))}
    </div>
  );
}