import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { NewsExplainer } from "@/components/NewsExplainer";
import { ReadingNotes } from "@/components/notes/ReadingNotes";
import { HarnessV4Toc } from "@/components/terms/HarnessV4Toc";
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
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "long", timeZone: "UTC" }).format(new Date(value + "T00:00:00Z"));
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const article = getNewsArticle((await params).slug);
  if (!article) notFound();
  const relatedTerms = article.relatedSlugs.map((slug) => getPublishedTerm(slug)).filter(Boolean);
  const relatedArticles = article.relatedArticleSlugs.map((slug) => getNewsArticle(slug)).filter(Boolean);
  const tocItems: [string, string][] = [
    ...article.sections!.map((section) => [section.id, section.title] as [string, string]),
    ["explainer", "理解这条新闻"],
    ["sources", "来源引用"],
    ["related", "站内关联"],
  ];

  return (
    <>
      <SiteHeader wide />
      <ReadingNotes path={`/news/${article.slug}`} title={article.title} layout="concept">
        <main className="vp-concept news-concept" id="main-content">
          <div className="vp-page-layout">
            <HarnessV4Toc items={tocItems} />
            <div className="vp-reading-content">
              <article className="news-detail">
                <nav className="news-crumb"><Link href="/news">新闻</Link><span aria-hidden="true">/</span><span>{article.title}</span></nav>
                <header className="news-detail-header">
                  <p className="news-kicker">NEWS{article.isExample ? " / 示例内容" : ""}</p>
                  <h1>{article.title}</h1>
                  <p className="news-summary">{article.summary}</p>
                  <div className="news-detail-meta"><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time><span>来源：{article.source.name}</span></div>
                  <figure className="news-hero">
                    {/* eslint-disable-next-line @next/next/no-img-element -- News hero URLs are validated by the content contract and may be local or official assets. */}
                    <img src={article.hero!.url} alt={article.hero!.alt} loading="eager" />
                    <figcaption>
                      <span>头图</span>
                      <a href={article.hero!.sourceUrl} target="_blank" rel="noreferrer">{article.hero!.credit ?? "图片来源"}</a>
                      <span>{article.hero!.license}</span>
                    </figcaption>
                  </figure>
                </header>
                <section className="vp-chapter news-lede" id="overview"><div className="vp-chapter-content"><div className="news-prose"><Markdown remarkPlugins={[remarkGfm]} skipHtml>{article.body}</Markdown></div></div></section>
                <section className="vp-chapter news-explainer-section" id="explainer"><div className="vp-chapter-content"><NewsExplainer data={article.explainer!} /></div></section>
                {article.sections!.map((section) => (
                  <section className={`vp-chapter news-section news-section-${section.kind}`} id={section.id} key={section.id}>
                    <div className="vp-chapter-content"><h2>{section.title}</h2><div className="news-prose"><Markdown remarkPlugins={[remarkGfm]} skipHtml>{section.body}</Markdown></div></div>
                  </section>
                ))}
                <section className="vp-chapter news-citations" id="sources"><div className="vp-chapter-content">
                  <h2>来源引用</h2>
                  <div className="news-citation-list">
                    {article.sources.map((citation, index) => <a className="news-citation" key={`${citation.url}-${index}`} href={citation.url} target="_blank" rel="noreferrer">
                      <span className="news-citation-source">{article.source.name}</span>
                      <strong>{citation.claim}</strong>
                      <q>{citation.excerpt}</q>
                      <span className="news-citation-link">打开原文 ↗</span>
                    </a>)}
                  </div>
                </div></section>
                <section className="vp-chapter news-related" id="related"><div className="vp-chapter-content">
                  <h2>站内关联</h2>
                  <div className="news-related-group"><h3>词条</h3><div>{relatedTerms.map((term) => <Link key={term!.slug} href={`/terms/${term!.slug}`}>{term!.zh}<span aria-hidden="true">↗</span></Link>)}</div></div>
                  {relatedArticles.length > 0 && <div className="news-related-group"><h3>相关 News</h3><div>{relatedArticles.map((related) => <Link key={related!.slug} href={`/news/${related!.slug}`}>{related!.title}<span aria-hidden="true">↗</span></Link>)}</div></div>}
                </div></section>
              </article>
            </div>
          </div>
        </main>
      </ReadingNotes>
      <SiteFooter />
    </>
  );
}
