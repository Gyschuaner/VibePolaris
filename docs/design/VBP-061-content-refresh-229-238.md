# VBP-061 · AI Agent 上下文、记忆与检索词条 229–238

本批按 `vibepolaris-concept-pages` 逐条重做十个已有词条。每条独立完成资料研究、面向零基础读者的正文、段落级来源映射、概念专属演示、边界与失败分支、TypeScript/build 和真实浏览器验收，并保留独立提交；十条完成后才作为一个批次合入和发布。用户明确不调用 ZCode CLI，本批未调用 ZCode。审读只复用唯一 review 子智能体 `/root/ai_stack_review`，没有创建其他协作者。

需求：`VBP-061`（DP ID `099b1cc4-856c-4a22-8562-a3bf4e324520`）
父需求：`VBP-012`（全站概念词条分批升级与补全）
功能分支：`feat/VBP-061-ai-context-retrieval-229-238`，从 `origin/main` `7b64a523` 建立。

## 范围、机制与资料

研究底稿统一在 `content/zh/term-research/ai-stack.json`，十条每条恰好 5 个已实际打开的官方或规范来源；引用模块在 `lib/ai-stack-concept-sources/`，每条引用 ID 与正文段落锚点一一对应。批次演示元数据在 `content/zh/term-batches/ai-stack.json`，每条 3 个步骤。35 个唯一来源 URL 均返回 HTTP 200。

| slug | 独立读者任务与可观察边界 |
| --- | --- |
| `context-window` | 调整历史长度，观察输入/输出预算如何裁剪；长历史先处理输入，不能假装全部可见 |
| `agent-loop` | 推进读取、行动、观察和停止条件；达到最大轮次时停止并保留待修复项 |
| `agent-memory` | 在同意后保存、取回和删除记录；未同意时为空，删除后旧回答不能倒写 |
| `working-memory` | 从候选状态压缩到当前任务需要的临时状态；交付后清理临时状态，只保留结果 |
| `execution-sandbox` | 逐项打开文件、网络和时间能力；权限未开时阻断，全部打开后环境仍会销毁 |
| `embedding` | 改变查询文本观察向量邻近候选变化；相似度只是检索线索，不是事实结论 |
| `vector-store` | 先看全部近邻，再加版本元数据过滤；过滤会减少候选，不能替代内容核验 |
| `retrieval` | 在 top-1 与 top-3 间选择候选数；检索停止在候选资料，不直接生成结论 |
| `chunking` | 比较块大小和重叠量；相邻条件跨块时，重叠规则决定能否保留命中 |
| `reranking` | 用更精细的查询相关性重排已召回候选；漏召回的候选不会被重排凭空补回 |

十个 slug 原本已在 `content/zh/published-terms.json`，本批不重复修改公开清单，只刷新已公开路由的正文、研究底稿和演示实现。

## 逐条提交与 DP 任务

| 词条 | commit | DP 任务 | 状态 |
| --- | --- | --- | --- |
| `context-window` | `22935b94` | `5dfcd8c0-4546-498d-a396-e47a346e95a7` | done |
| `agent-loop` | `50170c90` | `4a83bd4c-4733-4c48-a73e-2a1295eae968` | done |
| `agent-memory` | `0803feed` | `a55ce971-3796-4e06-85c0-24646ddddd36` | done |
| `working-memory` | `5a7cbd30` | `e92c5c02-e556-4d97-a10d-79bc5f93442b` | done |
| `execution-sandbox` | `25c5e09f` | `d2623349-6703-40bf-ba74-387e16486e0d` | done |
| `embedding` | `25cc24d1` | `73d3f533-82be-416c-887e-ca02bd5187c3` | done |
| `vector-store` | `7466cae1` | `9c811401-bdee-4b43-b250-286735bf7703` | done |
| `retrieval` | `1db35c2f` | `b5ccfdec-de13-4f5b-9888-7b2517d721d4` | done |
| `chunking` | `a3e18bee` | `83c161db-7ffc-435e-ac2d-519f6a5b4ad9` | done |
| `reranking` | `dd1d3eb7` | `ea6b35fb-525f-4810-ba72-6203985a1429` | done |

## 验收证据

- 十条逐条运行 `npx tsc --noEmit` 与 `npm run build`；从 clean main scope 重新构建生成 217/217 静态页。生产 Docker `linux/amd64` 构建再次通过并生成 217/217。
- 本地 dev 集成提交为 `e3445475525fdb8cbb32146a5161628ab9a7c3b5`，DP 部署记录为 `local-dev-20261003-vbp061-e3445475`；十条路由均 HTTP 200，并在真实浏览器验证上下文窗口长历史裁剪分支。
- 生产冒烟逐条打开十个公网路由，均看到对应 H1 和参考资料；再次点击 `context-window` 的“长历史 · 15k”，观察到“先处理输入，不能假装全部可见”。
- 最终静态审计确认十条路由、页面、Lesson、来源模块和索引均已注册；每条 5 个来源、3 个演示步骤、引用锚点无 stale/缺失/重复 DOM ID。
- `npm run check` 未执行；本批验收范围使用逐条 TypeScript/build、静态审计和受影响页面的真实浏览器路径，未扩大到无关的全仓门禁。

## 合入与生产发布

- dev PR [#296](https://github.com/Gyschuaner/VibePolaris/pull/296) 已合并，合并提交：`e3445475525fdb8cbb32146a5161628ab9a7c3b5`。
- main PR [#297](https://github.com/Gyschuaner/VibePolaris/pull/297) 合并后发现 `dev` 上尚未纳入本批的新闻流水线改动被一并带入；范围纠正 PR [#298](https://github.com/Gyschuaner/VibePolaris/pull/298) 已合并，将 main 恢复为只含 VBP-061 的目标树。最终 main 提交：`be71d284ea650eb232dbbaaa28ee535fae70d4a5`，新闻等其他 dev 功能留在本地/dev。
- 生产 overlay 分支：`release/VBP-061-prod-overlay-20261003`；部署镜像：`vibepolaris:be71d284ea650eb232dbbaaa28ee535fae70d4a5`。
- DP 部署记录：`deploy-vbp061-ai-context-retrieval-229-238-prod-20261003`（ID `c8dee670-c325-4399-b12f-9a8fe61eb436`），状态 `released`，环境 `production`，地址 `https://vibe.chuansgu.top`。
- 发布目录：`/opt/vibepolaris/releases/20261003T033054Z-be71d284`；切换后 `vibepolaris-web-1` 为 `healthy`，根路径和十条词条均 HTTP 200。
- 回滚备份：`/opt/vibepolaris/backups/20261003T033054Z-from-a3160952`；旧镜像：`vibepolaris:a3160952b56d675f41af6c49d92c1289ae8bd086`。回滚时恢复备份中的 `current`、compose 和旧镜像，保留 `vibepolaris_xiaobei_data` 数据卷。

本批按“逐条修改、十条统一发布”完成；没有逐条上线，也没有把其他 dev 功能带进生产。当前机器不存在 `D:/Obsidian/gysnote`，未创建空的 Obsidian 记录。
