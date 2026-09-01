import { z } from "zod";

import taxonomySource from "@/content/taxonomy.json";
import aiStackTermsSource from "@/content/zh/term-batches/ai-stack.json";
import backendDataTermsSource from "@/content/zh/term-batches/backend-data.json";
import frontendProductTermsSource from "@/content/zh/term-batches/frontend-product.json";
import termsSource from "@/content/zh/terms.json";
import toolsSource from "@/content/zh/tools.json";

const taxonomySchema = z.array(
  z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    description: z.string().min(1),
  }),
);

const termSchema = z.object({
  zh: z.string().min(1),
  en: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  cat: z.string().min(1),
  say: z.string().min(1),
  aliases: z.array(z.string().min(1)),
  question: z.string().min(1),
  definition: z.string().min(1),
  boundary: z.string().min(1),
  demoType: z.enum(["flow", "state", "comparison", "hierarchy", "lifecycle", "queue", "branch", "request"]),
  demoTitle: z.string().min(1),
  demoSteps: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    note: z.string().min(1),
  })).length(3),
  quizQuestion: z.string().min(1),
  quizOptions: z.array(z.string().min(1)).length(3),
  correctText: z.string().min(1),
  wrongText: z.string().min(1),
  promptTitle: z.string().min(1),
  prompt: z.string().min(1),
  relatedSlugs: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(2).max(4),
});

const toolSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
});

export const taxonomy = taxonomySchema.parse(taxonomySource);
export const terms = z.array(termSchema).parse([
  ...termsSource,
  ...frontendProductTermsSource,
  ...backendDataTermsSource,
  ...aiStackTermsSource,
]);
export const tools = z.array(toolSchema).parse(toolsSource);

const categoryNames = new Set(taxonomy.map((item) => item.name));
const duplicateSlugs = terms.filter(
  (term, index) => terms.findIndex((candidate) => candidate.slug === term.slug) !== index,
);

if (duplicateSlugs.length) {
  throw new Error(`术语 slug 重复：${duplicateSlugs.map((term) => term.slug).join(", ")}`);
}

const duplicateNames = terms.filter(
  (term, index) => terms.findIndex((candidate) => candidate.zh === term.zh) !== index,
);

if (duplicateNames.length) {
  throw new Error(`术语中文名重复：${duplicateNames.map((term) => term.zh).join(", ")}`);
}

for (const term of terms) {
  if (!categoryNames.has(term.cat)) {
    throw new Error(`术语 ${term.slug} 使用了未定义的分类：${term.cat}`);
  }
  for (const relatedSlug of term.relatedSlugs ?? []) {
    if (relatedSlug === term.slug) {
      throw new Error(`术语 ${term.slug} 不能关联自己`);
    }
    if (!terms.some((candidate) => candidate.slug === relatedSlug)) {
      throw new Error(`术语 ${term.slug} 关联了不存在的术语：${relatedSlug}`);
    }
  }
}

export type Term = (typeof terms)[number];
export type TermDemoType = NonNullable<Term["demoType"]>;
export type TermDemoStep = NonNullable<Term["demoSteps"]>[number];
export type Tool = (typeof tools)[number];

export function getTerm(slug: string) {
  return terms.find((term) => term.slug === slug);
}

export function getRelatedTerms(term: Term, count = 4) {
  const explicitlyRelated = term.relatedSlugs
    ?.map((slug) => getTerm(slug))
    .filter((candidate): candidate is Term => Boolean(candidate)) ?? [];
  const sameCategory = terms.filter(
    (candidate) => candidate.slug !== term.slug
      && candidate.cat === term.cat
      && !explicitlyRelated.some((related) => related.slug === candidate.slug),
  );
  const others = terms.filter(
    (candidate) => candidate.slug !== term.slug
      && candidate.cat !== term.cat
      && !explicitlyRelated.some((related) => related.slug === candidate.slug),
  );
  return [...explicitlyRelated, ...sameCategory, ...others].slice(0, count);
}
