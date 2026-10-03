import { validateNewsStore } from "../lib/news-ingest.ts";

try {
  const result = validateNewsStore(process.env.NEWS_REPOSITORY || process.cwd());
  if (result.errors.length) throw new Error(result.errors.join("\n"));
  process.stdout.write(JSON.stringify(result) + "\n");
} catch (error) {
  process.stderr.write("News 校验失败：" + (error instanceof Error ? error.message : String(error)) + "\n");
  process.exitCode = 1;
}
