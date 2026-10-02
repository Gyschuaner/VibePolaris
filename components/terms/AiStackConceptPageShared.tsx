import type { ReactNode } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { ArticleCitation, ConceptArticle } from "./ConceptArticle";
import { containerImageSources, type AiStackSource } from "@/lib/ai-stack-concept-sources";
import styles from "./ConceptArticle.module.css";

export function Cite({ id, sources }: { id: string; sources: AiStackSource[] }) {
  return <ArticleCitation id={id} sources={sources as typeof containerImageSources} />;
}

export function Hero({ trigger, change, proof }: { trigger: string; change: string; proof: string }) {
  return <div className={styles.contract} aria-label={`${trigger}：${change}；证据：${proof}`}>
    <div><span>读者遇到的任务</span><h3>{trigger}</h3><p>先把问题放回一个可观察的运行场景。</p></div>
    <div><span>机制真正改变的对象</span><h3>{change}</h3><p>只改变一个关键条件，结果才有办法归因。</p></div>
    <p className={styles.resultFlow}><CheckCircle size={22} />{proof}</p>
  </div>;
}

export function Article({ slug, title, subtitle, intro, sections, sources, hero, children }: { slug: string; title: string; subtitle: string; intro: ReactNode; sections: [string, string][]; sources: AiStackSource[]; hero: ReactNode; children: ReactNode }) {
  return <ConceptArticle slug={slug} title={title} subtitle={subtitle} intro={intro} sections={sections} sources={sources as typeof containerImageSources} hero={hero}>{children}</ConceptArticle>;
}
