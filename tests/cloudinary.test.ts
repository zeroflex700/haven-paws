import { describe, expect, it } from "vitest";

import { cldOptimized, cldThumb } from "@/lib/cloudinary";

const imageUrl =
  "https://res.cloudinary.com/demo/image/upload/v123/sample.jpg";

describe("cldThumb", () => {
  it("adds a square thumbnail transformation by default", () => {
    expect(cldThumb(imageUrl)).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill,q_auto,f_auto/v123/sample.jpg"
    );
  });

  it("uses a custom thumbnail size", () => {
    expect(cldThumb(imageUrl, 64)).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_64,h_64,c_fill,q_auto,f_auto/v123/sample.jpg"
    );
  });

  it("leaves non-Cloudinary URLs untouched", () => {
    const externalUrl = "https://example.com/images/puppy.jpg";

    expect(cldThumb(externalUrl)).toBe(externalUrl);
    expect(cldThumb("")).toBe("");
  });
});

describe("cldOptimized", () => {
  it("adds an optimized width transformation by default", () => {
    expect(cldOptimized(imageUrl)).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_800,c_fill,q_auto,f_auto/v123/sample.jpg"
    );
  });

  it("uses a custom optimized width", () => {
    expect(cldOptimized(imageUrl, 1200)).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_1200,c_fill,q_auto,f_auto/v123/sample.jpg"
    );
  });

  it("works for Cloudinary video URLs", () => {
    const videoUrl =
      "https://res.cloudinary.com/demo/video/upload/v123/story.mp4";

    expect(cldOptimized(videoUrl, 640)).toBe(
      "https://res.cloudinary.com/demo/video/upload/w_640,c_fill,q_auto,f_auto/v123/story.mp4"
    );
  });

  it("preserves query strings on Cloudinary URLs", () => {
    expect(cldOptimized(`${imageUrl}?v=2`)).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_800,c_fill,q_auto,f_auto/v123/sample.jpg?v=2"
    );
  });

  it("leaves non-Cloudinary URLs untouched", () => {
    const externalUrl = "https://example.com/images/puppy.jpg";

    expect(cldOptimized(externalUrl)).toBe(externalUrl);
    expect(cldOptimized("")).toBe("");
  });
});
