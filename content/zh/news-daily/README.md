# 按天产出记录

`YYYY-MM-DD.json` 是一次按事件发生日整理的独立记录。它把候选检索、来源政策、来源发布日期、候选去重和最终选中结果放在一起；文章正文仍在 `content/zh/news.json`，完整审核草稿仍在 `content/zh/news-drafts/`。

每条候选都要保留：

- `eventDate`：事件真正发生或论文 v1 首次提交的 UTC 日期；
- `publishedAt`：来源页面或论文版本显示的发布日期；两者不同也必须分别记录；
- `sourceType`、`source.url`、`canonicalUrl`、`sourceHash`：阶段二优先官方公告/博客、监管文件、可信新闻报道和可核验的行业/个人解读；论文只在新闻事件已经成立时作为背景，URL 规范化后用指纹去重；
- `evidence`：支持正文事实的短引用卡片；
- `decision`：`selected`、`rejected`、`duplicate` 或 `deferred`，并写明原因；
- `relatedSlugs`：已经确认的公开词条关系。机器建议不能冒充确认关系。

某天没有满足日期和来源政策的候选时，也要写入同一天的 JSON，把 `selectedSlugs` 留空并填写 `gap` 的原因和下一步检索动作。空档日不是把前一天的文章复制过来。

逐日流程（阶段二必须按天完成并提交）：

1. 以目标日期检索候选新闻，先核对事件发生日，再分别记录来源的发布日期；
2. 打开候选的原始页面，按“来源—事实—段落”建立引用卡片，优先保留一手材料和至少一条独立报道；
3. 对同一事件按 canonical URL、sourceHash 和事件事实去重；没有合格事件就记录 `gap`，不拿论文或邻日新闻填空；
4. 先写可自由编排的正文和机制讲解，再制作带来源/许可字段的本地图或动画；
5. 确认公开词条联动，运行 humanizer-zh 检查中文表达，并把完整草稿交给 `codex-subagent-reader` 以零基础读者视角审读；
6. 根据审读意见修订，写入 `readerReview`，通过校验后当天独立提交一个 Git commit。

阶段二允许的候选来源类型包括 `official-announcement`、`official-blog`、`news-report`、`regulatory` 和仅作背景的 `paper`。`paper` 不得在没有对应新闻事件时成为 `selected`。

试跑命令：

```bash
npm run news:catalog > /tmp/vbp-news-catalog.json
npm run news:daily -- --from 2021-01-01 --to 2021-01-07
npm run news:ingest -- /path/to/batch.json
npm run news:auto-publish -- --approve
npm run news:validate
```

`news:daily` 只汇总和检查按天记录，不联网替候选编造来源；候选检索由 News session 按当天的 `search.query` 执行。`news:validate` 会检查日期文件名、候选数量、来源政策、选中关系、词条是否公开以及 canonical URL/sourceHash 重复。历史回溯应按新的日期范围另行建立记录，不能把本试跑目录扩展成全量任务。
