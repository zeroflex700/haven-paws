import { describe, expect, it } from "vitest";

import { buildAuthHref } from "@/lib/auth/use-auth-next";

describe("buildAuthHref", () => {
  it("returns the base path when there is no destination", () => {
    expect(buildAuthHref("/account/login", "")).toBe("/account/login");
    expect(buildAuthHref("/account/signup", "/")).toBe("/account/signup");
  });

  it("adds a next parameter for a destination", () => {
    expect(buildAuthHref("/account/login", "/puppies")).toBe(
      "/account/login?next=%2Fpuppies"
    );
  });

  it("encodes destinations containing query strings", () => {
    expect(buildAuthHref("/account/login", "/puppies?breed=French%20Bulldog")).toBe(
      "/account/login?next=%2Fpuppies%3Fbreed%3DFrench%2520Bulldog"
    );
  });

  it("preserves a custom auth screen path", () => {
    expect(buildAuthHref("/admin/login", "/admin")).toBe(
      "/admin/login?next=%2Fadmin"
    );
  });
});
