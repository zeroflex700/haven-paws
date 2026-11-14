import { describe, expect, it } from "vitest";

import { getSafeRedirect } from "@/lib/auth/safe-redirect";

describe("getSafeRedirect", () => {
  it("returns the default fallback when no path is provided", () => {
    expect(getSafeRedirect(null)).toBe("/account");
    expect(getSafeRedirect(undefined)).toBe("/account");
    expect(getSafeRedirect("")).toBe("/account");
  });

  it("returns a custom fallback when no path is provided", () => {
    expect(getSafeRedirect(null, "/")).toBe("/");
    expect(getSafeRedirect(undefined, "/puppies")).toBe("/puppies");
  });

  it("allows same-origin relative paths", () => {
    expect(getSafeRedirect("/puppies")).toBe("/puppies");
    expect(getSafeRedirect("/account/settings")).toBe("/account/settings");
  });

  it("preserves query strings and hashes on allowed paths", () => {
    expect(getSafeRedirect("/puppies?breed=Pug&sort=price-asc")).toBe(
      "/puppies?breed=Pug&sort=price-asc"
    );
    expect(getSafeRedirect("/breed-guides/golden-retriever#training")).toBe(
      "/breed-guides/golden-retriever#training"
    );
  });

  it("rejects absolute URLs", () => {
    expect(getSafeRedirect("https://example.com/puppies")).toBe("/account");
    expect(getSafeRedirect("http://example.com")).toBe("/account");
    expect(getSafeRedirect("javascript:alert(1)")).toBe("/account");
  });

  it("rejects protocol-relative URLs", () => {
    expect(getSafeRedirect("//example.com/puppies")).toBe("/account");
    expect(getSafeRedirect("/\\example.com/puppies")).toBe("/account");
  });

  it("rejects paths that do not start with a slash", () => {
    expect(getSafeRedirect("account")).toBe("/account");
    expect(getSafeRedirect(" /puppies")).toBe("/account");
  });

  it("redirects auth screens back to the fallback", () => {
    expect(getSafeRedirect("/account/login")).toBe("/account");
    expect(getSafeRedirect("/account/signup")).toBe("/account");
    expect(getSafeRedirect("/auth/callback")).toBe("/account");
  });

  it("detects auth screens even when they include a query or hash", () => {
    expect(getSafeRedirect("/account/login?next=/puppies")).toBe("/account");
    expect(getSafeRedirect("/account/signup#form")).toBe("/account");
    expect(getSafeRedirect("/auth/callback?code=abc")).toBe("/account");
  });

  it("uses the custom fallback for disallowed paths", () => {
    expect(getSafeRedirect("https://example.com", "/")).toBe("/");
    expect(getSafeRedirect("/account/login", "/puppies")).toBe("/puppies");
  });
});
