import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FolderOpen, Plus } from "@phosphor-icons/react/dist/ssr";
import { getRelatedTerms, getTerm } from "@/lib/content";
import type { harnessSources } from "@/lib/harness-references";
import { InlineTerm } from "./InlineTerm";
import { HarnessV4Toc } from "./HarnessV4Toc";
import { HarnessReferences } from "./HarnessReferences";
import { HarnessLearningMap } from "./HarnessLearningMap";
import { ConceptHero } from "./ConceptHero";
import story from "./HarnessStory.module.css";
import styles from "./ConceptArticle.module.css";

export function ConceptTerm({ slug, children }: { slug: string; children?: ReactNode }) {
  const term = getTerm(slug)!;
  return <InlineTerm title={term.zh} english={term.en} description={term.definition} href={`/terms/${slug}`}>{children ?? term.zh}</InlineTerm>;
}

export function ArticleCitation({ id, sources }: { id: string; sources: typeof harnessSources }) {
  return <sup className="vp-citation">{sources.map((source, index) => source.citations.includes(id) && <a key={source.url} href={`#ref-${index + 1}`} aria-label={`参考文献 ${index + 1}：${source.title}`}>[{index + 1}]</a>)}</sup>;
}

export function ArticleSection({ id, title, children, className = "" }: { id: string; title: string; children: ReactNode; className?: string }) {
  return <section className={`vp-chapter ${className}`} id={id}><div className="vp-chapter-content"><h2>{title}</h2>{children}</div></section>;
}

export function ArticleAside({ title, children }: { title: string; children: ReactNode }) {
  return <details className={story.supplement}><summary><FolderOpen size={21} aria-hidden="true" /><span>{title}</span><Plus className={story.supplementToggle} size={18} aria-hidden="true" /></summary><div className={story.supplementBody}>{children}</div></details>;
}

export function ConceptArticle({ slug, title, intro, sections, sources, children, hero, subtitle }: {
  slug: string; title: string; intro: ReactNode; sections: [string, string][]; sources: typeof harnessSources; children: ReactNode; hero?: ReactNode; subtitle?: string;
}) {
  const term = getTerm(slug)!;
  return <main className={`vp-concept ${story.page} ${styles.article}`} data-concept={slug} id="main-content"><div className="vp-page-layout">
    <HarnessV4Toc items={[...sections, ["roadmap", "相关概念"], ["related", "参考资料"]]} />
    <div className="vp-reading-content">
      <div className="vp-meta"><nav className="vp-crumb" aria-label="面包屑"><Link href="/"><ArrowLeft size={15} aria-hidden="true" />星图</Link><em>/</em><Link href={`/?cat=${encodeURIComponent(term.cat)}`}>AI · Agent</Link><em>/</em><span>{term.zh}</span></nav></div>
      <header className="vp-hero">
        <div className={styles.hero}><div className="vp-hero-top"><span className="brand-star-only term-route-star term-story-star" data-route-star-target aria-hidden="true" /><h1>{title}<span>{subtitle ?? (title === term.zh ? term.en : term.zh)}</span></h1></div>{hero ?? <ConceptHero slug={slug} />}</div>
        <p className="vp-hero-intro">{intro}</p>
      </header>
      {children}
      <ArticleSection id="roadmap" title="相关概念"><span id={`${slug}-learning-heading`} aria-hidden="true" /><p>回到 <ConceptTerm slug="agent-harness">Harness</ConceptTerm>，可以把这里的机制放进完整的运行过程。也可以沿着下面的关联，继续读其中一部分。</p><HarnessLearningMap centerSlug={slug} terms={getRelatedTerms(term, 8)} /><Link className="term-graph-link" href={`/?term=${slug}`}><span className="brand-star-only" aria-hidden="true" />打开完整星图<ArrowRight size={16} /></Link></ArticleSection>
      <ArticleSection id="related" title="参考资料"><HarnessReferences sources={sources} /></ArticleSection>
    </div>
  </div></main>;
}
