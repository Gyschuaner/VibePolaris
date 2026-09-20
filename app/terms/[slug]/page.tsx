import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TermDetailExperience } from "@/components/TermDetailExperience";
import type { BespokeTermPageProps } from "@/components/terms/BespokeTermScaffold";
import { ComponentTermPage } from "@/components/terms/ComponentTermPage";
import { CacheTermPage } from "@/components/terms/CacheTermPage";
import { AgentHarnessTermPage } from "@/components/terms/AgentHarnessTermPage";
import { RagTermPage } from "@/components/terms/RagTermPage";
import { RebaseTermPage } from "@/components/terms/RebaseTermPage";
import { TermExperiencePage } from "@/components/terms/TermExperiencePage";
import { getRelatedTerms, getTerm, terms } from "@/lib/content";
import { getTermExperience } from "@/lib/term-experiences";

type TermPageProps = { params: Promise<{ slug: string }> };

const dedicatedTermPages = {
  "agent-harness": AgentHarnessTermPage,
  component: ComponentTermPage,
  rebase: RebaseTermPage,
  rag: RagTermPage,
  cache: CacheTermPage,
  css: TermDetailExperience,
  html: TermDetailExperience,
  javascript: TermDetailExperience,
} satisfies Record<string, ComponentType<BespokeTermPageProps>>;

export const dynamicParams = false;

export function generateStaticParams() {
  return terms.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const term = getTerm((await params).slug);
  if (!term) return {};
  return {
    title: `${term.zh}${term.en ? ` ${term.en}` : ""}`,
    description: `用简短说明和交互演示了解${term.zh}，并查看常见用法与相关概念。`,
  };
}

export default async function TermPage({ params }: TermPageProps) {
  const term = getTerm((await params).slug);
  if (!term) notFound();
  const related = getRelatedTerms(term);
  const currentIndex = terms.findIndex((candidate) => candidate.slug === term.slug);
  const previous = terms[(currentIndex - 1 + terms.length) % terms.length];
  const next = terms[(currentIndex + 1) % terms.length];
  const experience = getTermExperience(term.slug);
  const DedicatedTermPage = term.slug in dedicatedTermPages
    ? dedicatedTermPages[term.slug as keyof typeof dedicatedTermPages]
    : null;

  if (!DedicatedTermPage && !experience) notFound();

  return (
    <>
      <SiteHeader wide termSlug={term.slug} />
      {DedicatedTermPage ? (
        <DedicatedTermPage term={term} previous={previous} next={next} related={related} />
      ) : (
        <TermExperiencePage term={term} experience={experience!} previous={previous} next={next} related={related} />
      )}
      {term.slug !== "agent-harness" && <aside className="term-graph-entry"><Link className="term-graph-link" href={`/graph?term=${term.slug}`}><span className="brand-star-only" aria-hidden="true" />在星图中探索「{term.zh}」<span aria-hidden="true">↗</span></Link></aside>}
      <SiteFooter />
    </>
  );
}
