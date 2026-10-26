import type { MetadataRoute } from "next";
import { siteConfig } from "./site-config";

const lastModified = new Date("2026-08-27T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${siteConfig.siteUrl}/terms-of-service`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
