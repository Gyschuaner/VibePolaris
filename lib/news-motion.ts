import early from "@/content/zh/news-motion/2026-early.json";
import summer from "@/content/zh/news-motion/2026-late-summer.json";
import october from "@/content/zh/news-motion/2026-october.json";
import { z } from "zod";
import { newsMotionDesignSchema } from "@/lib/news-motion-schema";

const batches = [early, summer, october];
const slugs = batches.flatMap(batch => Object.keys(batch));
if (new Set(slugs).size !== slugs.length) throw new Error("新闻动效设计批次含重复 slug");
// The publication prebuild checks the full year; local authoring can preview a finished article.
const designs = z.record(z.string(), newsMotionDesignSchema).parse(Object.assign({}, ...batches));

export function getNewsMotionDesign(slug: string, eventDate: string) {
  const design = designs[slug];
  if (!design && eventDate.startsWith("2026-")) throw new Error(`2026 新闻尚缺逐篇动效设计：${slug}`);
  if (!design) return undefined;
  const { rationale: editorialRationale, ...publicDesign } = design;
  void editorialRationale;
  return publicDesign;
}
