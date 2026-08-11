const DELIVERY_WINDOWS: Record<string, { minDays: number; maxDays: number }> = {
  home: { minDays: 14, maxDays: 28 },
  meet: { minDays: 14, maxDays: 28 },
  express: { minDays: 7, maxDays: 14 },
  pickup: { minDays: 7, maxDays: 14 },
};

export function estimateDeliveryWindow(deliveryMethod: string | null, fromDate: string): string | null {
  const key = (deliveryMethod ?? "").toLowerCase();
  const window = DELIVERY_WINDOWS[key];
  if (!window) return null;

  const start = new Date(fromDate);
  const earliest = new Date(start);
  earliest.setDate(earliest.getDate() + window.minDays);
  const latest = new Date(start);
  latest.setDate(latest.getDate() + window.maxDays);

  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(earliest)} – ${fmt(latest)}`;
}