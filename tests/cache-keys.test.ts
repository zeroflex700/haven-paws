import { describe, expect, it } from "vitest";

import { cacheKeys } from "@/lib/cache-keys";

describe("cacheKeys", () => {
  it("exposes the published puppies key", () => {
    expect(cacheKeys.publishedPuppies).toBe("puppies:published");
  });

  it("builds puppy-specific keys", () => {
    expect(cacheKeys.puppyDetail("puppy-1")).toBe("puppy:puppy-1");
  });

  it("builds related puppy keys that match their invalidation prefix", () => {
    const prefix = cacheKeys.relatedPuppiesPrefix("breed-1");
    const key = cacheKeys.relatedPuppies("breed-1", "puppy-1");

    expect(prefix).toBe("puppies:related:breed-1:");
    expect(key).toBe("puppies:related:breed-1:puppy-1");
    expect(key.startsWith(prefix)).toBe(true);
  });

  it("builds sibling keys that match their invalidation prefix", () => {
    const prefix = cacheKeys.siblingsPrefix("litter-1");
    const key = cacheKeys.siblings("litter-1", "puppy-1");

    expect(prefix).toBe("puppies:siblings:litter-1:");
    expect(key).toBe("puppies:siblings:litter-1:puppy-1");
    expect(key.startsWith(prefix)).toBe(true);
  });

  it("keeps breeds separate in related and sibling caches", () => {
    expect(cacheKeys.relatedPuppiesPrefix("breed-1")).not.toBe(
      cacheKeys.relatedPuppiesPrefix("breed-2")
    );
    expect(cacheKeys.relatedPuppies("breed-1", "puppy-1")).not.toBe(
      cacheKeys.relatedPuppies("breed-2", "puppy-1")
    );
    expect(cacheKeys.siblings("litter-1", "puppy-1")).not.toBe(
      cacheKeys.siblings("litter-2", "puppy-1")
    );
  });

  it("builds breeder lookup keys", () => {
    expect(cacheKeys.breederBySlug("sunny-acres")).toBe(
      "breeder:slug:sunny-acres"
    );
    expect(cacheKeys.breederById("breeder-1")).toBe("breeder:id:breeder-1");
  });

  it("exposes homepage collection keys", () => {
    expect(cacheKeys.videoStories).toBe("homepage:video-stories");
    expect(cacheKeys.locationCards).toBe("homepage:location-cards");
    expect(cacheKeys.exploringCards).toBe("homepage:exploring-cards");
  });

  it("does not reuse keys across cache namespaces", () => {
    const keys = [
      cacheKeys.publishedPuppies,
      cacheKeys.puppyDetail("puppy-1"),
      cacheKeys.relatedPuppies("breed-1", "puppy-1"),
      cacheKeys.siblings("litter-1", "puppy-1"),
      cacheKeys.breederBySlug("breeder-1"),
      cacheKeys.breederById("breeder-1"),
      cacheKeys.videoStories,
      cacheKeys.locationCards,
      cacheKeys.exploringCards,
    ];

    expect(new Set(keys).size).toBe(keys.length);
  });
});
