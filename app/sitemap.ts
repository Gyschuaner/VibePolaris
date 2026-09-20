import type { MetadataRoute } from "next";

import { terms } from "@/lib/content";

const baseUrl = "https://vibepolaris.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/terms", "/graph", "/guides", "/guides/css", "/guides/html", "/guides/javascript", "/tools", "/about"];
  return [
    ...pages.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.8 })),
    ...terms.map((term) => ({ url: `${baseUrl}/terms/${term.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
