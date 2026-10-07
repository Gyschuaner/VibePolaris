# VBP-101：Agent 上下文扩展十条的内容与演示重做

本批逐条重做 `context-engineering`、`query-rewriting`、`graph-rag`、`lost-in-the-middle`、`memory-consolidation`、`process-supervision`、`outcome-supervision`、`reward-hacking`、`agent-trajectory`、`computer-use`。目标是让零基础读者看见这些词在真实智能体工作里的分工、边界和失败方式；每条正文由已阅读的资料支撑，演示只保留能让机制发生的对象和反馈。

## 机制差异表

| 词条 | 读者要看懂的关系 | 主要演示对象 | 形式 | 为什么不采用通用流程图 |
| --- | --- | --- | --- | --- |
| 上下文工程 | 当前窗口里什么该留下、压缩、检索或丢弃 | 任务牌、证据卡、预算槽、裁剪台 | 分层台 | 重点是输入编排和取舍，不是固定先后顺序 |
| 查询重写 | 用户原话、检索查询、原始证据之间的差异 | 原问题、两种查询、候选片段、改写风险 | 对照台 | 重点是同一问题的两种检索入口与证据损失 |
| GraphRAG | 实体、关系、社区和全局摘要如何互相支撑 | 实体节点、关系线、社区卡、局部/全局结果 | 关系网络 | 关系本身比线性步骤更重要，边不是执行箭头 |
| Lost in the Middle | 片段位于上下文中段时，取回与利用可能变差 | 位置槽、同一事实、注意力强弱、重排结果 | 位置频谱 | 重点是位置效应，不把阅读误画成流水线 |
| 记忆巩固 | 原始经历怎样被筛选、抽象、回链和修正 | 事件卡、抽象记忆、来源链、过期标记 | 记忆台 | 重点是记忆对象的变形和可追溯性 |
| 过程监督 | 解题中间步骤怎样被逐步标注，和最终答案怎样不同 | 两条解题纸、逐步标签、最终分数 | 证据矩阵 | 重点是逐格判定，不是从输入走到输出的路线 |
| 结果监督 | 只看最终结果时能知道什么、看不到什么 | 两份同分/异分答案、隐藏过程、评分卡 | 结果对照 | 重点是相同分数背后的盲区与成本取舍 |
| 奖励投机 | 可计算代理指标怎样被钻空子，真实意图怎样落空 | 蓝红方块、翻转动作、评分器、契约检查 | 契约台 | 重点是目标与代理指标的错位，不是执行顺序 |
| 智能体轨迹 | 观察、动作、工具回执、重试和最终评分如何组成一次试验 | 事件票据、工具回执、重试标记、评分器 | 时间证据带 | 重点是可回放的记录与失败证据，时间线只服务于轨迹定义 |
| 计算机使用 | 屏幕、光标、权限确认、页面变化和结果核验如何共同构成一次操作 | 截图、光标、动作、权限门、注入提示、停止牌 | 装配台 | 重点是视觉证据、权限和结果验证的组合关系 |

只有 `agent-trajectory` 保留时间线作为核心语义，`computer-use` 只在装配台中展示动作与新截图的前后关系；其余八条不使用流程图式主结构。最近一次全站审计覆盖 362 条体验，流程类演示占 12.2%，重复、相邻同构和近重复均为 0。本批继续把流程结构限制在“顺序就是概念”的场景，不能把流程图当成统一模板。

## 研究与事实边界

每条词条均有 5 份已实际打开的公开来源，正文段落、研究台账、批次摘要和体验分镜共用同一来源顺序；页面 Cite 只指向能支持该段话的资料。

| 词条 | 主要资料 |
| --- | --- |
| `context-engineering` | [Anthropic：Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)、[Anthropic：Building effective agents](https://resources.anthropic.com/building-effective-ai-agents)、[RAG](https://arxiv.org/abs/2005.11401)、[Lost in the Middle](https://arxiv.org/abs/2307.03172)、[MCP TypeScript SDK v2](https://ts.sdk.modelcontextprotocol.io/v2/) |
| `query-rewriting` | [Query2doc 改进检索](https://arxiv.org/abs/2305.14283)、[Query2doc](https://arxiv.org/abs/2303.07678)、[检索查询改写](https://arxiv.org/abs/2407.12529)、[RAG](https://arxiv.org/abs/2005.11401)、[Anthropic：Contextual retrieval](https://www.anthropic.com/engineering/contextual-retrieval) |
| `graph-rag` | [Microsoft GraphRAG 论文](https://arxiv.org/abs/2404.16130)、[GraphRAG indexing](https://microsoft.github.io/graphrag/index/overview/)、[GraphRAG query](https://microsoft.github.io/graphrag/query/overview/)、[GraphRAG global search](https://microsoft.github.io/graphrag/query/global_search/)、[GraphRAG getting started](https://microsoft.github.io/graphrag/get_started/) |
| `lost-in-the-middle` | [原始研究](https://arxiv.org/abs/2307.03172)、[Anthropic：Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)、[Anthropic：Long context prompting](https://www.anthropic.com/news/prompting-long-context)、[Claude context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows)、[RAG](https://arxiv.org/abs/2005.11401) |
| `memory-consolidation` | [Memory consolidation](https://arxiv.org/abs/2404.00573)、[Generative Agents](https://arxiv.org/abs/2304.03442)、[MemoryBank](https://arxiv.org/abs/2404.13501)、[Reflexion](https://arxiv.org/abs/2303.11366)、[长期记忆研究](https://arxiv.org/abs/2412.15266) |
| `process-supervision` | [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050)、[InstructGPT](https://arxiv.org/abs/2203.02155)、[PRM800K](https://github.com/openai/prm800k)、[Training Verifiers](https://arxiv.org/abs/2110.14168)、[Process/outcome feedback](https://arxiv.org/abs/2211.14275) |
| `outcome-supervision` | [Training Verifiers](https://arxiv.org/abs/2110.14168)、[InstructGPT](https://arxiv.org/abs/2203.02155)、[Let's Verify Step by Step](https://arxiv.org/abs/2305.20050)、[Process/outcome feedback](https://arxiv.org/abs/2211.14275)、[Quantitative reasoning](https://arxiv.org/abs/2206.14858) |
| `reward-hacking` | [DeepMind specification gaming](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/)、[Anthropic reward tampering](https://www.anthropic.com/research/reward-tampering)、[Goal misgeneralisation](https://arxiv.org/abs/2209.13085)、[DeepMind undesired goals](https://deepmind.google/blog/how-undesired-goals-can-arise-with-correct-rewards/)、[Anthropic emergent misalignment](https://www.anthropic.com/research/emergent-misalignment-reward-hacking) |
| `agent-trajectory` | [Anthropic：Evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)、[AgentBench](https://arxiv.org/abs/2308.03688)、[Agent trajectory study](https://arxiv.org/abs/2307.13854)、[Anthropic：Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)、[Agent evaluation](https://arxiv.org/abs/2404.06474) |
| `computer-use` | [OpenAI computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)、[Claude computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)、[OSWorld](https://arxiv.org/abs/2404.07972)、[Anthropic developing computer use](https://www.anthropic.com/research/developing-computer-use)、[Anthropic computer use release](https://www.anthropic.com/news/3-5-models-and-computer-use) |

演示中的数字、状态和失败分支都是可观察的教学数据，不当作线上测量或协议保证。记忆巩固、奖励投机和计算机使用等条目特别保留来源、同意、删除、权限、隔离和结果核验边界，避免把演示里的“看起来成功”写成真实可靠性。

## 交付与验收

- 十条按“每条实现 → 唯一 reviewer `/root/ai_stack_review` → 下一条”的顺序完成；十条完成后才进入一次批量发布。
- 每条有 4 段正文教学、5 份研究来源、可交互分镜和失败/边界状态；`demoSteps` 与 `frames` 按概念选择 3–7 个分镜，不要求全站统一步数。
- `npm run typecheck`、`npm run build`、`npm run audit:terms`、`node --experimental-strip-types --test tests/term-library.test.mjs` 和 `git diff --check` 在发布前统一执行。
- 唯一 reviewer 对十条逐条给出 PASS；最后一条 `computer-use` 复审覆盖 362/362 体验，流程类占比 12.2%，重复、相邻同构和近重复为 0。
- 本批当前实现提交为 `25d7ec38`、`05dd264c`、`4c086652`、`eab292fb`、`18c6f377`、`b3e7a035`、`988d74ad`、`69c68ff5`、`c57277a3`、`e70e4dcd`；十条内容完成后再统一合并和部署。

## 发布记录

## 生产发布记录（2026-10-08）

- 内容 PR [#452](https://github.com/Gyschuaner/VibePolaris/pull/452) 已合入 `main`，生产源提交为 `575e0b03bcebc7ad182c7f2f8fa08af633c2b151`。
- 本机构建的 `linux/amd64` 镜像为 `vibepolaris:575e0b03bcebc7ad182c7f2f8fa08af633c2b151`；镜像内 `news:validate`、Next 静态生成 1101 页和容器启动均通过。
- 生产 release 为 `/opt/vibepolaris/releases/20261007T213629Z-575e0b03`，`/opt/vibepolaris/current` 已原子切换到该目录；`vibepolaris-web-1` 使用新镜像并保持 `healthy`。
- 切换前 release 为 `/opt/vibepolaris/releases/20261007T204157Z-1de99bfe`，旧镜像为 `vibepolaris:1de99bfe7d1ee5c9e370d4d64f56f032da6eef3d`；备份为 `/opt/vibepolaris/backups/20261007T213629Z-from-1de99bfe7d1ee5c9e370d4d64f56f032da6eef3d`。备份包含旧 Compose、容器和镜像检查信息，以及通过 SQLite `VACUUM INTO` 完成的在线备份 `xiaobei.sqlite`；`vibepolaris_xiaobei_data` 数据卷未替换。
- 生产机经 HTTPS server-local smoke 检查 `/`、`/news`、`/about`、`/sitemap.xml` 与本批十条 `/terms/*` 路由均返回 HTTP 200；过程监督、结果监督、奖励投机和计算机使用的专属演示标记可在页面 HTML 中找到；容器最近日志只有正常启动信息。当前客户端直接访问公网时出现 `SSL_ERROR_SYSCALL`，因此公网客户端检查未冒充通过，服务器本地 HTTPS 结果作为本次发布证据。
- 回滚入口为 `/opt/vibepolaris/releases/20261007T213629Z-575e0b03/rollback.sh`，可恢复旧 Compose、旧镜像和旧 release；回滚不删除或覆盖上线后新增的 Xiaobei 数据。
- 按 `developer-platform-cli` 以批次 `deploy-vbp101-agent-context-prod-20261008` 记录生产 deployment，并用同一批次 ID 重试一次；两次均因 `SSL: UNEXPECTED_EOF_WHILE_READING` 未连接 DP。未伪造 deployment ID 或状态，待 DP 网络恢复后用同一批次 ID 补录并查询确认。
- 当前机器不存在规则指定的 `D:/Obsidian/gysnote`，本批没有写入该库。
