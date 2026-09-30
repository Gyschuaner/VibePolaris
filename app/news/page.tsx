import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { newsArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "新闻",
  description: "记录 AI 与开发者工具领域值得复核的进展，并回到相关概念继续阅读。",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export default function NewsPage() {
  return (
    <>
      <SiteHeader wide />
      <main className="news-page">
        <header className="news-heading">
          <p className="news-kicker">NEWS / 新闻</p>
          <h1>把进展放回上下文里</h1>
          <p>从来源和证据出发，读一条新闻，再沿着关联词条继续理解它。</p>
        </header>
        <div className="news-list">
          {newsArticles.map((article) => (
            <article className="news-card" key={article.slug}>
              <div className="news-card-meta"><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>{article.isExample && <span>示例内容</span>}</div>
              <h2><Link href={`/news/${article.slug}`}>{article.title}</Link></h2>
              <p>{article.summary}</p>
              <Link className="news-more" href={`/news/${article.slug}`}>阅读文章 <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
