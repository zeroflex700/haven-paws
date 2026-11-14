import { describe, expect, it } from "vitest";

import {
  AT_A_GLANCE_KEYS,
  SCORECARD_FIELDS,
  SCORECARD_GROUPS,
} from "@/lib/breedGuideFields";

describe("breed guide scorecard fields", () => {
  it("has unique field keys", () => {
    const keys = SCORECARD_FIELDS.map((field) => field.key);

    expect(new Set(keys).size).toBe(keys.length);
  });

  it("assigns every field to a known group", () => {
    for (const field of SCORECARD_FIELDS) {
      expect(SCORECARD_GROUPS).toContain(field.group);
    }
  });

  it("uses every declared group", () => {
    const usedGroups = new Set(
      SCORECARD_FIELDS.map((field) => field.group)
    );

    expect(usedGroups.size).toBe(SCORECARD_GROUPS.length);
    for (const group of SCORECARD_GROUPS) {
      expect(usedGroups.has(group)).toBe(true);
    }
  });

  it("declares unique groups", () => {
    expect(new Set(SCORECARD_GROUPS).size).toBe(SCORECARD_GROUPS.length);
  });

  it("gives every field a label and supported input type", () => {
    for (const field of SCORECARD_FIELDS) {
      expect(field.label.trim().length).toBeGreaterThan(0);
      expect(["score", "text"]).toContain(field.type);
    }
  });

  it("only references existing fields at a glance", () => {
    const keys = new Set(SCORECARD_FIELDS.map((field) => field.key));

    expect(new Set(AT_A_GLANCE_KEYS).size).toBe(AT_A_GLANCE_KEYS.length);
    for (const key of AT_A_GLANCE_KEYS) {
      expect(keys.has(key)).toBe(true);
    }
  });

  it("keeps text and score fields where the guide expects them", () => {
    const fieldTypes = new Map(
      SCORECARD_FIELDS.map((field) => [field.key, field.type])
    );

    expect(fieldTypes.get("temperament")).toBe("text");
    expect(fieldTypes.get("lifespan")).toBe("text");
    expect(fieldTypes.get("affectionate_with_family")).toBe("score");
    expect(fieldTypes.get("trainability")).toBe("score");
  });
});
