# 新闻草稿交接目录

云端采集程序把每条待审核新闻写成一个 JSON 文件，路径固定为：

```text
content/zh/news-drafts/YYYY-MM-DD/<slug>.json
```

目录日期是 `discoveredAt` 的 UTC 日期，`publishedAt` 是来源文章的发布日期；旧文章今天才被发现时，两者可以不同。每个文件是一篇完整草稿，正文为 Markdown；JSON 不接受未定义字段。`sourceHash` 使用来源正文经去除首尾空白、统一换行符后的 SHA-256，格式为 `sha256:` 加 64 位小写十六进制。

云端进行去重和关系建议前，需要同步当前目录快照：

```bash
node --experimental-strip-types scripts/news-catalog.mjs > /tmp/vbp-news-catalog.json
```

目录包含公开词条的 slug、中文名、英文名、别名、定义，以及已发布文章和已有草稿的来源/指纹；正文不会重复导出。只用目录中的真实 slug 生成关联建议。尚未确认的关系放在 `relationSuggestions`；`relatedSlugs`/`relatedArticleSlugs` 放已确认关系。提升为公开内容前至少确认一个公开词条；多个相互关联草稿须在同一次提升命令中一起指定，或先发布关系目标。

仓库不会自动读取草稿渲染页面或回答 Xiaobei。六小时工作流由云端 Dots 通过 `NEWS_DOTS_ENDPOINT` 或 `repository_dispatch` 事件交付同一个批次；缺少端点时任务直接失败且不写文件。先运行：

```bash
npm run news:validate
```

校验通过、完成事实核对并把 `status` 改为 `needs-review` 后，仓库自动只提升满足发布门槛的草稿；人工仍可在 feature 分支上预览提升结果：

```bash
npm run news:publish -- content/zh/news-drafts/2026-09-30/example-slug.json
```

只有明确加入 `--approve` 才会写入 `content/zh/news.json`；原草稿会保留为 `status: "published"` 的审计记录。`news:auto-publish` 只接受同时满足以下条件的候选：至少一条 HTTPS 证据、`verification.status=verified`、`riskLevel=routine`、至少一个已确认公开词条且所有关系建议已确认。重大消息、证据不足、关系未确认或风险不确定的候选保留 `needs-review`，不会自动公开。

CI 会在隔离的 `news-auto/<run-id>` 分支上运行上述命令，构建 Docker 候选并检查新闻页、详情 sitemap 与 Xiaobei 邀请制状态，然后创建面向 `dev` 的 PR；是否合并由仓库保护规则决定。这个入口不直接写 `main`、`dev`，也不负责生产 SSH 部署。

## 交接字段

```json
{
  "slug": "source-slug",
  "title": "文章标题",
  "summary": "经过核对的摘要",
  "body": "经过核对的正文",
  "publishedAt": "2026-09-30",
  "isExample": false,
  "source": { "name": "来源名称", "url": "https://example.com/article" },
  "canonicalUrl": "https://example.com/article",
  "sourceHash": "sha256:...",
  "status": "needs-review",
  "discoveredAt": "2026-09-30T12:00:00Z",
  "relatedSlugs": ["grounding"],
  "relationSuggestions": [
    {
      "kind": "term",
      "slug": "grounding",
      "score": 0.86,
      "evidence": ["标题命中词条别名", "摘要明确讨论概念边界"],
      "method": "lexical",
      "status": "confirmed"
    }
  ],
  "relatedArticleSlugs": []
}
```

`relatedSlugs` 和 `relatedArticleSlugs` 只放已经确认的关系；机器建议留在 `relationSuggestions`，并保留 `score`、`evidence`、`method` 和 `status`。来源必须是 HTTPS，`canonicalUrl` 和 `sourceHash` 用来保证重复运行幂等。拒绝或归档的草稿可以保留在目录中，但不会进入公开内容。

## Dots 批次交接

云端 Dots 不需要写仓库文件，返回下面的 JSON（`version` 固定为 `1`）：

```json
{
  "version": 1,
  "runId": "dots-20261001T120000Z",
  "generatedAt": "2026-10-01T12:00:00Z",
  "articles": [
    {
      "slug": "source-slug",
      "title": "经过核对的标题",
      "summary": "经过核对的摘要",
      "body": "正文 Markdown",
      "publishedAt": "2026-10-01",
      "source": { "name": "官方来源", "url": "https://example.com/article" },
      "canonicalUrl": "https://example.com/article",
      "relatedSlugs": ["grounding"],
      "relatedArticleSlugs": [],
      "relationSuggestions": [],
      "evidence": [
        { "url": "https://example.com/article", "claim": "可核验事实", "excerpt": "来源原文短摘录" }
      ],
      "verification": { "status": "verified", "checkedAt": "2026-10-01T12:00:00Z", "method": "dots" },
      "riskLevel": "routine"
    }
  ]
}
```

`npm run news:ingest -- <JSON 路径|->` 会按 `canonicalUrl` 和 `sourceHash` 幂等去重，并将每篇候选写入 `content/zh/news-drafts/<generatedAt 的 UTC 日期>/<slug>.json`。来源清单、事实核对、正文和关系建议由 Dots 负责；仓库只接受 HTTPS、结构化证据和已公开的词条 slug。`isExample` 不能由云端设置为真实内容的示例标记。
