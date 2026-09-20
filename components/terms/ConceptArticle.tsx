import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Brain, CheckCircle, Circuitry, FileText, FolderOpen, Plus, Stack, Wrench } from "@phosphor-icons/react/dist/ssr";
import { getRelatedTerms, getTerm } from "@/lib/content";
import type { harnessSources } from "@/lib/harness-references";
import { InlineTerm } from "./InlineTerm";
import { HarnessV4Toc } from "./HarnessV4Toc";
import { HarnessReferences } from "./HarnessReferences";
import { HarnessLearningMap } from "./HarnessLearningMap";
import story from "./HarnessStory.module.css";
import styles from "./ConceptArticle.module.css";

export function ConceptTerm({ slug, children }: { slug: string; children?: ReactNode }) {
  const term = getTerm(slug)!;
  return <InlineTerm title={term.zh} english={term.en} description={term.definition} href={`/terms/${slug}`}>{children ?? term.zh}</InlineTerm>;
}

export function ArticleCitation({ id, sources }: { id: string; sources: typeof harnessSources }) {
  return <sup className="vp-citation">{sources.map((source, index) => source.citations.includes(id) && <a key={source.url} href={`#ref-${index + 1}`} aria-label={`参考文献 ${index + 1}：${source.title}`}>[{index + 1}]</a>)}</sup>;
}

export function ArticleSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section className="vp-chapter" id={id}><div className="vp-chapter-content"><h2>{title}</h2>{children}</div></section>;
}

export function ArticleAside({ title, children }: { title: string; children: ReactNode }) {
  return <details className={story.supplement}><summary><FolderOpen size={21} aria-hidden="true" /><span>{title}</span><Plus className={story.supplementToggle} size={18} aria-hidden="true" /></summary><div className={story.supplementBody}>{children}</div></details>;
}

function HeroDiagram({ slug }: { slug: string }) {
  const parts = slug === "tools" ? [[Brain, "请求"], [Circuitry, "调度"], [Wrench, "执行"]] as const
    : slug === "context" ? [[FileText, "资料"], [Stack, "本轮输入"], [Brain, "回答"]] as const
    : [[Brain, "判断"], [Wrench, "行动"], [CheckCircle, "反馈"]] as const;
  return <figure className={styles.heroDiagram} aria-label={parts.map(([, label]) => label).join(" → ")}>
    <svg viewBox="0 0 360 160" aria-hidden="true"><path d="M 52 90 Q 116 145 180 65 T 308 86" /><circle r="3"><animateMotion dur="3s" repeatCount="2" path="M 52 90 Q 116 145 180 65 T 308 86" /></circle></svg>
    {parts.map(([Icon, label], index) => <div key={label} className={styles.heroActor} style={{ left: `${index * 36 + 14}%`, top: index === 1 ? "26%" : "48%" }}><Icon size={29} weight="light" /><span>{label}</span></div>)}
  </figure>;
}

export function ConceptArticle({ slug, title, intro, sections, sources, children }: {
  slug: string; title: string; intro: ReactNode; sections: [string, string][]; sources: typeof harnessSources; children: ReactNode;
}) {
  const term = getTerm(slug)!;
  return <main className={`vp-concept ${story.page} ${styles.article}`} id="main-content"><div className="vp-page-layout">
    <HarnessV4Toc items={[...sections, ["roadmap", "相关概念"], ["related", "参考资料"]]} />
    <div className="vp-reading-content">
      <div className="vp-meta"><nav className="vp-crumb" aria-label="面包屑"><Link href="/"><ArrowLeft size={15} aria-hidden="true" />星图</Link><em>/</em><Link href={`/?cat=${encodeURIComponent(term.cat)}`}>AI · Agent</Link><em>/</em><span>{term.zh}</span></nav></div>
      <header className="vp-hero">
        <div className={styles.hero}><div className="vp-hero-top"><span className="brand-star-only term-route-star term-story-star" data-route-star-target aria-hidden="true" /><h1>{title}<span>{term.zh}</span></h1></div><HeroDiagram slug={slug} /></div>
        <p className="vp-hero-intro">{intro}</p>
      </header>
      {children}
      <ArticleSection id="roadmap" title="相关概念"><p>回到 <ConceptTerm slug="agent-harness">Harness</ConceptTerm>，可以把这里的机制放进完整的运行过程。也可以沿着下面的关联，继续读其中一部分。</p><HarnessLearningMap centerSlug={slug} terms={getRelatedTerms(term, 8)} /><Link className="term-graph-link" href={`/?term=${slug}`}><span className="brand-star-only" aria-hidden="true" />打开完整星图<ArrowRight size={16} /></Link></ArticleSection>
      <ArticleSection id="related" title="参考资料"><HarnessReferences sources={sources} /></ArticleSection>
    </div>
  </div></main>;
}
