import { deleteCacheKeys, deleteCacheByPrefix } from "./cache";
import { cacheKeys } from "./cache-keys";

export async function invalidatePublishedPuppies(): Promise<void> {
  await deleteCacheKeys([cacheKeys.publishedPuppies]);
}

export async function invalidatePuppyDetail(id: string): Promise<void> {
  await deleteCacheKeys([cacheKeys.puppyDetail(id)]);
}

export async function invalidateRelatedPuppiesForBreed(
  breedId: string
): Promise<void> {
  await deleteCacheByPrefix(cacheKeys.relatedPuppiesPrefix(breedId));
}

export async function invalidateSiblingsForLitter(
  litterId: string
): Promise<void> {
  await deleteCacheByPrefix(cacheKeys.siblingsPrefix(litterId));
}

export async function invalidateBreeder(
  id: string | null,
  slug: string | null
): Promise<void> {
  const keys: string[] = [];
  if (id) keys.push(cacheKeys.breederById(id));
  if (slug) keys.push(cacheKeys.breederBySlug(slug));
  await deleteCacheKeys(keys);
}

export async function invalidateHomepageCollections(): Promise<void> {
  await deleteCacheKeys([
    cacheKeys.videoStories,
    cacheKeys.locationCards,
    cacheKeys.exploringCards,
  ]);
}