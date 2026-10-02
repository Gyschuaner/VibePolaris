# VBP-049 新闻栏目交付记录

状态：阶段一已在 `feat/VBP-049-news-column` 完成 2021-01-01 至 2021-01-07 七天试跑；阶段二正在 `feat/VBP-049-news-backfill-news` 按新闻事件逐日回溯 2021-01-08 至 2026-10-02。本分支不合并 `dev`、不部署生产；论文不再作为阶段二的主事件来源。

这次发布不依赖 `NEWS_DOTS_ENDPOINT`，也不要求 `dev` 分支保护。工作流在没有 Dots endpoint 时会跳过外部交接，继续校验仓库内的官方来源内容；如果以后配置 endpoint 或触发 `repository_dispatch`，仍会经过同一套 ingest、事实、来源、词条关系和发布门槛。

## 阶段二执行口径

- 每个事件日有独立的 `content/zh/news-daily/YYYY-MM-DD.json`，保留检索式、候选、事件日、来源发布日期、原始链接、引用卡片、去重决策和空档日原因。
- 主事件优先取官方公告/官方博客、监管文件、可信新闻报道和可核验的行业或个人解读；论文只作为已成立新闻事件的背景来源，不能单独填充 `selectedSlugs`。
- 文章先写事实链和读者问题，再组织按事件需要变化的正文段落、讲解步骤和自制 SVG；`hero.sourceUrl`、许可和引用卡片都保留追溯信息。
- 词条关系只确认已经公开且正文确实解释的 slug。草稿在 `ready` 前必须经过 humanizer-zh 表达检查与 `codex-subagent-reader` 零基础读者审读，审读结果写入 `readerReview`。
- 每完成一个事件日就创建独立 Git 提交；空档日也提交按天记录，不复制邻日文章。

### 单日闭环（阶段二新口径）

候选脚本只负责记录当天的检索式、候选事件、日期字段、来源卡片、去重判断和空档日原因；正文、段落组织、讲解步骤、词条联动和头图由主助手针对当天事件逐篇手写。不同事件可以采用不同的叙事顺序，不把论文摘要或固定段落批量改写成新闻。

每个事件日依次完成新闻信源核验、正文与演示编写、Codex 子智能体零基础读者审读、中文表达审读、`news:validate`、单次构建/定向页面检查和一次独立提交。子智能体审读是内容可读性检查，不等同于真实用户访谈；论文仅在新闻事件已经成立时补充背景。

### 阶段二已完成样本

| 事件日 | 选中事件 | 主来源 | 事件日 / 报道日 | 子智能体审读 | 提交 |
| --- | --- | --- | --- | --- | --- |
| 2021-01-08 | Waste-Free World AI 塑料回收试点 | Circular Online（新闻报道）；WebWire 企业新闻稿作一手核验 | 2021-01-08 / 2021-01-12 | `passed`（先 `needs-revision`，按建议修订后通过） | `9a7cb072` |
| 2021-03-01 | 警务 AI 产品特写：转写、脱敏、车牌识别与加密货币分析 | Police Chief Magazine；VIQ、Veritone、Jenoptik 官方产品页；加州 DOJ AB 953 规则 | 2021-03-01 / 2021-03-01 | `passed`（子智能体读者与中文审读，按来源卡片建议修订） | `53037828` |
| 2021-03-02 | Azure Percept 进入公开预览：边缘设备、现场推理与云端管理 | Microsoft News Center；Azure Blog、Ignite Book of News；TechCrunch 同日交叉报道 | 2021-03-02 / 2021-03-02 | `passed`（两轮子智能体读者与中文审读） | `60aef89c` |
| 2021-03-03 | AI Index 2021：AI 走向产业实践，数据盲区也更明显 | Stanford HAI 官方公告与报告；Axios 同日报道 | 2021-03-03 / 2021-03-03 | `passed`（两轮子智能体读者与中文审读） | `ce2cc3d4` |
| 2021-03-04 | OpenAI 拆开 CLIP 的视觉神经元：能解释，也可能被文字骗过 | OpenAI 官方博客；Axios 同日报道；Distill 原文作技术背景 | 2021-03-04 / 2021-03-04 | `passed`（两轮子智能体读者与中文审读） | `53f47f96` |
| 2021-03-05 | MHRA 关注 Babylon AI 分诊聊天机器人：报道提出英国医疗监管空档 | TechCrunch 同日报道；MHRA GOV.UK 执法说明与 Yellow Card 安全报告页面作制度背景 | 2021-03-05 / 2021-03-05 | `passed`（两轮子智能体读者与中文审读） | `fe3508e9` |
| 2021-03-06 | 空档日：观点文章与前日回顾，未确认新的当天 AI 事件 | Financial Express 观点文章；Tech Xplore 前日新闻汇总；Microsoft 官方页核对 Power Fx 为 03-02 | — | `n/a`（空档日，无文章） | `356b90d2` |
| 2021-03-07 | 空档日：研究汇总与跨日官方发布，未确认新的当天 AI 事件 | Brightsurf 科学新闻汇总；CAIDP 月度政策回顾；MIT News 核对 CARRL 实际为 03-08 | — | `n/a`（空档日，无文章） | `1abd0f5e` |
| 2021-03-08 | MIT 研究团队提出 CARRL：让强化学习在传感器不可靠时先按最坏情况选动作 | MIT News；arXiv、MIT Aerospace Controls Laboratory 与作者发表列表作方法和出处背景 | 2021-03-08 / 2021-03-08 | `passed`（两轮 Codex 子智能体读者与中文审读） | `55c7a784` |
| 2021-03-09 | KPMG 调查：企业 AI 采用在加速，治理担忧也在升温 | KPMG/PR Newswire；KPMG 官方报告与介绍页；Fortune 同日报道 | 2021-03-09 / 2021-03-09 | `passed`（两轮 Codex 子智能体读者与中文审读） | `501ed3f8` |

## 交付内容

- `content/zh/news.json` 保留原有两篇 2026 真实发布内容：Anthropic Claude Sonnet 5.5、Google DeepMind Private AI Compute；七篇阶段一试跑文章另见下方逐日记录。所有真实条目都带 canonical URL、`sourceHash`、证据和已确认的相关词条。
- `content/zh/news-drafts/2026-10-01/openai-dots-september-2026.json` 保持 `needs-review`，因为官方页面在当前抓取环境返回 403，不能作为可重复自动发布证据。
- `/news`、新闻详情页、sitemap 和 Xiaobei 的 published-only 检索均使用同一份已发布目录；草稿不会出现在公开路由或 sitemap。
- `scripts/news-contract.mjs`、`news:validate`、幂等 ingest、canonical/sourceHash 去重、证据/风险/词条关系门槛继续作为发布闸门。
- `.github/workflows/news-update.yml` 现在把 Dots 作为可选交接入口；无 endpoint 时不会因等待 Dots 失败。

## 2026-10-02 阶段一：逐日试跑

DP 研发任务：`a9fe492c-5e3d-44ec-99d9-5101746794ed`（VBP-049，进行中）。本阶段只写入 `2021-01-01` 至 `2021-01-07`，没有启动 2021-now 全量回溯，也没有合并 `dev` 或部署生产。

| 事件日 | 选中事件 | 主题 | 来源 | 文章 slug |
| --- | --- | --- | --- | --- |
| 2021-01-01 | 1 | EfficientQA 与问答内存预算 | 论文原文 | `efficientqa-memory-budget-20210101` |
| 2021-01-02 | 1 | VinVL 的视觉表示 | 论文原文 | `vinvl-visual-representations-20210102` |
| 2021-01-03 | 1 | 少样本特征库与简单分类器 | 论文原文 | `few-shot-feature-library-20210103` |
| 2021-01-04 | 1 | 让智能体读论文与写作 | 论文原文 | `agent-read-write-20210104` |
| 2021-01-05 | 1 | OpenAI CLIP | 官方研究公告 | `clip-natural-language-supervision-20210105` |
| 2021-01-06 | 1 | TextBox 文本生成框架 | 论文原文 | `textbox-text-generation-framework-20210106` |
| 2021-01-07 | 1 | OOD 检测的场景化评测 | 论文原文 | `ood-detection-evaluation-scenarios-20210107` |

每天的候选、检索式、来源 URL、`eventDate`、`publishedAt`、指纹、证据摘录、关系和决策独立保存在 [`content/zh/news-daily/`](../../content/zh/news-daily/)；文章草稿保留在按发现日分区的 `content/zh/news-drafts/2026-10-02/`。1 月 5 日的 DALL·E 官方公告候选被记录为 `deferred`，原因是本试跑每天只选一个主事件，并没有把它悄悄丢掉。按天校验器同时支持明确 `gap` 记录，空档日不会复制邻日内容。

七篇文章都使用原始论文或 OpenAI 官方研究页，带 2 张引用卡片、按事件组织为 3–5 个可自由编排的正文段落、站内公开词条关系和本地自制 SVG 头图；头图记录 `sourceUrl` 与 CC BY 4.0 许可，NewsExplainer 通过 `benchmark` / `agent-workflow` 两种机制步骤辅助理解。`eventDate` 和 `publishedAt` 在内容、草稿、按天候选中分别保留，即使本试跑的七篇恰好同日。

## 历史记录：2026-10-01 原有内容

### 官方来源与事实边界

- [Anthropic — Introducing Claude Sonnet 5.5](https://www.anthropic.com/claude-sonnet-5-5)，2026-09-28。文章保留速度、成本和 Terminal-Bench 4.0 数字的厂商归属，没有把自测结果写成独立验证结论。
- [Google DeepMind — Advancing Private AI Compute with secure, server-side memory](https://deepmind.google/blog/advancing-private-ai-compute-with-secure-server-side-memory/)，2026-09-23。文章只记录架构与验证方法，明确不推断所有产品已经普遍可用。
- [OpenAI — Introducing dots](https://openai.com/index/introducing-dots/)，2026-09-29。草稿保留官方页面快照和人工复核要求，状态仍为 `needs-review`。

逐条来源、证据摘录、风险和词条关系记录见 [`news-evidence/2026-10-01-official-sources.md`](news-evidence/2026-10-01-official-sources.md)。

### 已执行校验

- `npm run news:validate`：通过，当前目录统计为 `published=4,drafts=3,pending=1`（两个示例、两篇真实新闻，以及一个待复核 OpenAI 草稿）。
- `npm run typecheck`：通过。
- `git diff --check`：通过。
- News 与 Xiaobei 定向测试中，内容/schema 测试通过；涉及临时 git 仓库的 ingest/pipeline 测试被执行环境禁止 `spawnSync git`（`EPERM`）阻断，属于运行环境限制。

### 尚未完成的外部验收

- 本环境的 Next.js production build 在 Turbopack 创建进程/绑定端口时返回 `Operation not permitted`，因此没有把这次运行误报为构建成功。
- Docker 首次因默认 `/home/agent/.docker` 只读，改用临时 `DOCKER_CONFIG` 后又被 Docker Hub `node:22-alpine` 的 `429 Too Many Requests` 限流；没有可验证的新镜像。
- 生产域名访问被执行环境的代理 `127.0.0.1:8080` 拒绝；工作区没有生产 SSH/部署凭据。因此没有声称线上页面或部署已经完成。
- GitHub Actions 的 workflow 文件已经提交，但该分支提交尚无 workflow run；创建 PR 后需在仓库侧运行 Actions，或在具备 Docker/生产网络凭据的环境完成最后验收。

#### 2026-10-01 内容叙事与直发改版（本地验证完成，待集成）

DP 任务：`4fd618eb-43f5-41f1-905a-8f74cd4421e2`（News 详细文章结构与模型首轮直发改版）。功能分支在现有 `feat/VBP-049-news-column` 上继续实现，未把本次自动发布改动部署到生产。

- 公开文章新增可自由编排的 `hero`、Markdown `body`、`sections[]` 段落和 `sources` 引用卡片字段；每篇文章可以按自己的事实链路安排叙事，详情页沿用词条的目录/阅读轨道，并提供可暂停、可重播、尊重 reduced-motion 的 `explainer` 机制动画。头图要求可追溯 URL 与明确许可，当前两篇公开文章使用仓库自制 SVG 并标注 CC BY 4.0。
- ingest 接收 `modelReview` 首轮自判；自判为 `publish` 且机械字段通过的记录写为 `ready`，同一轮 `news:auto-publish -- --approve` 直接提升。模型暂缓或机械字段缺失的记录保留 `needs-review`。
- 机械保护继续检查 canonical URL、sourceHash、结构版式、头图来源/许可、可用链接、去重、非空正文和站内关系目标；没有按文章风格增加二次人工内容审查。
- 本次改动仅在本地验证，未合并 `dev`、未启用生产自动直发、未部署生产。`npm run news:validate` 通过（`published=2,drafts=3,pending=1`）；News 内容/ingest/pipeline 定向测试 5 项通过；`npm run typecheck`、定向 ESLint 和 `npm run build` 通过（120 个静态页面）。
- `NEWS_EXPECTED_SLUGS='anthropic-claude-sonnet-5-5-september-2026,google-private-ai-compute-memory-september-2026' npm run news:smoke -- http://127.0.0.1:3200` 通过；本地浏览器实际切换四步讲解、暂停/重播并确认目录、来源卡片和关联链接可见。
