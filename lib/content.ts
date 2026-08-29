import { z } from "zod";

import taxonomySource from "@/content/taxonomy.json";
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
});

const toolSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
});

export const taxonomy = taxonomySchema.parse(taxonomySource);
export const terms = z.array(termSchema).parse(termsSource);
export const tools = z.array(toolSchema).parse(toolsSource);

const categoryNames = new Set(taxonomy.map((item) => item.name));
const duplicateSlugs = terms.filter(
  (term, index) => terms.findIndex((candidate) => candidate.slug === term.slug) !== index,
);

if (duplicateSlugs.length) {
  throw new Error(`术语 slug 重复：${duplicateSlugs.map((term) => term.slug).join(", ")}`);
}

for (const term of terms) {
  if (!categoryNames.has(term.cat)) {
    throw new Error(`术语 ${term.slug} 使用了未定义的分类：${term.cat}`);
  }
}

export type Term = (typeof terms)[number];
export type Tool = (typeof tools)[number];

export function getTerm(slug: string) {
  return terms.find((term) => term.slug === slug);
}

export function getRelatedTerms(term: Term, count = 4) {
  const sameCategory = terms.filter(
    (candidate) => candidate.slug !== term.slug && candidate.cat === term.cat,
  );
  const others = terms.filter(
    (candidate) => candidate.slug !== term.slug && candidate.cat !== term.cat,
  );
  return [...sameCategory, ...others].slice(0, count);
}
