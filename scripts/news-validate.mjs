import { loadNewsContent } from "./news-contract.mjs";

try {
  const { articles, drafts } = loadNewsContent();
  process.stdout.write(`${JSON.stringify({ published: articles.length, drafts: drafts.length, pending: drafts.filter(({ draft }) => ["discovered", "draft", "ready", "needs-review"].includes(draft.status)).length })}\n`);
} catch (error) {
  process.stderr.write(`News 校验失败：${error.message}\n`);
  process.exitCode = 1;
}
