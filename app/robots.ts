import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account/settings", "/account/payments"],
    },
    sitemap: "https://haven-paws-pi.vercel.app/sitemap.xml",
  };
}