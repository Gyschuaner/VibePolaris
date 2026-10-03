# VBP-060 · AI Agent 工具编排与人工协作词条 219–228

本批按 `vibepolaris-concept-pages` 逐条重做十个已有 AI Agent 词条。每条单独修改、构建、真实浏览器验收并单独提交；十条全部完成后才进入统一发布。用户明确不调用 ZCode CLI，本批未调用 ZCode。审读只复用唯一 review 子智能体 `/root/ai_stack_review`，没有创建其他协作者。

需求：`VBP-060`（DP ID `50b9bdc4-5b4c-419f-81d6-40296a734387`）
功能分支：`feat/VBP-060-ai-agent-219-228`，从 `origin/main` `5025cbbc` 建立。

## 范围、机制与资料

| slug | 独立读者任务与演示证据 | 资料组（5 个来源） |
| --- | --- | --- |
| `tool-choice` | 区分候选工具、策略和执行；切到 `none` 时停在“策略禁止调用”，写操作停在审批闸门 | OpenAI function calling；MCP Tools；Anthropic tool use；OpenAI Agents tools；OpenAI Agents HITL |
| `tool-result` | 从 `call_id` 和原始 JSON 推到业务状态；库存 `0`/`8` 或错误字段会改变下一句，不能把 `200` 当业务成功 | OpenAI function calling；MCP Tools；Anthropic tool use；OpenAI Agents tools；OpenAI Agents running |
| `plan-and-execute` | 构建、测试、部署按依赖推进；测试失败会锁住部署，修复步骤插入后重新得到 `12/12` | OpenAI Agents orchestration；OpenAI Agents running；ReAct；Anthropic effective agents；LangChain planning |
| `agent-orchestration` | 检索、核对、撰写切换并行/串行；冲突证据暂停下游，清除冲突后合并证据数量变化 | OpenAI Agents orchestration；OpenAI Agents running；Anthropic effective agents；AutoGen；OpenAI Agents handoffs |
| `handoff` | 交接最小事实与回复权；移除订单号后退回客服，不能把未发生的退款写成完成 | OpenAI Agents handoffs；OpenAI Agents multi-agent；Anthropic effective agents；AutoGen；OpenAI Agents running |
| `subagent` | 只分派可验收的价格支线；无来源结果拒绝并标记待核实，有来源结果保留缺口后写入 | OpenAI Agents multi-agent；OpenAI Agents tools；Anthropic effective agents；AutoGen；OpenAI Agents running |
| `human-in-the-loop` | 退款超过自动上限时先暂停；批准、修改为 500、拒绝分别改变是否执行和金额 | OpenAI Agents HITL；OpenAI Agents guardrails；NIST AI RMF Playbook；NIST AI RMF；OpenAI Agents tools |
| `guardrail` | 同一手机号导出分别走“脱敏放行”和“命中即阻断”；初始状态不提前显示扫描结果 | OpenAI Agents guardrails；OpenAI Agents HITL；NIST AI 600-1；NIST AI RMF Playbook；OpenAI safety best practices |
| `moderation` | 风险分数进入展示/复核/隐藏队列；阈值从 0.80 调到 0.60 后队列可观察变化，分数不作法律结论 | OpenAI moderation；OpenAI Agents guardrails；NIST AI 600-1；NIST AI RMF Playbook；OpenAI safety best practices |
| `fine-tuning` | 训练轮数同时显示训练损失与独立验证准确率；第 4 轮验证回落，提示停止追加训练 | OpenAI model optimization；OpenAI supervised fine-tuning；Hugging Face Transformers training；Hugging Face PEFT；LoRA |

研究底稿统一在 `content/zh/term-research/ai-stack.json`，每条恰好 5 个 `sourceUrls`；引用映射在 `lib/ai-stack-concept-sources/`，来源 URL 已实际打开并与段落角标对应。十个 slug 原本已在 `content/zh/published-terms.json`，本批不重复修改公开清单，只刷新已公开路由的文章实现和研究数据。

机制差异的预先设计见 [VBP-060 机制差异表](VBP-060-mechanism-matrix.md)。

## 逐条提交与 DP 任务

| 词条 | commit | DP 任务 | 状态 |
| --- | --- | --- | --- |
| `tool-choice` | `ec459202` | `ad247f6e-ffed-48b1-8f79-dce49ee1ab69` | done |
| `tool-result` | `ecae799a` | `e2d2f7fa-d0b0-4c6f-98e8-c92b783cdd9b` | done |
| `plan-and-execute` | `cecf7938` | `6bf5665a-da80-4bad-879b-3f303a051e33` | done |
| `agent-orchestration` | `d844d0e3` | `015da3d5-21c8-4c86-bc9d-b583c3705e45` | done |
| `handoff` | `d490bf0f` | `6a4de78f-4e57-4233-b716-720500392289` | done |
| `subagent` | `127c7a95` | `6a655dfa-6f6d-43bb-b601-0e64f9204f24` | done |
| `human-in-the-loop` | `20331443` | `563f6eb3-ba9b-4501-aa71-450e118746bb` | done |
| `guardrail` | `6be5c6a4` | `7c50160f-2c07-4272-b288-69d0c93f5ee7` | done |
| `moderation` | `82dfc255` | `7c9e642e-0987-4f43-b10c-3894821c36ba` | done |
| `fine-tuning` | `3de8d5ed` | `1407c950-d3cb-4e7d-a35b-a435a382b3ac` | done |

阶段语义修复另提交 `1237a964`：HITL 的 pending 决定和微调的评估结果都按演示步骤 gate，避免回退时提前显示后续状态。

## 验收证据

- 每条接入路由后均运行 `git diff --check`、`npx tsc --noEmit` 和 `npm run build`；当前批次构建通过并生成 217 个静态页面。
- 真实浏览器使用 `http://localhost:3004` 同源预览逐条检查首屏、初始状态和概念专属失败分支；最终十页 smoke 均加载到对应 H1、读者任务和参考资料：工具选择禁用调用、工具结果库存状态翻转、计划失败阻塞部署、编排冲突清除后的证据变化、交接缺订单号退回、子智能体无来源结果拒绝、人工批准后下一步才执行、护栏脱敏/阻断、审核阈值调节、微调过拟合提示均已观察到。
- 旧开发服务器日志中存在此前批次的历史 Zod/冲突标记错误记录；本批当前构建和路由加载无新增错误。全仓 `npm run check` 未执行，原因是既有 `react-hooks/refs` lint 门禁错误不属于本批变化。
- 唯一 review 子智能体为 `/root/ai_stack_review`；最终只读复核已确认十条路由、独立正文与演示、引用 ID、每条 5 个来源、每条 3 个 demoSteps，23 个唯一来源 URL 均返回 HTTP 200；未发现 blocker。

## 发布状态

本批按“逐条修改、十条统一发布”完成。十个词条分别保留独立提交，之后作为一个批次合入 `dev` 和 `main`；没有逐条发布，也没有把其他本地功能带入本批。

- `dev` PR [#292](https://github.com/Gyschuaner/VibePolaris/pull/292) 已合并，合并提交：`f70ddd60e4f2fa0c9116517219b742ed443e5ea7`。
- `main` PR [#293](https://github.com/Gyschuaner/VibePolaris/pull/293) 已合并，合并提交：`63f5d1c4a95a5b09a50f3d8e3eac8ae53c6df95f`。
- 生产 overlay 分支：`release/VBP-060-prod-overlay-20261003`；部署提交：`a3160952b56d675f41af6c49d92c1289ae8bd086`。
- DP 部署记录：`deploy-vbp060-ai-agent-219-228-prod-20261003`（ID `17f86f2b-4409-4d5a-aec6-8ab9e1df6a80`），状态 `released`，环境 `production`。
- 生产镜像：`vibepolaris:a3160952b56d675f41af6c49d92c1289ae8bd086`；发布目录：`/opt/vibepolaris/releases/20261002T195317Z-a3160952`。
- 回滚备份：`/opt/vibepolaris/backups/20261002T195317Z-from-0b81e61c`；旧镜像：`vibepolaris:0b81e61cc51a64265efa7b73387f12ec0edf91bb`。回滚时恢复该备份的 compose 配置并切回旧镜像，保留 Xiaobei 数据卷。
- 发布后容器状态为 `running/healthy`。生产根路径、新闻页和十个词条 URL 均返回 HTTP 200；真实浏览器复核了十个词条的 H1、读者任务、参考资料，以及人在回路“等待决定 → 批准后下一步执行”的状态门控。

当前机器不存在 `D:/Obsidian/gysnote`，未创建空的 Obsidian 记录。
