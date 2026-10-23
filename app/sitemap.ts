import type { MetadataRoute } from "next";

import { newsArticles, publishedTerms } from "@/lib/content";
import { siteModules } from "@/lib/site-modules";
import { libraryItems } from "@/lib/library";

const baseUrl = "https://vibepolaris.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [...(siteModules.graph ? [""] : []), ...(siteModules.library ? ["/library"] : []), ...(siteModules.news ? ["/news"] : []), "/guides/css", "/guides/html", "/guides/javascript", ...(siteModules.about ? ["/about"] : [])];
  return [
    ...pages.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.8 })),
    ...(siteModules.library ? libraryItems : []).map(item => ({ url: `${baseUrl}/library/${item.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...publishedTerms.map((term) => ({ url: `${baseUrl}/terms/${term.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...(siteModules.news ? newsArticles : []).map((article) => ({ url: `${baseUrl}/news/${article.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
