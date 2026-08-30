import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TermDetailExperience } from "@/components/TermDetailExperience";
import { ComponentTermPage } from "@/components/terms/ComponentTermPage";
import { TermExperiencePage } from "@/components/terms/TermExperiencePage";
import { getRelatedTerms, getTerm, terms } from "@/lib/content";
import { getTermExperience } from "@/lib/term-experiences";

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
  const usesFoundationStory = ["css", "html", "javascript"].includes(term.slug);

  if (term.slug !== "component" && !usesFoundationStory && !experience) notFound();

  return (
    <>
      <SiteHeader wide />
      {term.slug === "component" ? (
        <ComponentTermPage term={term} previous={previous} next={next} related={related} />
      ) : usesFoundationStory ? (
        <TermDetailExperience term={term} previous={previous} next={next} related={related} />
      ) : (
        <TermExperiencePage term={term} experience={experience!} previous={previous} next={next} related={related} />
      )}
      <SiteFooter />
    </>
  );
}
