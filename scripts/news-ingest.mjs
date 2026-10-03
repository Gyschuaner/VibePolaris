import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { ingestNewsBatch } from "../lib/news-ingest.ts";

try {
  const input = process.argv[2];
  if (!input || process.argv.length > 3) throw new Error("用法：npm run news:ingest -- <JSON 路径|->");
  const text = input === "-" ? readFileSync(0, "utf8") : readFileSync(resolve(input), "utf8");
  const result = ingestNewsBatch(JSON.parse(text), {
    rootDir: process.env.NEWS_REPOSITORY || process.cwd(),
  });
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
} catch (error) {
  process.stderr.write("News 交接失败：" + (error instanceof Error ? error.message : String(error)) + "\n");
  process.exitCode = 1;
}
