import { z } from "zod";

import baseExperienceSource from "@/content/zh/term-experiences/base.json";
import aiStackExperienceSource from "@/content/zh/term-experiences/ai-stack.json";
import backendDataExperienceSource from "@/content/zh/term-experiences/backend-data.json";
import frontendProductExperienceSource from "@/content/zh/term-experiences/frontend-product.json";

const sceneKinds = [
  "route",
  "pipeline",
  "transform",
  "compare",
  "layers",
  "tree",
  "network",
  "timeline",
  "queue",
  "state-machine",
  "memory",
  "contract",
  "branch",
  "loop",
  "matrix",
  "spectrum",
  "assembly",
  "terminal",
] as const;

const actorIcons = [
  "browser",
  "server",
  "database",
  "file",
  "code",
  "user",
  "robot",
  "brain",
  "gear",
  "package",
  "git",
  "shield",
  "key",
  "cloud",
  "clock",
  "queue",
  "search",
  "chart",
  "layout",
  "component",
  "message",
  "network",
  "memory",
  "spark",
] as const;

const actorSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  detail: z.string().min(1),
  icon: z.enum(actorIcons),
  group: z.string().min(1),
});

const edgeSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  from: z.string().regex(/^[a-z0-9-]+$/),
  to: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
});

const frameSchema = z.object({
  label: z.string().min(1),
  note: z.string().min(1),
  activeIds: z.array(z.string()).default([]),
  doneIds: z.array(z.string()).default([]),
  mutedIds: z.array(z.string()).default([]),
  values: z.record(z.string(), z.string()).default({}),
  activeEdgeIds: z.array(z.string()).default([]),
  metric: z.object({
    label: z.string().min(1),
    value: z.string().min(1),
  }).optional(),
});

export const termExperienceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  lead: z.string().min(1),
  definition: z.string().min(1),
  boundary: z.string().min(1),
  sceneKind: z.enum(sceneKinds),
  sceneTitle: z.string().min(1),
  actionLabel: z.string().min(1),
  actors: z.array(actorSchema).min(2).max(8),
  edges: z.array(edgeSchema).max(12),
  frames: z.array(frameSchema).min(2).max(7),
  insight: z.string().min(1),
  quiz: z.object({
    question: z.string().min(1),
    options: z.array(z.object({
      label: z.string().min(1),
      correct: z.boolean(),
    })).length(3),
    success: z.string().min(1),
    retry: z.string().min(1),
  }),
  prompt: z.object({
    title: z.string().min(1),
    text: z.string().min(1),
  }),
  sources: z.array(z.object({
    url: z.string().url().startsWith("https://"),
    label: z.string().min(1),
    note: z.string().min(1),
  })).min(1).max(3),
});

export type TermExperience = z.infer<typeof termExperienceSchema>;
export type TermSceneKind = (typeof sceneKinds)[number];
export type TermActorIcon = (typeof actorIcons)[number];

export const termExperiences = z.array(termExperienceSchema).parse([
  ...baseExperienceSource,
  ...aiStackExperienceSource,
  ...backendDataExperienceSource,
  ...frontendProductExperienceSource,
]);

const duplicateExperienceSlugs = termExperiences.filter(
  (experience, index) => termExperiences.findIndex((candidate) => candidate.slug === experience.slug) !== index,
);

if (duplicateExperienceSlugs.length) {
  throw new Error(`词条体验 slug 重复：${duplicateExperienceSlugs.map((item) => item.slug).join(", ")}`);
}

for (const experience of termExperiences) {
  const actorIds = new Set(experience.actors.map((actor) => actor.id));
  const edgeIds = new Set(experience.edges.map((edge) => edge.id));

  if (actorIds.size !== experience.actors.length) {
    throw new Error(`词条 ${experience.slug} 的演示对象 id 重复`);
  }
  if (edgeIds.size !== experience.edges.length) {
    throw new Error(`词条 ${experience.slug} 的关系 id 重复`);
  }

  for (const edge of experience.edges) {
    if (!actorIds.has(edge.from) || !actorIds.has(edge.to)) {
      throw new Error(`词条 ${experience.slug} 的关系 ${edge.id} 指向不存在的对象`);
    }
  }

  if (experience.quiz.options.filter((option) => option.correct).length !== 1) {
    throw new Error(`词条 ${experience.slug} 的边界题必须且只能有一个正确选项`);
  }

  for (const frame of experience.frames) {
    const referencedActorIds = [
      ...frame.activeIds,
      ...frame.doneIds,
      ...frame.mutedIds,
      ...Object.keys(frame.values),
    ];
    if (referencedActorIds.some((id) => !actorIds.has(id))) {
      throw new Error(`词条 ${experience.slug} 的分镜 ${frame.label} 引用了不存在的对象`);
    }
    if (frame.activeEdgeIds.some((id) => !edgeIds.has(id))) {
      throw new Error(`词条 ${experience.slug} 的分镜 ${frame.label} 引用了不存在的关系`);
    }
  }
}

export function getTermExperience(slug: string) {
  return termExperiences.find((experience) => experience.slug === slug);
}
