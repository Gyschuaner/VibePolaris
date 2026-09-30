import type { MetadataRoute } from "next";

import { newsArticles, publishedTerms } from "@/lib/content";

const baseUrl = "https://vibepolaris.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/guides/css", "/guides/html", "/guides/javascript", "/about", "/news"];
  return [
    ...pages.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.8 })),
    ...publishedTerms.map((term) => ({ url: `${baseUrl}/terms/${term.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...newsArticles.map((article) => ({ url: `${baseUrl}/news/${article.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
