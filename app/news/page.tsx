import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { newsArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "新闻",
  description: "VibePolaris 新闻与编辑观察，先核对来源，再把变化讲清楚。",
};

export default function NewsPage() {
  return (
    <>
      <SiteHeader />
      <main className="news-page wrap">
        <header className="news-page-head">
          <p className="eyebrow">VibePolaris News</p>
          <h1 className="page-title">新闻</h1>
          <p className="news-page-intro">记录值得核对的变化与线索，把事实、来源和解释放在一起阅读。</p>
        </header>
        <section className="news-list" aria-label="新闻列表">
          {newsArticles.map((article) => (
            <article className="news-card" key={article.slug}>
              <div className="news-card-meta">
                <span className="chip">{article.category}</span>
                {article.isExample && <span className="news-example-label">示例文章</span>}
                <time dateTime={article.publishedAt}>{article.publishedAt}</time>
                <span>{article.readTime}</span>
              </div>
              <h2><Link href={`/news/${article.slug}`}>{article.title}</Link></h2>
              <p>{article.summary}</p>
              <Link className="news-card-link" href={`/news/${article.slug}`}>阅读文章 <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
