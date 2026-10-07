# VBP-012 · AI / Agent 词条深度批次发布记录

日期：2026-10-07

本记录对应 VBP-012 当前批次的十条已完成词条：`moderation`、`handoff`、`human-in-the-loop`、`guardrail`、`agent-orchestration`、`chunking`、`retrieval`、`vector-store`、`subagent`、`plan-and-execute`。

## 目标与写作约束

本批按 `vibepolaris-concept-pages` 执行逐条重写。每页都补齐了零基础读者需要的定义、必要前提、因果链、贯穿例子、失败/边界、相邻概念和段落级引用；没有用一个模板替换十条内容。演示从概念机制倒推：对象先处于什么状态，读者改变什么，哪一个可观察证据随之变化，什么条件下停止或转入失败分支。

流程图只用于确实有依赖顺序的 `plan-and-execute`；本批其余特色首图分别使用审批轨迹、控制权卡、人工闸门、规则扫描、编排台、纸带切割、证据架、向量账本和子任务契约。这样读者看到的是概念的工作对象和证据，而不是十张同样的“输入 → 中间节点 → 输出”图。

## 内容与演示变更

- `moderation`：解释审核对象、规则范围、误杀/漏放和人工复核出口。
- `handoff`：区分工具调用、控制权交接和返回主线，补充交接条件与未完成状态。
- `human-in-the-loop`：把人工介入放在高风险/低置信度/不可逆动作前，说明批准、修改、拒绝和超时。
- `guardrail`：把输入/输出/工具护栏与 fail-open、fail-closed 的产品取舍拆开。
- `agent-orchestration`：说明并行、串行、合并和冲突处理，而不是把多智能体画成平行头像。
- `chunking`：纸带沿标题与例外切开，保留边界重叠、父标题、页码和版本。
- `retrieval`：证据架依次展示查询、打开候选、排序、扩大 top-k、抽走无来源卡、关闭引用闸，共 6 帧。
- `vector-store`：账本依次展示建立索引、查询近邻、元数据过滤、返回前五；窄屏使用两栏布局，记录区下排避免标签竖排。
- `subagent`：用主报告、子任务契约和结果缺口表现“分派可验收的一块，再由主线合并”。
- `plan-and-execute`：用依赖星座表现构建→测试→部署，测试失败后插入修复节点并重新取得部署入口。

## 资料与引用对齐

五条重点 AI / Agent 词条的经验台账、research sourceUrls、source helper 和页面 Cite targets 已逐字同序，页面锚点与 helper 为 1:1，无 orphan/missing：

- [OpenAI Agents SDK · orchestration](https://openai.github.io/openai-agents-python/multi_agent/)、[running agents](https://openai.github.io/openai-agents-python/running_agents/)、[handoffs](https://openai.github.io/openai-agents-python/handoffs/)、[human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)、[guardrails](https://openai.github.io/openai-agents-python/guardrails/)。
- [Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) 与 [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)。
- [OpenAI Retrieval](https://developers.openai.com/api/docs/guides/retrieval)、[Lewis 等 RAG 论文](https://arxiv.org/abs/2005.11401)、[DPR](https://arxiv.org/abs/2004.04906)、[Sentence Transformers retrieve/rerank](https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html)。
- [LangChain text splitters](https://docs.langchain.com/oss/python/integrations/splitters)、[LlamaIndex node parsers](https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/)。
- [FAISS GPU similarity search](https://arxiv.org/abs/1702.08734)、[HNSW](https://arxiv.org/abs/1603.09320)、[Qdrant collections](https://qdrant.tech/documentation/concepts/collections/)、[Pinecone vector database](https://www.pinecone.io/learn/vector-database/)。
- [ReAct](https://arxiv.org/abs/2210.03629)、[AutoGen](https://arxiv.org/abs/2308.08155)、[LangChain plan-and-execute](https://www.langchain.com/blog/planning-agents)。

## 验证证据

- `npm run audit:terms`：329 个 experience、329 个唯一 slug、sourceCoverage 329、duplicateSceneCount 0、nearDuplicatePairCount 0；场景类型覆盖 assembly、branch、compare、contract、layers、magnet-drawer、matrix、memory、network、pipeline、queue、route、spectrum、state-machine、tree 等，不是统一流程图。
- `npm run typecheck`：通过。
- `npm run build`：通过，新闻校验为 725 篇 published，Next 生成 1071 个静态页。
- 本地真实浏览器：检索六帧、向量存储四帧、规划五帧均逐步点击验证；三页 console error 为 0；规划页 `plan-limit` 仅一个锚点；390px fresh tab 复核 vector-store 账本无竖排/横向溢出。
- 生产容器内：`/`、`/news`、`/about`、`/sitemap.xml` 以及十条本批词条均 HTTP 200；五个特色首图标记均在 HTML 中；`plan-limit` anchor count 为 1；容器 `running/healthy`。

## Git 与发布

- 内容分支 PR [#428](https://github.com/Gyschuaner/VibePolaris/pull/428) 合入 dev，随后 PR [#429](https://github.com/Gyschuaner/VibePolaris/pull/429) 合入 main。
- 热修 PR [#430](https://github.com/Gyschuaner/VibePolaris/pull/430)（`b23df7ff`）修正来源台账、引用锚点和检索/向量分镜，合入 dev；发布 PR [#431](https://github.com/Gyschuaner/VibePolaris/pull/431) 合入 main `65b0528a`。
- 窄屏修正 PR [#432](https://github.com/Gyschuaner/VibePolaris/pull/432)（`66de54fa`）和发布 PR [#433](https://github.com/Gyschuaner/VibePolaris/pull/433) 合入 main，最终提交 `d6e022ba243d9795552ac72103860f0d3b8adeee`。
- 唯一 review subagent `/root/ai_stack_review` 对内容、引用、分镜、桌面视觉和 390px 账本布局均给出 PASS。本批未调用 ZCode CLI。

## 生产 release 与回滚

- 镜像：`vibepolaris:d6e022ba243d9795552ac72103860f0d3b8adeee`。
- 本地 linux/amd64 镜像 manifest：`sha256:d613dd9ed9948bb1b8d7d9e01e04e23e747598d52e149f150d92fd60c91d280a`；传输包 SHA-256：`2803535157a25909887335771741746bae7d1aeacb068172f128757411a7aca4`。
- 当前 release：`/opt/vibepolaris/releases/20261007T101904Z-d6e022ba`，`/opt/vibepolaris/current` 已原子切换到此目录，`vibepolaris-web-1` 为 `running/healthy`。
- 切换前 release：`/opt/vibepolaris/releases/20261007T100525Z-65b0528a`；本次备份：`/opt/vibepolaris/backups/20261007T101904Z-from-65b0528a`，SQLite 在线备份已保存，`vibepolaris_xiaobei_data` 数据卷未替换。
- 回滚：执行当前 release 的 `rollback.sh`，恢复备份中的 Compose 与 `vibepolaris:65b0528a243d9795552ac72103860f0d3b8adeee`，并把 `current` 指回上一 release；上一 release 的旧镜像 `vibepolaris:30451ddfd2e96512e43820e32fe193caff84ca12` 仍保留作为更早回滚链。
- 清理了六个无容器引用的旧 VibePolaris 镜像和临时上传脚本；没有删除当前镜像、回滚镜像、release 或数据卷。服务器根分区从 100% 恢复到约 82%。

## 状态限制

DP CLI 在本轮仍因 TLS `UNEXPECTED_EOF_WHILE_READING` 无法稳定连接；没有伪造需求、任务、测试或 deployment 写入，以上 Git、构建、浏览器和服务器证据为实际执行记录。当前机器不存在 `D:/Obsidian/gysnote`，未创建空 Obsidian 记录。
