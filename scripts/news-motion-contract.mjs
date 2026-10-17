import fs from "node:fs";
import path from "node:path";
import { validateNewsMotionCoverage } from "../lib/news-motion-schema.ts";

export function loadNewsMotion(articles, root = process.cwd()) {
  const directory = path.join(root, "content/zh/news-motion");
  const designs = {};
  for (const file of fs.readdirSync(directory).filter(file => file.endsWith(".json")).sort()) {
    const batch = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
    for (const [slug, design] of Object.entries(batch)) {
      if (Object.hasOwn(designs, slug)) throw new Error(`新闻动效批次重复：${slug}`);
      designs[slug] = design;
    }
  }
  return validateNewsMotionCoverage(articles, designs);
}
