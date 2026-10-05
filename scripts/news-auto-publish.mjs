import { loadNewsContent, publishNewsDrafts } from "./news-contract.mjs";
import { resolve } from "node:path";

const repository = process.env.NEWS_REPOSITORY ? resolve(process.env.NEWS_REPOSITORY) : undefined;

export function autoPublishNews({ approve = false, repository: targetRepository = repository } = {}) {
  const content = loadNewsContent(targetRepository);
  const eligible = content.drafts.filter(({ draft }) => draft.status === "needs-review"
    && draft.publishDecision === "auto"
    && draft.riskLevel === "routine"
    && draft.verification?.status === "verified"
    && draft.evidence.length > 0
    && draft.reviewReasons.length === 0);
  if (!eligible.length) return { mode: approve ? "approved" : "dry-run", slugs: [], publishedCount: content.articles.length };
  return publishNewsDrafts(eligible.map(({ path }) => path), { approve, repository: targetRepository });
}

try {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== "--approve")) throw new Error("仅支持 --approve；默认只预览");
  process.stdout.write(`${JSON.stringify(autoPublishNews({ approve: args.includes("--approve"), repository }), null, 2)}\n`);
} catch (error) {
  process.stderr.write(`News 自动发布失败：${error.message}\n`);
  process.exitCode = 1;
}
