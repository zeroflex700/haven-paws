import { BREEDS } from "@/app/data/breeds";

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

export type BreedMatch = { breed: string; score: number };

// Fast, dependency-free, typo-tolerant matching against a small static list.
// Not a full-text search engine — appropriate because BREEDS has ~79 known
// entries shipped to the client already, so a network round-trip and a
// pg_trgm index would be unnecessary infrastructure for this list size.
export function matchBreeds(query: string, limit = 6): BreedMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: BreedMatch[] = BREEDS.map((breed) => {
    const b = breed.toLowerCase();
    if (b.startsWith(q)) return { breed, score: 0 };
    if (b.includes(q)) return { breed, score: 1 };
    const dist = levenshtein(q, b.slice(0, q.length + 2));
    return { breed, score: dist <= 2 ? 2 + dist : 99 };
  }).filter((r) => r.score < 99);

  return results.sort((a, b) => a.score - b.score).slice(0, limit);
}