import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getNewsArticle, getPublishedTerm, newsArticles } from "@/lib/content";

type NewsPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const article = getNewsArticle((await params).slug);
  return article ? { title: article.title, description: article.summary } : {};
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const article = getNewsArticle((await params).slug);
  if (!article) notFound();
  const relatedTerms = article.relatedSlugs.map((slug) => getPublishedTerm(slug)).filter(Boolean);

  return (
    <>
      <SiteHeader wide />
      <main className="news-detail-page">
        <article className="news-detail">
          <nav className="news-crumb"><Link href="/news">新闻</Link><span aria-hidden="true">/</span><span>{article.title}</span></nav>
          <p className="news-kicker">NEWS{article.isExample ? " / 示例内容" : ""}</p>
          <h1>{article.title}</h1>
          <p className="news-summary">{article.summary}</p>
          <div className="news-detail-meta"><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time><span>来源：{article.source.name}</span></div>
          <div className="news-prose"><Markdown remarkPlugins={[remarkGfm]} skipHtml>{article.body}</Markdown></div>
          <footer className="news-detail-footer">
            <p>来源：<a href={article.source.url}>{article.source.name}</a></p>
            <div className="news-related">
              <h2>关联词条</h2>
              <div>{relatedTerms.map((term) => <Link key={term!.slug} href={`/terms/${term!.slug}`}>{term!.zh}<span aria-hidden="true">↗</span></Link>)}</div>
            </div>
          </footer>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
