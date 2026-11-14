import { describe, expect, it } from "vitest";

import { matchBreeds } from "@/lib/breedSearch";

describe("matchBreeds", () => {
  it("returns no matches for an empty query", () => {
    expect(matchBreeds("")).toEqual([]);
    expect(matchBreeds("   ")).toEqual([]);
  });

  it("prefers an exact prefix match over substring matches", () => {
    const results = matchBreeds("poodle");

    expect(results[0]).toEqual({ breed: "Poodle", score: 0 });
    expect(results).toContainEqual({ breed: "Miniature Poodle", score: 1 });
  });

  it("matches breed names case-insensitively", () => {
    expect(matchBreeds("FRENCH BULLDOG")[0]).toEqual({
      breed: "French Bulldog",
      score: 0,
    });
  });

  it("matches breed names by substring", () => {
    const results = matchBreeds("retriever");
    const breeds = results.map((result) => result.breed);

    expect(breeds).toContain("Labrador Retriever");
    expect(breeds).toContain("Golden Retriever");
    expect(breeds).toContain("Chesapeake Bay Retriever");
    expect(breeds).toContain("Nova Scotia Duck Tolling Retriever");
    expect(results.every((result) => result.score === 1)).toBe(true);
  });

  it("tolerates small typos in a breed name", () => {
    const results = matchBreeds("poodel");

    expect(results.some((result) => result.breed === "Poodle")).toBe(true);
    expect(results.find((result) => result.breed === "Poodle")?.score).toBeLessThan(
      99
    );
  });

  it("returns an empty list when nothing is close enough", () => {
    expect(matchBreeds("zzzzzzzz")).toEqual([]);
  });

  it("limits results to six matches by default", () => {
    expect(matchBreeds("a").length).toBeLessThanOrEqual(6);
  });

  it("honours a custom result limit", () => {
    expect(matchBreeds("a", 2)).toHaveLength(2);
    expect(matchBreeds("a", 0)).toEqual([]);
  });

  it("finds multiple breeds sharing a word", () => {
    const breeds = matchBreeds("husky").map((result) => result.breed);

    expect(breeds).toContain("Alaskan Husky");
    expect(breeds).toContain("Siberian Husky");
  });
});
