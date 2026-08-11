import type { Metadata } from "next";
import { getBreedGuideBySlug } from "@/lib/queries/breedGuides";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getBreedGuideBySlug(slug);

  if (!guide) {
    return { title: "Breed Guide Not Found" };
  }

  const title = `${guide.breedName} Breed Guide`;
  const description =
    guide.overviewSupport ??
    guide.overviewQuote ??
    `Everything you need to know about ${guide.breedName}s — temperament, health, grooming, and more.`;

  return {
    title,
    description: description.slice(0, 155),
    alternates: { canonical: `/breed-guides/${slug}` },
    openGraph: {
      title,
      description: description.slice(0, 155),
      images: guide.heroImageUrl ? [guide.heroImageUrl] : undefined,
      url: `/breed-guides/${slug}`,
    },
  };
}

export default function BreedGuideSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}