# VBP-061 机制与读者任务矩阵

这批按“上下文进入一次请求 → 状态在循环中变化 → 资料被表示、存放、召回、切分、重排”的学习路径编排。十个页面各自回答一个可操作的问题，不复用同一套动画隐喻。

| 词条 | 零基础读者任务 | 机制焦点 | 演示中可观察的变化 | 主要资料与页面映射 |
| --- | --- | --- | --- | --- |
| context-window | 判断哪些内容会挤占本轮输入/输出预算 | 单次请求 token 总量、输入裁剪、长上下文利用边界 | 短/长历史把占用从 12k 推到 15k，进入裁剪分支 | OpenAI conversation state；OpenAI Agents running；Attention；Lost in the Middle |
| agent-loop | 判断一次工具调用为什么不能直接代表任务完成 | 状态读取、执行、回写、停止条件 | 失败结果回到状态，2/3 轮上限决定继续或停止 | OpenAI Agents running；Agents orchestration；ReAct；Anthropic effective agents |
| agent-memory | 区分一次对话历史与跨会话的可管理记录 | 同意、保存、取回、纠正、删除 | 点击保存/删除，记录和取回结果即时改变 | LangChain memory；OpenAI conversation state；Generative Agents；MemGPT |
| working-memory | 找出本轮任务中哪些状态应当在交付后清掉 | 可变的任务快照、候选和调用计数 | 候选从 5 个收敛到 2 个，交付后进入清理边界 | LangChain memory；LangGraph overview；OpenAI Agents running；Anthropic context engineering |
| execution-sandbox | 判断“隔离”具体限制了什么，仍留下什么风险 | 文件、网络、时间权限与销毁 | 三个开关改变请求是否被拒，环境销毁不被当作绝对安全 | OpenAI sandbox security；OpenAI hosted sandboxes；Code Interpreter；Docker security；NIST SP 800-190 |
| embedding | 解释向量相似度能回答什么，不能证明什么 | 文本到向量、距离、回到原文 | 查询切换后二维投影和近邻原文变化 | OpenAI embeddings；OpenAI retrieval；Sentence Transformers usage；Attention |
| vector-store | 判断索引、元数据过滤和事实核验分别由谁负责 | 向量、文档 ID、版本、权限标签的存放与过滤 | 2026 版本过滤让候选由 20 条变为 7 条 | OpenAI retrieval；Qdrant collections；Pinecone vector database；Elastic similarity；FAISS |
| retrieval | 判断检索结果何时只是材料，何时才进入生成阶段 | 查询、候选召回、top-k、原文交付 | top-1/top-3 改变候选数量，流程停在原文卡片 | OpenAI retrieval；RAG；DPR；LangChain retrievers；Sentence Transformers retrieve/rerank |
| chunking | 判断切分边界如何影响命中和上下文完整性 | 块大小、重叠、标题/页码结构保留 | 800/0 与 500/100 改变块数和边界，命中后仍需核对相邻条件 | LangChain splitters；LlamaIndex node parsers；RAG；DPR；Lost in the Middle |
| reranking | 判断重排改变了什么，为什么不能找回漏召回内容 | 初次召回后的候选级精排 | A/B/C 初始顺序变成 B/A/C，候选范围不扩张 | Sentence Transformers retrieve/rerank；Cohere rerank；BERT rerank；ColBERT；FAISS |

## 交付约束

- 每个页面保留自己的 slug、相关词条和稳定锚点；来源在段落旁通过 `Cite` 绑定，研究记录保留五个可访问 URL。
- 每个演示至少有三步叙事、一个用户可操作控制和一个明确的失败或边界分支；控制变化必须改变证据，而不是只换标题。
- 每条按独立提交推进；共享 lesson 只承载本批复用的交互骨架，页面正文、来源、研究数据和路由注册仍按词条独立核对。
- 发布前由唯一 review 子智能体 `/root/ai_stack_review` 复核零基础可读性、资料映射、交互差异和稳定 ID；不得创建其他 review 子智能体。
