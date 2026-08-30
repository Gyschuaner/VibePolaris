import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TermDetailExperience } from "@/components/TermDetailExperience";
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
  const currentIndex = terms.findIndex((candidate) => candidate.slug === term.slug);
  const previous = terms[(currentIndex - 1 + terms.length) % terms.length];
  const next = terms[(currentIndex + 1) % terms.length];

  return (
    <>
      <SiteHeader wide />
      <TermDetailExperience term={term} previous={previous} next={next} related={related} />
      <SiteFooter />
    </>
  );
}
