import { describe, expect, it } from "vitest";

import { getContractTemplate } from "@/lib/breederContractTemplate";

describe("getContractTemplate", () => {
  it("personalises the contract guidance with the breeder name", () => {
    const text = getContractTemplate("Sunny Acres");

    expect(text.startsWith("Sunny Acres may provide")).toBe(true);
    expect(text).toContain("protects both you and Sunny Acres");
    expect(text).toContain("set by Sunny Acres directly");
    expect(text.match(/Sunny Acres/g)).toHaveLength(3);
  });

  it("mentions the written contract or health guarantee", () => {
    expect(getContractTemplate("Sunny Acres")).toContain(
      "written contract or health guarantee"
    );
  });

  it("preserves punctuation and apostrophes in breeder names", () => {
    const text = getContractTemplate("O'Brien & Sons Kennels");

    expect(text).toContain("O'Brien & Sons Kennels may provide");
    expect(text.match(/O'Brien & Sons Kennels/g)).toHaveLength(3);
  });

  it("does not leave template placeholders behind", () => {
    expect(getContractTemplate("Sunny Acres")).not.toContain("${");
  });
});
