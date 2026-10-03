import type { ReactNode } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { ArticleCitation, ArticleSection, ConceptArticle } from "./ConceptArticle";
import type { harnessSources } from "@/lib/harness-references";
import type { GitSource } from "@/lib/git-concept-sources/shared";
import styles from "./ConceptArticle.module.css";

export function Cite({ id, sources }: { id: string; sources: GitSource[] }) {
  return <ArticleCitation id={id} sources={sources as unknown as typeof harnessSources} />;
}

export function GitHero({ trigger, change, proof }: { trigger: string; change: string; proof: string }) {
  return <div className={styles.contract} aria-label={`${trigger}：${change}；证据：${proof}`}>
    <div><span>读者遇到的任务</span><h3>{trigger}</h3><p>先把命令放回一份可观察的仓库状态。</p></div>
    <div><span>机制真正改变的对象</span><h3>{change}</h3><p>只改变一个 Git 层或引用，结果才有办法归因。</p></div>
    <p className={styles.resultFlow}><CheckCircle size={22} />{proof}</p>
  </div>;
}

export function GitArticle({ slug, title, subtitle, intro, sections, sources, hero, children }: { slug: string; title: string; subtitle: string; intro: ReactNode; sections: [string, string][]; sources: GitSource[]; hero: ReactNode; children: ReactNode }) {
  return <ConceptArticle slug={slug} title={title} subtitle={subtitle} intro={intro} sections={sections} sources={sources as unknown as typeof harnessSources} hero={hero}>{children}</ConceptArticle>;
}

export { ArticleSection };
