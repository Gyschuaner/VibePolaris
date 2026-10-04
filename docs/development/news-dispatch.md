# News Dots 交接

主链路使用 GitHub repository_dispatch，事件类型固定为 dots-news。云端整理任务完成后，把符合 News schema 的批次放进 client_payload：

~~~json
{
  "event_type": "dots-news",
  "client_payload": {
    "version": 1,
    "runId": "dots-2026-10-02T02:00:00Z",
    "generatedAt": "2026-10-02T02:00:00Z",
    "articles": [
      {
        "slug": "example-news",
        "title": "Example",
        "summary": "A verified summary.",
        "body": "The article body.",
        "eventDate": "2026-10-01",
        "publishedAt": "2026-10-02",
        "source": {
          "name": "Official source",
          "url": "https://example.com/announcement"
        },
        "canonicalUrl": "https://example.com/announcement",
        "relatedSlugs": ["api"],
        "relatedArticleSlugs": [],
        "evidence": [
          {
            "url": "https://example.com/announcement",
            "claim": "The source confirms the announcement.",
            "excerpt": "Short supporting excerpt."
          }
        ],
        "riskLevel": "routine",
        "verification": {
          "status": "verified",
          "checkedAt": "2026-10-02T02:00:00Z",
          "method": "source"
        },
        "modelReview": {
          "decision": "publish",
          "checkedAt": "2026-10-02T02:00:00Z"
        }
      }
    ]
  }
}
~~~

发送示例（token 只存在于云端任务环境或 GitHub Actions secret，不写入仓库）：

~~~bash
curl --fail-with-body -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/Gyschuaner/VibePolaris/dispatches \
  --data-binary @dispatch.json
~~~

Actions 收到事件后会：

1. 把 client_payload 写入临时文件，并限制为 1 MiB。
2. 用 lib/news-ingest.ts 的严格 Zod schema 校验 slug、日期、HTTPS 来源、canonical URL、关联 slug、证据和可选审读字段。
3. 在 content/zh/news-drafts/<eventDate>/<slug>.json 写入 needs-review 草稿。slug、canonical URL、sourceHash 和同批次键都会去重；重复投递返回 duplicate，不会覆盖已有文件。
4. news:auto-publish -- --approve 只提升 routine + verified + modelReview.publish 的候选，其余保持 needs-review。
5. 在隔离的 news-auto/<run_id> 分支构建候选、提交并创建受保护的 dev PR。

NEWS_DOTS_ENDPOINT / NEWS_DOTS_TOKEN 只保留旧的 Actions 拉取兼容路径；它们不是主闭环，也不代表本项目部署了一个公网 POST 服务。当前实现没有部署云端 endpoint，也没有修改 GitHub secrets。

本地 producer 模拟：

~~~bash
cat > /tmp/dots-payload.json <<'JSON'
{
  "version": 1,
  "runId": "local-demo-1",
  "generatedAt": "2026-10-02T02:00:00Z",
  "articles": [{
    "slug": "local-demo",
    "title": "Local demo",
    "summary": "Demo",
    "body": "Demo body",
    "eventDate": "2026-10-01",
    "publishedAt": "2026-10-02",
    "source": {"name": "Example", "url": "https://example.com/a"},
    "canonicalUrl": "https://example.com/a",
    "relatedSlugs": [],
    "relatedArticleSlugs": [],
    "evidence": [{"url": "https://example.com/a", "claim": "demo", "excerpt": "demo"}]
  }]
}
JSON
NEWS_REPOSITORY=/tmp/vibepolaris-news-demo npm run news:ingest -- /tmp/dots-payload.json
NEWS_REPOSITORY=/tmp/vibepolaris-news-demo npm run news:ingest -- /tmp/dots-payload.json
NEWS_REPOSITORY=/tmp/vibepolaris-news-demo npm run news:validate
~~~

第二次 ingest 应报告 duplicates，且不会覆盖第一次写入的草稿。
