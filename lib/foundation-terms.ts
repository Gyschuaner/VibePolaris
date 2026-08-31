import { z } from "zod";

import cssFoundationSource from "@/content/zh/foundation-terms/css.json";

// 基础词条（CSS 起步）的正文模型：与 293 条 term-experiences 分开。
// 目标是让面向 Vibe Coder 的正文（大白话入口、分场景提示词、检查清单、选型指北）
// 全部以结构化 JSON 维护，改文案不需要改组件。

const plainHitSchema = z.object({
  text: z.string().min(1),
  target: z.enum(["demo", "ai-guide", "direction"]),
});

const demoStepSchema = z.object({
  key: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  selector: z.string().min(1),
  innerSelector: z.string().min(1).optional(),
  property: z.string().min(1),
  value: z.string(),
  note: z.string().min(1),
  computed: z.string().min(1),
  source: z.string().min(1),
  widthLabel: z.string().min(1),
  layout: z.enum(["desktop", "squeezed", "stacked"]),
});

const aiSlotSchema = z.object({
  seen: z.string().min(1),
  want: z.string().min(1),
  avoid: z.string().min(1),
  verify: z.string().min(1),
});

const miniItemSchema = z.object({
  title: z.string().min(1),
  meta: z.string().min(1),
});

const miniPageSchema = z.object({
  width: z.enum(["wide", "phone"]),
  layout: z.enum(["list", "cards", "tight", "squeezed", "stacked"]),
  title: z.string().min(1),
  link: z.string().min(1),
  items: z.array(miniItemSchema).length(3),
});

const aiSceneSchema = z.object({
  from: miniPageSchema,
  to: miniPageSchema,
  caption: z.string().min(1),
});

const aiScenarioSchema = z.object({
  key: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  tagline: z.string().min(1),
  slots: aiSlotSchema,
  scene: aiSceneSchema,
  prompt: z.string().min(1),
});

const directionOptionSchema = z.object({
  name: z.string().min(1),
  verdict: z.string().min(1),
  when: z.string().min(1),
});

const learningPathSchema = z.object({
  kind: z.string().min(1),
  title: z.string().min(1),
  note: z.string().min(1),
  href: z.string().min(1),
});

export const foundationTermSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  intro: z.object({
    question: z.string().min(1),
    definition: z.string().min(1),
    boundary: z.string().min(1),
    prerequisite: z.string().min(1),
    aliases: z.array(z.string().min(1)).min(1),
  }),
  plainHits: z.array(plainHitSchema).min(3).max(4),
  demo: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    ariaLabel: z.string().min(1),
    steps: z.array(demoStepSchema).length(3),
    chain: z.array(z.string().min(1)).length(3),
    responsibility: z.string().min(1),
  }),
  aiGuide: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
    scenarios: z.array(aiScenarioSchema).min(2).max(3),
    promptCaption: z.string().min(1),
    copyLabel: z.string().min(1),
  }),
  direction: z.object({
    title: z.string().min(1),
    note: z.string().min(1),
    options: z.array(directionOptionSchema).length(3),
    link: z.object({ label: z.string().min(1), href: z.string().min(1) }),
  }),
  learning: z.object({
    path: z.array(learningPathSchema).min(2),
    course: z.object({
      label: z.string().min(1),
      title: z.string().min(1),
      meta: z.string().min(1),
      href: z.string().min(1),
    }),
    references: z.array(z.object({
      label: z.string().min(1),
      note: z.string().min(1),
      href: z.string().url().startsWith("https://"),
    })).min(1).max(3),
  }),
});

export type FoundationTerm = z.infer<typeof foundationTermSchema>;
export type FoundationDemoStep = FoundationTerm["demo"]["steps"][number];
export type FoundationScenario = FoundationTerm["aiGuide"]["scenarios"][number];
export type FoundationScenePage = FoundationScenario["scene"]["from"];
export type PlainHit = FoundationTerm["plainHits"][number];

const foundationTerms: FoundationTerm[] = [
  foundationTermSchema.parse(cssFoundationSource),
];

const duplicateFoundationSlugs = foundationTerms.filter(
  (term, index) => foundationTerms.findIndex((candidate) => candidate.slug === term.slug) !== index,
);

if (duplicateFoundationSlugs.length) {
  throw new Error(`基础词条 slug 重复：${duplicateFoundationSlugs.map((term) => term.slug).join(", ")}`);
}

for (const term of foundationTerms) {
  const scenarioKeys = new Set(term.aiGuide.scenarios.map((scenario) => scenario.key));
  if (scenarioKeys.size !== term.aiGuide.scenarios.length) {
    throw new Error(`基础词条 ${term.slug} 的 AI 场景 key 重复`);
  }
  const demoKeys = new Set(term.demo.steps.map((step) => step.key));
  if (demoKeys.size !== term.demo.steps.length) {
    throw new Error(`基础词条 ${term.slug} 的演示步骤 key 重复`);
  }
}

export function getFoundationTerm(slug: string) {
  return foundationTerms.find((term) => term.slug === slug);
}
