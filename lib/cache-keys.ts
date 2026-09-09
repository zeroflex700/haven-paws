export const cacheKeys = {
  publishedPuppies: "puppies:published",
  puppyDetail: (id: string) => `puppy:${id}`,
  relatedPuppiesPrefix: (breedId: string) => `puppies:related:${breedId}:`,
  relatedPuppies: (breedId: string, excludeId: string) =>
    `puppies:related:${breedId}:${excludeId}`,
  siblingsPrefix: (litterId: string) => `puppies:siblings:${litterId}:`,
  siblings: (litterId: string, excludeId: string) =>
    `puppies:siblings:${litterId}:${excludeId}`,
  breederBySlug: (slug: string) => `breeder:slug:${slug}`,
  breederById: (id: string) => `breeder:id:${id}`,
  videoStories: "homepage:video-stories",
  locationCards: "homepage:location-cards",
  exploringCards: "homepage:exploring-cards",
};