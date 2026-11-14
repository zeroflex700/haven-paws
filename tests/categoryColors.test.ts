import { describe, expect, it } from "vitest";

import { CATEGORY_COLORS, getCategoryColor } from "@/lib/categoryColors";

describe("getCategoryColor", () => {
  it("returns colours in order for the first cycle", () => {
    CATEGORY_COLORS.forEach((color, index) => {
      expect(getCategoryColor(index)).toBe(color);
    });
  });

  it("wraps around after the last colour", () => {
    expect(getCategoryColor(CATEGORY_COLORS.length)).toBe(CATEGORY_COLORS[0]);
    expect(getCategoryColor(CATEGORY_COLORS.length + 1)).toBe(
      CATEGORY_COLORS[1]
    );
    expect(getCategoryColor(CATEGORY_COLORS.length * 2)).toBe(
      CATEGORY_COLORS[0]
    );
  });

  it("uses the remainder of the index", () => {
    expect(getCategoryColor(13)).toBe(getCategoryColor(1));
    expect(getCategoryColor(17)).toBe(getCategoryColor(5));
  });

  it("defines unique colour classes", () => {
    expect(new Set(CATEGORY_COLORS).size).toBe(CATEGORY_COLORS.length);
  });
});
