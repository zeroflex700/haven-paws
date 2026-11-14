import { describe, expect, it } from "vitest";

import { estimateDeliveryWindow } from "@/lib/deliveryEstimate";

describe("estimateDeliveryWindow", () => {
  it("returns null when no delivery method is provided", () => {
    expect(estimateDeliveryWindow(null, "2026-01-01T12:00:00")).toBeNull();
  });

  it("returns null for an unknown delivery method", () => {
    expect(estimateDeliveryWindow("drone", "2026-01-01T12:00:00")).toBeNull();
    expect(estimateDeliveryWindow("", "2026-01-01T12:00:00")).toBeNull();
  });

  it("estimates a 14–28 day window for home delivery", () => {
    expect(estimateDeliveryWindow("home", "2026-01-01T12:00:00")).toBe(
      "Jan 15 – Jan 29"
    );
  });

  it("estimates a 14–28 day window for meeting delivery", () => {
    expect(estimateDeliveryWindow("meet", "2026-01-01T12:00:00")).toBe(
      "Jan 15 – Jan 29"
    );
  });

  it("estimates a 7–14 day window for express delivery", () => {
    expect(estimateDeliveryWindow("express", "2026-01-01T12:00:00")).toBe(
      "Jan 8 – Jan 15"
    );
  });

  it("estimates a 7–14 day window for pickup", () => {
    expect(estimateDeliveryWindow("pickup", "2026-01-01T12:00:00")).toBe(
      "Jan 8 – Jan 15"
    );
  });

  it("matches delivery methods case-insensitively", () => {
    expect(estimateDeliveryWindow("HOME", "2026-01-01T12:00:00")).toBe(
      "Jan 15 – Jan 29"
    );
    expect(estimateDeliveryWindow("ExPrEsS", "2026-01-01T12:00:00")).toBe(
      "Jan 8 – Jan 15"
    );
  });

  it("rolls the estimated window into the next year", () => {
    expect(estimateDeliveryWindow("home", "2026-12-20T12:00:00")).toBe(
      "Jan 3 – Jan 17"
    );
  });

  it("handles leap years correctly", () => {
    expect(estimateDeliveryWindow("home", "2028-02-20T12:00:00")).toBe(
      "Mar 5 – Mar 19"
    );
  });
});
