export const CATEGORY_COLORS = [
  "bg-green-100 text-green-900",
  "bg-orange-100 text-orange-900",
  "bg-yellow-100 text-yellow-900",
  "bg-pink-100 text-pink-900",
  "bg-purple-100 text-purple-900", // lavender
  "bg-gray-100 text-blue-900",
] as const;

export function getCategoryColor(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}