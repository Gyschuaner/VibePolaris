import type { ReactNode } from "react";
import { ArticleCitation, ArticleSection, ConceptArticle } from "./ConceptArticle";
import { MechanismHero } from "./ConceptHero";
import type { harnessSources } from "@/lib/harness-references";
import type { GitSource } from "@/lib/git-concept-sources/shared";

export function Cite({ id, sources }: { id: string; sources: GitSource[] }) {
  return <ArticleCitation id={id} sources={sources as unknown as typeof harnessSources} />;
}

export function GitHero({ trigger, change, proof, contextLabel, contextTitle }: { trigger: string; change: string; proof: string; contextLabel?: string; contextTitle?: string }) {
  return <MechanismHero kind="git" trigger={trigger} change={change} proof={proof} contextLabel={contextLabel} contextTitle={contextTitle} />;
}

export function GitArticle({ slug, title, subtitle, intro, sections, sources, hero, children }: { slug: string; title: string; subtitle: string; intro: ReactNode; sections: [string, string][]; sources: GitSource[]; hero: ReactNode; children: ReactNode }) {
  return <ConceptArticle slug={slug} title={title} subtitle={subtitle} intro={intro} sections={sections} sources={sources as unknown as typeof harnessSources} hero={hero}>{children}</ConceptArticle>;
}

export { ArticleSection };
