# 新闻草稿交接目录

云端采集程序把每条待审核新闻写成一个 JSON 文件，路径固定为：

```text
content/zh/news-drafts/YYYY-MM-DD/<slug>.json
```

仓库不会自动读取草稿渲染页面或回答 Xiaobei。先运行：

```bash
npm run news:validate
```

校验通过、完成事实核对并把 `status` 改为 `needs-review` 后，由人工在 feature 分支上预览提升结果：

```bash
npm run news:publish -- content/zh/news-drafts/2026-09-30/example-slug.json
```

只有明确加入 `--approve` 才会写入 `content/zh/news.json`；原草稿会保留为 `status: "published"` 的审计记录。随后运行 `npm run build`，构建成功后合并 PR 才算发布。

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
