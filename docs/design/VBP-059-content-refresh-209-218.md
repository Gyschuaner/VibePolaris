# VBP-059 · AI 技术栈与安全边界词条 209–218

本批按 `vibepolaris-concept-pages` 逐条重做十个已有词条。用户要求每条单独修改、十条完成后统一公开和发布；其他 `dev` 功能只留在集成环境。用户明确不使用 ZCode CLI，本批未调用 ZCode。资料、正文、演示和中文表达由主助手完成，唯一 review 子智能体为 `/root/ai_stack_review`。

需求：`VBP-059`（DP ID `f2f1131d-5a53-40ce-81fe-7bfc5b342e1d`）

## 词条范围与资料

每条词条都有独立读者任务、段落级来源角标、概念专属演示、边界说明和失败/拒绝分支。研究底稿在 `content/zh/term-research/ai-stack.json`，来源映射在 `lib/ai-stack-concept-sources/`。

| slug | 演示要点 | 已核对来源 |
| --- | --- | --- |
| `container-image` | 从 Dockerfile 层和镜像摘要到可运行实例；改动后只重建受影响层 | OCI Image Spec、Docker image layers、Docker storage、storage drivers、NIST SP 800-190 |
| `service-discovery` | 服务名解析、EndpointSlice 变化、无可用后端时的失败 | Kubernetes DNS/Service/EndpointSlice、NIST SP 800-204、Consul DNS |
| `observability` | traces、metrics、logs 与 context propagation 对齐；缺信号时不猜内部状态 | OpenTelemetry signals/primer/logs/context、Kubernetes observability |
| `sast` | 不运行程序分析数据流；源码路径命中与无法判断分别呈现 | OWASP source analysis/code review、CodeQL、NIST SSDF、OWASP SQL injection prevention |
| `secret-scanning` | 提交前发现凭据、push protection 阻断、已泄露凭据进入轮换流程 | GitHub secret scanning/push protection/API、OWASP secrets、NIST SP 800-57 |
| `dependency-scanning` | 实际版本匹配 advisory；锁文件、路径和修复版本逐步改变 | OWASP supply chain、GitHub Dependabot alerts/updates、OWASP SBOM、OSV schema |
| `threat-modeling` | 资产—入口—信任边界—滥用路径—缓解措施逐项推演 | OWASP threat modeling、NIST SP 800-154、Microsoft threat modeling、CISA Secure by Design |
| `tool-approval` | 工具调用在高影响动作前暂停；批准、拒绝和参数不合规各自停下 | OpenAI Agents HITL/tools/MCP、MCP Tools 2025-06-18、MCP server draft |
| `permission-boundary` | 请求穿过资源边界时按主体、动作、资源和条件校验；拒绝不等于重试 | NIST RBAC/least privilege、OWASP Authorization、MCP authorization、NIST SP 800-162 |
| `xss` | 不可信字符串进入 HTML 上下文时被编码或拒绝；`textContent` 与 `innerHTML` 对照 | OWASP XSS prevention/attack、MDN `innerHTML`/`textContent`/Trusted Types |

## 实现与逐条验收

- 功能分支从当时的 `origin/main` 创建：`feat/VBP-059-ai-stack-209-218`。十条词条分别提交，之后 `d918237e` 一次把十个 slug 加入 `content/zh/published-terms.json`。
- 每条均由 `/root/ai_stack_review` 单独审读；审读中发现的引用映射、重复锚点、演示状态和无用导入问题均已修正。没有调用 ZCode CLI。
- 每条完成 `npm run build`、TypeScript 检查和真实浏览器桌面/390px 验收；资料展开、关键演示状态、失败分支和窄屏无横向溢出均已抽查。全仓 `npm run check` 未执行，原因是既有历史 lint 门禁超出本批范围。
- 统一公开后的干净主干内容分支 `release/VBP-059-main-content-209-218` 构建通过，生成 217 个静态页面；PR #290 已合入 `main`，合并提交 `f5267a73ec8b252740efd70fda4a956c59802cdc`。
- `dev` 合并 PR #289 后的提交为 `cda75b3f41123aa1113741b97c376562768195fc`；本机 dev 预览 `http://127.0.0.1:3004` 复查十条入口和 390px 布局，DP 部署记录为 `local-dev-20261002-vbp059-cda75b3`（`2ec9b593-bca6-4fc2-b547-d59256e9cc31`）。

## 生产发布

生产 overlay 从线上上一版 `release/VBP-058-corrected-prod-overlay-20261002`（`044ef431`）切出，只叠加本批十条词条和公开清单，保留生产新闻及其他线上功能。overlay 分支为 `release/VBP-059-prod-overlay-20261003`，生产提交 `0b81e61cc51a64265efa7b73387f12ec0edf91bb`。

- `linux/amd64` 镜像构建通过，镜像标签为 `vibepolaris:0b81e61cc51a64265efa7b73387f12ec0edf91bb`。
- release 目录：`/opt/vibepolaris/releases/20261002T175727Z-0b81e61c`；切换前备份：`/opt/vibepolaris/backups/20261002T175727Z-from-044ef431`。Xiaobei 数据卷未改动。
- 容器 `vibepolaris-web-1` 为 `running/healthy`；公网 `/`、`/news` 和十条词条均返回 HTTP 200，真实浏览器桌面和 390px 窄屏复查通过。
- DP 部署记录 `deploy-vbp059-content-209-218-prod-20261002`，ID `3544a08e-72c4-4fb5-9e3c-eff484ab102e`，状态 `released`。VBP-059 已按 `testing → ready_for_release → released` 流转，十个研发任务均为 `done`，质量门禁通过。
- 回滚时恢复备份 compose 与镜像 `vibepolaris:044ef4317883be7b68903c126680bb38122571e7`，将 `/opt/vibepolaris/current` 指回 `/opt/vibepolaris/releases/20261002T150439Z-044ef431`；保留新版本产生的数据，不覆盖 `xiaobei_data`。

当前机器不存在 `D:/Obsidian/gysnote`，未创建空的 Obsidian 记录。
