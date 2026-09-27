# 已公开词条文风复核 · VBP-042

本次范围取 `content/zh/published-terms.json` 在第026批合入 dev 后的95个公开词条。使用用户指定的 `write-like-me` 审校原则：事实先行、主语和动作清楚，避免设问式章节标题、反复的否定转折、没有事实支撑的价值词和跨页面套用的结尾。概念文章仍保持读者可直接理解的叙述，不套工作汇报的编号格式。

## 方法与结论

从路由映射定位95个独立页面组件，逐页看首段、章节及侧栏标题和收束段；对正文提取出的段落执行全量措辞筛查，再回到命中段落判断语境。词汇命中本身不等于问题：例如“状态不等于持久化”是必要的概念边界。保留事实、例子、引用角标、六个历史锚点和互动演示。

改动集中在66页：将66个设问式或半设问式标题改为陈述式，重写30处正文模板句和4处设问式开篇，另调整3个侧栏标题。早期约二十页连续以“请 AI……给出……要求它……”收束，现在以该概念的输入、检查证据和结果边界收尾。其余29页保留原文。没有为去掉“不是”而删除必要的技术区分，也没有补造新结论或资料。

这是一轮文风审校，不替代事实来源复核。009—026批已有逐页四份来源映射；更早批次和历史基准的来源缺口继续按 `concept-rollout.md` 补齐，不能由本次文字修改视为完成。

## 逐页记录

“保留原文”表示该页首段、标题、收束及关键词命中段落未发现需要本次调整的写法；不等于已重新核对整篇的全部事实或引用。

| slug | 词条 | 本次处理 |
| --- | --- | --- |
| `streaming-output` | 流式输出 | 保留原文 |
| `structured-output` | 结构化输出 | 保留原文 |
| `function-calling` | 函数调用 | 保留原文 |
| `model-routing` | 模型路由 | 保留原文 |
| `model-fallback` | 备用模型 | 标题修订 |
| `prompt-caching` | 提示缓存 | 保留原文 |
| `benchmark` | 基准测试 | 保留原文 |
| `grader` | 评分器 | 标题修订 |
| `evaluation-dataset` | 评测数据集 | 标题修订 |
| `grounding` | 基于证据回答 | 标题修订 |
| `hallucination` | 幻觉 | 标题修订 |
| `eval` | 评测 | 标题修订 |
| `hybrid-search` | 混合搜索 | 标题修订 |
| `vector-store` | 向量存储 | 保留原文 |
| `citation` | 引用 | 标题修订 |
| `retrieval` | 检索 | 保留原文 |
| `chunking` | 分块 | 保留原文 |
| `reranking` | 重排序 | 标题修订 |
| `embedding` | 嵌入 | 保留原文 |
| `semantic-search` | 语义搜索 | 保留原文 |
| `rag` | RAG | 标题修订 |
| `dataframe` | 数据帧 | 标题、正文修订 |
| `full-text-search` | 全文搜索 | 保留原文 |
| `vector-database` | 向量数据库 | 标题、正文修订 |
| `dataset-data` | 数据集 | 正文修订 |
| `data-quality` | 数据质量 | 标题、正文修订 |
| `data-lineage` | 数据血缘 | 标题、开篇、正文修订 |
| `data-ingestion` | 数据接入 | 标题、正文修订 |
| `data-transformation` | 数据转换 | 正文修订 |
| `data-validation` | 数据验证 | 标题、正文修订 |
| `data-pipeline` | 数据管道 | 正文修订 |
| `webhook` | Webhook | 正文修订 |
| `distributed-system` | 分布式系统 | 正文修订 |
| `batch-processing` | 批处理 | 标题、正文修订 |
| `stream-processing` | 流处理 | 标题、正文修订 |
| `event-driven-architecture` | 事件驱动架构 | 标题、正文修订 |
| `backup` | 备份 | 标题、正文修订 |
| `sharding` | 分片 | 标题、正文修订 |
| `queue` | 队列 | 标题、正文修订 |
| `cache` | 缓存 | 正文修订 |
| `connection-pool` | 连接池 | 正文修订 |
| `replication` | 复制 | 标题修订 |
| `sql` | SQL | 标题、正文修订 |
| `database-migration` | 数据库迁移 | 标题修订 |
| `orm` | ORM | 标题、开篇、正文修订 |
| `database-schema` | 数据库模式 | 正文修订 |
| `join` | 连接查询 | 标题修订 |
| `unique-constraint` | 唯一约束 | 标题、正文修订 |
| `agent-harness` | 智能体运行框架 | 保留原文 |
| `tools` | 工具调用 | 保留原文 |
| `context` | 上下文 | 标题修订 |
| `agent-loop` | 智能体循环 | 标题修订 |
| `memory` | 记忆 | 标题修订 |
| `context-window` | 上下文窗口 | 标题修订 |
| `prompt` | 提示词 | 保留原文 |
| `mcp` | MCP | 正文修订 |
| `execution-sandbox` | 执行沙箱 | 保留原文 |
| `llm` | 大模型 | 标题修订 |
| `token` | Token | 标题修订 |
| `agent` | 智能体 | 保留原文 |
| `component` | 组件 | 标题、正文修订 |
| `props` | 属性参数 | 保留原文 |
| `state` | 状态 | 正文修订 |
| `event` | 事件 | 标题修订 |
| `event-bubbling` | 事件冒泡 | 正文修订 |
| `hook` | Hook | 保留原文 |
| `effect` | 副作用 | 标题、正文修订 |
| `browser-api` | 浏览器 API | 标题修订 |
| `fetch-api` | Fetch API | 保留原文 |
| `promise` | Promise | 标题修订 |
| `async-await` | 异步等待 | 标题修订 |
| `json` | JSON | 标题修订 |
| `json-schema` | JSON Schema | 标题修订 |
| `request` | 请求 | 保留原文 |
| `response` | 响应 | 保留原文 |
| `http-method` | HTTP 方法 | 保留原文 |
| `status-code` | 状态码 | 保留原文 |
| `http-header` | 请求头 | 标题修订 |
| `query-parameter` | 查询参数 | 标题修订 |
| `path-parameter` | 路径参数 | 标题、正文修订 |
| `request-body` | 请求体 | 保留原文 |
| `api` | API 接口 | 标题修订 |
| `endpoint` | 端点 | 保留原文 |
| `rest` | REST | 标题修订 |
| `pagination` | 分页 | 保留原文 |
| `rate-limiting` | 限流 | 标题、开篇修订 |
| `timeout` | 超时 | 标题、开篇修订 |
| `retry` | 重试 | 标题修订 |
| `idempotency` | 幂等性 | 保留原文 |
| `database` | 数据库 | 标题修订 |
| `index` | 索引 | 标题修订 |
| `transaction` | 事务 | 标题修订 |
| `table` | 表 | 标题修订 |
| `primary-key` | 主键 | 标题修订 |
| `foreign-key` | 外键 | 保留原文 |

## 校对边界

- 已复核95/95个公开 slug 与独立页面映射；正文提取覆盖这95页，未把待处理的206页混入完成数。
- 94个使用 `ConceptArticle` 的页面，静态核对侧栏 `sections` 标签与正文 `ArticleSection` 标签，未发现不一致；Harness 使用独立目录，内容未动。
- 修改不涉及技术事实和交互逻辑。`npm run build` 通过，生成106个静态页。Chrome从本地构建打开数据验证、事件冒泡、超时和幻觉四页，已看到新目录标题、改写段落、原引用与相关入口；本次没有重复执行未改动的演示。dev 合并与本地集成结果在完成后补记。
