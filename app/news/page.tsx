import type { Metadata } from "next";

import { NewsAtlas } from "@/components/NewsAtlas";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getPublishedTerm, newsArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "新闻",
  description: "记录 AI 与开发者工具领域值得复核的进展，并回到相关概念继续阅读。",
};

export default function NewsPage() {
  const articles = newsArticles.map((article) => ({
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    publishedAt: article.publishedAt,
    isExample: article.isExample,
    source: article.source,
    relatedArticleSlugs: article.relatedArticleSlugs,
    related: article.relatedSlugs.map((slug) => getPublishedTerm(slug)).filter((term): term is NonNullable<typeof term> => Boolean(term)).map(({ slug, zh, en }) => ({ slug, zh, en })),
  }));

  return (
    <>
      <SiteHeader wide />
      <main className="news-atlas-page"><NewsAtlas articles={articles} /></main>
      <SiteFooter />
    </>
  );
}
