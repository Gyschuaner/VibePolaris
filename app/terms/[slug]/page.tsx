import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/CopyButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getRelatedTerms, getTerm, terms } from "@/lib/content";

type TermPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return terms.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const term = getTerm((await params).slug);
  if (!term) return {};
  return {
    title: `${term.zh}${term.en ? ` ${term.en}` : ""}`,
    description: `${term.zh}是什么？大白话示例、准确定义、可直接复制给 AI 的说法。`,
  };
}

export default async function TermPage({ params }: TermPageProps) {
  const term = getTerm((await params).slug);
  if (!term) notFound();
  const related = getRelatedTerms(term);
  const prompt = `【目标】${term.say}\n【约束】用现在项目已有的做法，不要引入新的依赖。\n【验收】改完后说明改了哪些文件、怎么自测。`;

  return (
    <>
      <SiteHeader wide />
      <main className="term-detail wrap">
        <header className="term-identity">
          <span
            className="brand-star-only term-route-star term-identity-star"
            data-route-star-target
            aria-hidden="true"
          />
          <h1>
            <span className="term-zh">{term.zh}</span>
            {term.en && <span className="en">{term.en}</span>}
          </h1>
          <Link className="term-category" href={`/terms?cat=${encodeURIComponent(term.cat)}`}>
            {term.cat}
          </Link>
          <p className="term-lede">{term.say}</p>
        </header>

        <article className="term-reading">
          <section className="term-section term-plain-language">
            <h2>大白话</h2>
            <p className="term-note">示例对话 · 发给 AI 的原话（来自外部对话工具，非本站功能）</p>
            <div className="term-dialogue">
              <p className="term-quote term-quote-user">{term.say}</p>
              <p className="term-quote term-quote-ai">好的，我会先按你的目标处理，并把做法、影响范围和验证结果说清楚。</p>
            </div>
          </section>

          <section className="term-section">
            <h2>它是什么</h2>
            <p className="term-definition">
              <strong>{term.zh}</strong>：{term.say} 在这里你能看到它的准确叫法、什么时候会用到，以及一段可以直接复制给 AI 的说法。想延伸可以继续浏览
              {" "}<Link href={`/terms?cat=${encodeURIComponent(term.cat)}`}>同类概念</Link>。
            </p>
          </section>

          <section className="term-section term-prompt">
            <h2>向 AI 这样说</h2>
            <p className="term-prompt-note">把下面这段话复制给 AI，可直接用于项目沟通或任务分配。</p>
            <div className="codecard"><CopyButton text={prompt} /><span>{prompt}</span></div>
          </section>
        </article>

        <nav className="term-related" aria-label="相关术语">
          <h2>相关术语</h2>
          <div className="term-related-list">
            {related.map((item) => (
              <Link key={item.slug} href={`/terms/${item.slug}`}>
                <span className="brand-star-only term-related-star" aria-hidden="true" />
                <span>{item.zh}{item.en ? ` ${item.en}` : ""}</span>
              </Link>
            ))}
          </div>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
