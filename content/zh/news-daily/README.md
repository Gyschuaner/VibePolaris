# 按天产出记录

`YYYY-MM-DD.json` 是一次按事件发生日整理的独立记录。它把候选检索、来源政策、来源发布日期、候选去重和最终选中结果放在一起；文章正文仍在 `content/zh/news.json`，完整审核草稿仍在 `content/zh/news-drafts/`。

每条候选都要保留：

- `eventDate`：事件真正发生或论文 v1 首次提交的 UTC 日期；
- `publishedAt`：来源页面或论文版本显示的发布日期；两者不同也必须分别记录；
- `sourceType`、`source.url`、`canonicalUrl`、`sourceHash`：来源优先官方公告/博客、论文原文和监管文件，URL 规范化后用指纹去重；
- `evidence`：支持正文事实的短引用卡片；
- `decision`：`selected`、`rejected`、`duplicate` 或 `deferred`，并写明原因；
- `relatedSlugs`：已经确认的公开词条关系。机器建议不能冒充确认关系。

某天没有满足日期和来源政策的候选时，也要写入同一天的 JSON，把 `selectedSlugs` 留空并填写 `gap` 的原因和下一步检索动作。空档日不是把前一天的文章复制过来。

试跑流程：

```bash
npm run news:catalog > /tmp/vbp-news-catalog.json
npm run news:daily -- --from 2021-01-01 --to 2021-01-07
npm run news:ingest -- /path/to/batch.json
npm run news:auto-publish -- --approve
npm run news:validate
```

`news:daily` 只汇总和检查按天记录，不联网替候选编造来源；候选检索由 News session 按当天的 `search.query` 执行。`news:validate` 会检查日期文件名、候选数量、来源政策、选中关系、词条是否公开以及 canonical URL/sourceHash 重复。历史回溯应按新的日期范围另行建立记录，不能把本试跑目录扩展成全量任务。
