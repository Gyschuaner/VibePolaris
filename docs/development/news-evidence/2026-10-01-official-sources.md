# 2026-10-01 真实 AI 新闻来源批次

这批内容只进入 `content/zh/news-drafts/2026-10-01/`，状态均为 `needs-review`。来源均为厂商官方页面；正文保留官方口径，并对厂商自测数据标明归属。抓取时间为 2026-10-01 08:11:49 UTC。

## OpenAI：Introducing dots

- 来源：[OpenAI — Introducing dots](https://openai.com/index/introducing-dots/)
- 发布日期：2026-09-29
- 草稿：`content/zh/news-drafts/2026-10-02/openai-dots-september-2026.json`
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

为了验证发布路径而不改变当前仓库，我在临时 Git feature 分支上复制了这批草稿并运行 `news:publish --approve`：结果为 `publishedCount=5`，随后临时仓库 `news:validate` 为 `published=5,drafts=3,pending=0`。当前工作分支的 `content/zh/news.json` 没有被写入，生产环境也没有发布。

## 自动发布判断

- Anthropic 和 Google DeepMind 的 canonical URL 在本机链接检查中返回 HTTP 200。编辑确认中文表述和厂商数字后，可以把 `publishDecision` 改为 `auto` 并清空 `reviewReasons`，满足 routine、verified、evidence 和 confirmed relations 门槛后进入自动提升。
- OpenAI 的官方页面在本机 `curl` 返回 HTTP 403；浏览器来源可以打开，草稿使用 2026-10-01 保存的官方页面文本快照计算 `sourceHash`。这足以作为人工复核材料，但不足以作为可重复的自动发布证据。OpenAI 草稿必须保持人工确认，直到编辑能够从 canonical URL 复核页面或补充可重复的官方抓取快照。

## Dots 交接所需配置和权限

- `NEWS_DOTS_ENDPOINT`：必填的 HTTPS 只读 JSON 端点，返回 `version=1` 的批次；脚本只发 GET，并要求 `Accept: application/json`。
- `NEWS_DOTS_TOKEN`：可选的 endpoint 访问令牌，脚本只作为 `Authorization: Bearer` 发送。最小权限是读取新闻交接端点，不需要仓库写权限、生产 SSH 权限或其他 API 范围。
- GitHub Actions 的 `GITHUB_TOKEN` 当前声明 `contents: write` 和 `pull-requests: write`，这是创建隔离 `news-auto/<run-id>` 分支、推送候选和创建/自动合并 dev PR 所需的最小仓库范围；工作流没有 `id-token`、部署密钥或生产主机权限。
- `repository_dispatch` 是另一条输入路径，由外部调用方发送 `dots-news` payload；它不读取 `NEWS_DOTS_ENDPOINT`，但仍经过同一 schema、去重、证据和关系门槛。
