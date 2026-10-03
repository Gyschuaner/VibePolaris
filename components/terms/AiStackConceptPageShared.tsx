import type { ReactNode } from "react";
import { ArticleCitation, ConceptArticle } from "./ConceptArticle";
import { MechanismHero } from "./ConceptHero";
import { containerImageSources, type AiStackSource } from "@/lib/ai-stack-concept-sources";

export function Cite({ id, sources }: { id: string; sources: AiStackSource[] }) {
  return <ArticleCitation id={id} sources={sources as typeof containerImageSources} />;
}

export function Hero({ trigger, change, proof }: { trigger: string; change: string; proof: string }) {
  return <MechanismHero trigger={trigger} change={change} proof={proof} />;
}

export function Article({ slug, title, subtitle, intro, sections, sources, hero, children }: { slug: string; title: string; subtitle: string; intro: ReactNode; sections: [string, string][]; sources: AiStackSource[]; hero: ReactNode; children: ReactNode }) {
  return <ConceptArticle slug={slug} title={title} subtitle={subtitle} intro={intro} sections={sections} sources={sources as typeof containerImageSources} hero={hero}>{children}</ConceptArticle>;
}
