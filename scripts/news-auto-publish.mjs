import { publishEligibleNews } from "../lib/news-ingest.ts";

try {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--approve")) throw new Error("仅支持 --approve；默认只预览");
  const result = publishEligibleNews({
    approve: args.includes("--approve"),
    rootDir: process.env.NEWS_REPOSITORY || process.cwd(),
  });
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
} catch (error) {
  process.stderr.write("News 发布失败：" + (error instanceof Error ? error.message : String(error)) + "\n");
  process.exitCode = 1;
}
