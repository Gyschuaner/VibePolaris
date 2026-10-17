import { z } from "zod";
import { newsMotionScenes } from "./news-motion-types.ts";

const label = z.string().trim().min(1).max(36);
export const newsMotionDesignSchema = z.strictObject({
  scene: z.enum(newsMotionScenes),
  mood: z.enum(["paper", "blueprint", "pressroom", "slate", "studio", "ledger"]),
  title: z.string().trim().min(1).max(80),
  subject: label, source: label, target: label, actor: label, action: label,
  result: z.string().trim().min(1).max(120),
  items: z.array(label).min(2).max(4),
  boundary: z.string().trim().min(1).max(160).optional(),
  duration: z.number().min(6).max(14),
  preview: z.number().min(.25).max(.8),
  voiceMode: z.enum(["transcribe", "duplex", "synthesize", "pipeline"]).optional(),
  triageMode: z.enum(["text", "signal"]).optional(),
  rationale: z.string().trim().min(20).max(800),
  values: z.strictObject({ before: z.number().finite(), after: z.number().finite(), unit: label, label }).optional(),
});

export function validateNewsMotionCoverage(articles: { slug: string; eventDate: string; isExample?: boolean }[], designs: Record<string, unknown>) {
  const expected = new Set(articles.filter(article => !article.isExample && article.eventDate.startsWith("2026-")).map(article => article.slug));
  const missing = [...expected].filter(slug => !(slug in designs));
  const extra = Object.keys(designs).filter(slug => !expected.has(slug));
  if (missing.length || extra.length) throw new Error(`2026 新闻动效未逐篇对应：缺少 ${missing.join(", ") || "无"}；多余 ${extra.join(", ") || "无"}`);
  return z.record(z.string(), newsMotionDesignSchema).parse(designs);
}
