import { ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";

import type { Term } from "@/lib/content";

export type BespokeTermPageProps = {
  term: Term;
  previous: Term;
  next: Term;
  related: Term[];
};

export function TermLabHeader({ term, eyebrow, summary }: Pick<BespokeTermPageProps, "term"> & { eyebrow: string; summary: string }) {
  return (
    <header className="bespoke-term-header">
      <nav aria-label="面包屑">
        <Link href="/terms">术语词典</Link><span>/</span><Link href={`/terms?cat=${encodeURIComponent(term.cat)}`}>{term.cat}</Link><span>/</span><b>{term.zh}</b>
      </nav>
      <p>{eyebrow}</p>
      <h1>{term.zh}<span>{term.en}</span></h1>
      <div className="bespoke-term-summary"><i className="brand-star-only" aria-hidden="true" /><strong>{summary}</strong></div>
    </header>
  );
}

export function TermLabLearning({ related, sources }: Pick<BespokeTermPageProps, "related"> & { sources: { label: string; note: string; url: string }[] }) {
  return (
    <section className="bespoke-learning" aria-labelledby="bespoke-learning-title">
      <div className="bespoke-learning-title"><span>继续探索</span><h2 id="bespoke-learning-title">把这个概念接到真实工作里</h2></div>
      <div className="bespoke-learning-grid">
        <div><small>相关词条</small>{related.slice(0, 4).map((item) => <Link href={`/terms/${item.slug}`} key={item.slug}>{item.zh}<span>{item.en}</span></Link>)}</div>
        <div><small>核对来源</small>{sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span><strong>{source.label}</strong><em>{source.note}</em></span><ArrowUpRight size={16} /></a>)}</div>
      </div>
    </section>
  );
}
