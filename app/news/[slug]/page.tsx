import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getNewsArticle, newsArticles } from "@/lib/content";

type NewsPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const article = getNewsArticle((await params).slug);
  if (!article) return {};
  return { title: article.title, description: article.summary };
}

export default async function NewsArticlePage({ params }: NewsPageProps) {
  const article = getNewsArticle((await params).slug);
  if (!article) notFound();

  return (
    <>
      <SiteHeader />
      <main className="detail news-detail">
        <div className="crumb"><Link href="/news">新闻</Link> / {article.category}</div>
        <h1>{article.title}</h1>
        <div className="d-meta news-detail-meta">
          <span className="chip">{article.category}</span>
          {article.isExample && <span className="chip news-example-chip">示例文章</span>}
          <time dateTime={article.publishedAt}>{article.publishedAt}</time>
          <span>{article.readTime}</span>
          <span>{article.author}</span>
        </div>
        <p className="news-lede">{article.summary}</p>
        {article.isExample && (
          <aside className="news-example-note" role="note">
            这是用于验证新闻栏目结构的示例文章，不代表真实热点，也不构成时事报道。
          </aside>
        )}
        <article className="news-article">
          {article.sections.map((section) => (
            <section className="news-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </article>
        <div className="related news-backlink"><Link href="/news">返回新闻列表</Link></div>
      </main>
      <SiteFooter />
    </>
  );
}
