# 2026-10-01 真实 AI 新闻来源批次

这批内容只进入 `content/zh/news-drafts/2026-10-01/`，状态均为 `needs-review`。来源均为厂商官方页面；正文保留官方口径，并对厂商自测数据标明归属。抓取时间为 2026-10-01 08:11:49 UTC。

## OpenAI：Introducing dots

- 来源：[OpenAI — Introducing dots](https://openai.com/index/introducing-dots/)
- 发布日期：2026-09-29
- 草稿：`openai-dots-september-2026.json`
- 记录事实：OpenAI 将 Dots 描述为可持续运行的代理，提供独立云端计算机和浏览器，可通过插件连接 4,000 多个应用，并在部分市场向 Pro、Business Premium 和 Enterprise 计划逐步开放。
- 证据摘录：`Dots are remarkably capable, always-on agents built to handle everything.`
- 关系：`agent-harness`、`agent-loop`、`tools`，均在草稿中标记为人工确认。

OpenAI 页面在本机直接抓取时返回 403，因此用浏览器文本抓取保存官方页面正文快照并计算 `sourceHash`；草稿的 `verification.notes` 已明确记录这一点。发布前仍需编辑打开上面的 canonical URL 复核快照和开放范围。

## Anthropic：Claude Sonnet 5.5

- 来源：[Anthropic — Introducing Claude Sonnet 5.5](https://www.anthropic.com/claude-sonnet-5-5)
- 发布日期：2026-09-28
- 草稿：`anthropic-claude-sonnet-5-5-september-2026.json`
- 记录事实：Anthropic 称 Sonnet 5.5 相较 Sonnet 5 速度提升 30% 以上、单任务成本最多降低 30%，并披露 Terminal-Bench 4.0 的 70.6% 自测结果；页面同时说明复杂开放任务仍由 Opus 5.5 更强。
- 证据摘录：`It runs 30%+ faster and costs up to 30% less for most work.`
- 关系：`agent-loop`、`benchmark`、`evaluation-dataset`、`tools`，均在草稿中标记为人工确认。

评测数字和价格是厂商发布口径，草稿正文没有把它们写成独立验证结果。

## Google DeepMind：Private AI Compute

- 来源：[Google DeepMind — Advancing Private AI Compute with secure, server-side memory](https://deepmind.google/blog/advancing-private-ai-compute-with-secure-server-side-memory/)
- 发布日期：2026-09-23
- 草稿：`google-private-ai-compute-memory-september-2026.json`
- 记录事实：Google DeepMind 介绍服务器端持久记忆架构，数据进入加密存储，解密密钥由用户设备持有，请求在硬件隔离环境中处理，并通过端到端加密通道传输。
- 证据摘录：`A technical update on our Private AI Compute architecture, which will enable persistent, cross-device AI memory.`
- 关系：`memory`、`retrieval`、`agent-harness`，均在草稿中标记为人工确认。

这篇文章是架构说明和验证方法更新，草稿明确写出它不等同于所有产品已经普遍可用。

## 校验状态

```text
npm run news:validate                         passed (published=2,drafts=3,pending=3)
npm run news:publish -- <three draft files>   dry-run passed (publishedCount=5)
npm run news:auto-publish                     dry-run passed (slugs=[])
```

三篇草稿都保留 `evidence`、`verification.status=verified`、`riskLevel=routine` 和 `publishDecision=review`。`news:auto-publish` 没有提升它们，因为编辑审查原因仍存在；这批内容不会进入公开页面或 Xiaobei 检索，直到人工确认后执行 feature 分支上的 `news:publish --approve`，再通过受保护的 `dev` PR。
