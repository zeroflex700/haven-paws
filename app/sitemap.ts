import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase/client";

const SITE_URL = "https://haven-paws-pi.vercel.app";

const STATIC_ROUTES = [
  "",
  "/puppies",
  "/breeds",
  "/lifestyle",
  "/breed-guides",
  "/about",
  "/how-it-works",
  "/our-promise",
  "/delivery",
  "/breeder-standards",
  "/reviews",
  "/akc-registration",
  "/akc-benefits",
  "/fetch-insurance",
  "/contact",
  "/help-center",
  "/faqs",
  "/terms",
  "/puppy-training",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const { data: puppies } = await supabase
    .from("puppies")
    .select("id, updated_at")
    .eq("is_published", true);

  const puppyEntries: MetadataRoute.Sitemap = (puppies ?? []).map((p) => ({
    url: `${SITE_URL}/puppies/${p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
  }));

  const { data: breeds } = await supabase.from("breeds").select("slug").not("slug", "is", null);

  const breedGuideEntries: MetadataRoute.Sitemap = (breeds ?? [])
    .filter((b) => b.slug)
    .map((b) => ({
      url: `${SITE_URL}/breed-guides/${b.slug}`,
      lastModified: new Date(),
    }));

  return [...staticEntries, ...puppyEntries, ...breedGuideEntries];
}