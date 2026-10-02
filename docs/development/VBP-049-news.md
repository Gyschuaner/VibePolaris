# VBP-049 新闻栏目交付记录

状态：Anthropic 与 Google DeepMind 两篇新闻已经依据厂商官方页面写入已发布目录；OpenAI Dots 保持 `needs-review`，没有进入公开目录。实现位于 `feat/VBP-049-news-column`，当前分支已推送到 `origin`，最新提交为 `5468d597d6e1b49b2b8f3b28d7abf95f36c1bc22`。

这次发布不依赖 `NEWS_DOTS_ENDPOINT`，也不要求 `dev` 分支保护。工作流在没有 Dots endpoint 时会跳过外部交接，继续校验仓库内的官方来源内容；如果以后配置 endpoint 或触发 `repository_dispatch`，仍会经过同一套 ingest、事实、来源、词条关系和发布门槛。

## 交付内容

- `content/zh/news.json` 收录两篇真实发布内容：Anthropic Claude Sonnet 5.5、Google DeepMind Private AI Compute；两个条目都带 canonical URL、`sourceHash`、证据和已确认的相关词条。
- `content/zh/news-drafts/2026-10-01/openai-dots-september-2026.json` 保持 `needs-review`，因为官方页面在当前抓取环境返回 403，不能作为可重复自动发布证据。
- `/news`、新闻详情页、sitemap 和 Xiaobei 的 published-only 检索均使用同一份已发布目录；草稿不会出现在公开路由或 sitemap。
- `scripts/news-contract.mjs`、`news:validate`、幂等 ingest、canonical/sourceHash 去重、证据/风险/词条关系门槛继续作为发布闸门。
- `.github/workflows/news-update.yml` 现在把 Dots 作为可选交接入口；无 endpoint 时不会因等待 Dots 失败。

## 官方来源与事实边界

- [Anthropic — Introducing Claude Sonnet 5.5](https://www.anthropic.com/claude-sonnet-5-5)，2026-09-28。文章保留速度、成本和 Terminal-Bench 4.0 数字的厂商归属，没有把自测结果写成独立验证结论。
- [Google DeepMind — Advancing Private AI Compute with secure, server-side memory](https://deepmind.google/blog/advancing-private-ai-compute-with-secure-server-side-memory/)，2026-09-23。文章只记录架构与验证方法，明确不推断所有产品已经普遍可用。
- [OpenAI — Introducing dots](https://openai.com/index/introducing-dots/)，2026-09-29。草稿保留官方页面快照和人工复核要求，状态仍为 `needs-review`。

逐条来源、证据摘录、风险和词条关系记录见 [`news-evidence/2026-10-01-official-sources.md`](news-evidence/2026-10-01-official-sources.md)。

## 已执行校验

- `npm run news:validate`：通过，当前目录统计为 `published=4,drafts=3,pending=1`（两个示例、两篇真实新闻，以及一个待复核 OpenAI 草稿）。
- `npm run typecheck`：通过。
- `git diff --check`：通过。
- News 与 Xiaobei 定向测试中，内容/schema 测试通过；涉及临时 git 仓库的 ingest/pipeline 测试被执行环境禁止 `spawnSync git`（`EPERM`）阻断，属于运行环境限制。

## 尚未完成的外部验收

- 本环境的 Next.js production build 在 Turbopack 创建进程/绑定端口时返回 `Operation not permitted`，因此没有把这次运行误报为构建成功。
- Docker 首次因默认 `/home/agent/.docker` 只读，改用临时 `DOCKER_CONFIG` 后又被 Docker Hub `node:22-alpine` 的 `429 Too Many Requests` 限流；没有可验证的新镜像。
- 生产域名访问被执行环境的代理 `127.0.0.1:8080` 拒绝；工作区没有生产 SSH/部署凭据。因此没有声称线上页面或部署已经完成。
- GitHub Actions 的 workflow 文件已经提交，但该分支提交尚无 workflow run；创建 PR 后需在仓库侧运行 Actions，或在具备 Docker/生产网络凭据的环境完成最后验收。
