import type { MetadataRoute } from "next";
import { CALCULATORS, LIVE_CATEGORIES } from "@/content";
import { INFO_PAGES } from "@/content/pages";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const newest = CALCULATORS.map((c) => c.lastUpdated).sort().at(-1)!;
  return [
    { url: absoluteUrl("/"), lastModified: newest, priority: 1 },
    ...CALCULATORS.map((c) => ({ url: absoluteUrl(`/${c.slug}`), lastModified: c.lastUpdated, priority: 0.9 })),
    ...LIVE_CATEGORIES.map((c) => ({ url: absoluteUrl(`/${c.slug}`), lastModified: newest, priority: 0.6 })),
    ...INFO_PAGES.map((p) => ({ url: absoluteUrl(`/${p.slug}`), priority: 0.3 })),
  ];
}
