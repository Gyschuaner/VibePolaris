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

仓库不会自动读取草稿渲染页面或回答 Xiaobei。先运行：

```bash
npm run news:validate
```

校验通过、完成事实核对并把 `status` 改为 `needs-review` 后，由人工在 feature 分支上预览提升结果：

```bash
npm run news:publish -- content/zh/news-drafts/2026-09-30/example-slug.json
```

只有明确加入 `--approve` 才会写入 `content/zh/news.json`；原草稿会保留为 `status: "published"` 的审计记录。这个命令只提升本地内容，不会提交、push、合并或部署。随后运行 `npm run build`，经 PR 审核、集成和部署验证后才算上线；生产六小时调度暂未启用。

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
