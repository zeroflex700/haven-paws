import { describe, expect, it } from "vitest";

import { buildNavSections } from "@/lib/navSections";

describe("buildNavSections", () => {
  it("returns the expected section order", () => {
    expect(buildNavSections(false).map((section) => section.title)).toEqual([
      "Explore",
      "For Puppy Parents",
      "For Breeders",
      "Support",
      "About Haven Paws",
    ]);
  });

  it("shows login and sign-up links to signed-out visitors", () => {
    const accountLink = findAccountLink(false);

    expect(accountLink).toEqual({
      label: "Log In or Sign Up",
      href: "/account/login",
    });
  });

  it("shows the account link to signed-in visitors", () => {
    const accountLink = findAccountLink(true);

    expect(accountLink).toEqual({
      label: "My Account",
      href: "/account",
    });
  });

  it("keeps all sections populated", () => {
    for (const section of buildNavSections(false)) {
      expect(section.links.length).toBeGreaterThan(0);
    }
  });

  it("uses root-relative internal links", () => {
    for (const section of buildNavSections(false)) {
      for (const link of section.links) {
        expect(link.href.startsWith("/")).toBe(true);
        expect(link.label.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the rest of the navigation stable between auth states", () => {
    const loggedOut = buildNavSections(false);
    const loggedIn = buildNavSections(true);

    expect(stripAccountLink(loggedIn)).toEqual(stripAccountLink(loggedOut));
  });
});

function findAccountLink(loggedIn: boolean) {
  const section = buildNavSections(loggedIn).find(
    (item) => item.title === "For Puppy Parents"
  );

  return section?.links.find((link) => link.href.startsWith("/account"));
}

function stripAccountLink(
  sections: ReturnType<typeof buildNavSections>
): ReturnType<typeof buildNavSections> {
  return sections.map((section) => ({
    ...section,
    links: section.links.filter((link) => !link.href.startsWith("/account")),
  }));
}
