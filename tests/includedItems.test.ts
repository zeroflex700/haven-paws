import { describe, expect, it } from "vitest";

import { ALL_INCLUDED_ITEMS } from "@/lib/includedItems";

describe("ALL_INCLUDED_ITEMS", () => {
  it("has unique item keys", () => {
    const keys = ALL_INCLUDED_ITEMS.map((item) => item.key);

    expect(new Set(keys).size).toBe(keys.length);
  });

  it("gives every item a non-empty label", () => {
    for (const item of ALL_INCLUDED_ITEMS) {
      expect(item.label.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes the core Haven Paws promises", () => {
    const keys = ALL_INCLUDED_ITEMS.map((item) => item.key);

    expect(keys).toContain("health_commitment");
    expect(keys).toContain("microchip");
    expect(keys).toContain("vetted_breeder");
    expect(keys).toContain("vaccinations");
    expect(keys).toContain("white_glove_delivery");
    expect(keys).toContain("secure_payments");
  });
});
