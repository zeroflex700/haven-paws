import type { Metadata } from "next";
import { getBreederBySlug } from "@/lib/queries/breeders";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const breeder = await getBreederBySlug(slug);

  if (!breeder) {
    return { title: "Breeder Not Found" };
  }

  const title = breeder.breedName ? `${breeder.name} — ${breeder.breedName} Breeder` : breeder.name;
  const description = breeder.meetBreederText
    ? breeder.meetBreederText.slice(0, 155)
    : `Meet ${breeder.name}, a Haven Paws vetted breeder.`;

  return {
    title,
    description,
    alternates: { canonical: `/breeders/${slug}` },
    openGraph: {
      title,
      description,
      images: breeder.photoUrl ? [breeder.photoUrl] : undefined,
      url: `/breeders/${slug}`,
    },
  };
}

export default function BreederSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}