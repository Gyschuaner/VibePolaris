# 第020批：嵌入、语义搜索与 RAG · VBP-035

VBP-012 的第二十批，2026-09-27。从 dev `1774bcaff3ca918924dd45164f2e6f75822cae3f` 创建 feat/VBP-035-semantic-concepts，负责人顾毅盛。应用 concept-pages 和 ponytail full；复用阅读、引用、术语卡片、首图生命周期及 Reveal，没有新增依赖或真实模型服务。

## 读者、机制与编排

贯穿“图书续借”的三篇文章分别回答如何表示内容、如何找到候选、怎样依据取回资料回答。正文能独立解释定义、过程和主要边界，不依赖播放或展开。

| 词条 | 首图 | 主体操作与可见证据 | 正文节奏 |
| --- | --- | --- | --- |
| 嵌入 | 两种表述的三维分量条依次出现 | 选择文本/编码器，显示正负分量，实际计算余弦；未对齐编码器拒绝比较 | 表示来源、两栏数值对照、生成/检索职责、错位的长文本限制 |
| 语义搜索 | 旧版最高分与现行次高分对照 | 四文档按真实余弦排序，版本过滤、k、阈值改变返回集合；人工标注计算精确率/召回率 | 含义与词项、纵向排序、重排边界、偏置的评估段落 |
| RAG | 条件A与状态B共同支持一句结论 | 先取资料再组织答复；点击答句突出支持材料；缺规则与冲突保持未知 | 原始架构/常见应用、材料与答句双栏、输入更新、检查资料与答句 |

三页向量全部手工指定，RAG 使用固定资料包与规则答复，不把教学结果冒充模型能力。没有 ANN、真实文档库、生成器或自动质量评估。

## 已读公开来源及正文映射

每页四份，共十二份。以下记录实际阅读部分及适用范围，非只搜到标题；未确认的更新日期不猜写。全部正文角标与书目/摘录双向连接。

嵌入：

1. [Mikolov 等：Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/pdf/1301.3781)：阅读摘要、引言、连续表示和词关系任务；对应 embedding-learning。词向量研究不泛化成整篇文档表示。
2. [Reimers / Gurevych：Sentence-BERT](https://arxiv.org/html/1908.10084)：阅读摘要、引言、孪生/三元组结构、池化与相似性；对应 embedding-sentences。取原始模型数值不等于适合检索。
3. [Hugging Face：Feature Extraction](https://huggingface.co/tasks/feature-extraction)：阅读文本到特征、分类/检索用途与特征输出示例；对应 embedding-output。原文保存和核验作为本文设计推论，不声称嵌入可无损还原。
4. [Sentence Transformers：Computing Embeddings](https://www.sbert.net/examples/sentence_transformer/applications/computing-embeddings/README.html)：阅读 encode、查询/文档前缀、维度、最大输入与长文本截断；对应 embedding-config、embedding-length。配对编码器可以不同，不以维度相同判兼容。

语义搜索：

1. [Karpukhin 等：Dense Passage Retrieval](https://arxiv.org/pdf/2004.04906)：阅读摘要/引言、查询与段落配对编码、点积及候选索引；对应 semantic-encoding。DPR 是具体方案，不作为所有搜索的规范。
2. [Sentence Transformers：Retrieve & Re-Rank](https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html)：阅读关键词/稠密候选与 Cross-Encoder 成对计算；对应 semantic-rerank。重排不能找回未进入候选的文档。
3. [Thakur 等：BEIR](https://arxiv.org/pdf/2104.08663)：阅读跨领域评估、稠密方法泛化、BM25 基线与计算代价；对应 semantic-generalization。不照搬某个基准为本项目质量保证。
4. [Manning / Raghavan / Schütze：Introduction to Information Retrieval，unranked sets 评估](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-unranked-retrieval-sets-1.html)：阅读精确率、召回率定义及评价集合；对应 semantic-evaluation。人工相关标注由本例任务明确指定，零分母显示未定义。

RAG：

1. [Lewis 等：Retrieval-Augmented Generation](https://arxiv.org/pdf/2005.11401)：阅读摘要、参数/外部记忆、方法、RAG-Sequence/Token 与联合微调；对应 rag-definition、rag-original。常见输入拼接应用不必复现原始训练架构。
2. [Hugging Face Transformers：RAG](https://huggingface.co/docs/transformers/model_doc/rag)：阅读推理取回段落与更新索引、Retriever 用法；对应 rag-index。嵌入/缓存更新按应用数据流推导，非该接口统一保证。
3. [Liu 等：Lost in the Middle](https://arxiv.org/pdf/2307.03172)：阅读多文档问答实验、位置与干扰效果；对应 rag-context。明确特定模型/任务的研究范围，不泛化效果大小。
4. [Es 等：RAGAS](https://arxiv.org/pdf/2309.15217)：阅读 faithfulness、answer relevance、context relevance 与评估方法；对应 rag-evaluation。忠于资料与资料真实分开，自动评估不当成无误校验。

## review 与数据边界

- 元数据仅收紧嵌入/语义搜索解释；保留别名、分类、relatedSlugs 和六个历史锚点；RAG 由旧专用模板切到当前独立文章入口。公开覆盖 68 新流程 + 9 历史 = 77，224 待处理。早期批次四来源复核仍需继续。
- 余弦直接由点积/模长算出，零模长返回 null；跨表示空间拒绝比较。三组固定文本不用于评价真实模型。
- 搜索先过滤版本，再计算精确余弦、按分数排序、阈值筛选和取 k；相关标注明确为续借A、打印C、健身房无。旧版与维护说明不算满足当前任务。没有伪概率或伪 ANN 评分。
- RAG 的每句来源来自固定规则支持关系。审稿把A明确为“只有未被预约的书才可续借”，避免用单纯充分条件推导禁止。A/B 给出不能续借，只有B不补政策，A/C同范围冲突不决定天数；引用不是独立真伪证明。
- 输入/场景变化立即禁用依赖操作，旧结果双向收起；快切时无后台定时器。报告快照保留用于退出过渡，隐藏内容 inert/aria-hidden。
- 最初垂直交换卡片造成过渡文字遮挡，已记录 BUG-9ACB6744。删除交叉的 transform 过渡，按新排序位置短距离淡入，保留真实排序变化；桌面和390px回归每行间距12px、无遮挡。
- 首图为有限CSS动画，使用既有 ConceptHero 的离屏/后台暂停及重播；减少动态效果提供终态，正文动画关闭也完整可读。正文/演示均限于文章宽度，英文网址自然换行。

## 本地验证

最终 `npm run build` 通过：88 个静态页面、77 个公开词条。`node --experimental-strip-types --test tests/semantic-teaching.test.mjs` 通过一个组合检查：余弦/零模长、不同编码器、版本/阈值/k、精确率召回率及空分母、三种RAG资料及来源。排序修复后未扩大测试；审稿澄清资料A的必要条件后复跑同一组合检查并重新构建，均通过。未跑无关全站 check。

真实 Chrome 1470×956：嵌入 Enter 生成表示，续借0.96、未对齐B停止、重置禁用比较；搜索默认B/A及精确率1/2召回1/1，现行k1返回A，健身房0条/两个指标未定义，重置禁用评估；RAG取资料前禁用答复、完整资料AB支持当前不能续借、点击突出AB、缺规则不补政策、冲突不选天数、重置收起。第四资料小三角逐页展开并回正文，搜索/RAG目标顶部约129.95/129.84px。

390×844：三页首图与终态正常，无横向溢出。嵌入续借0.96、打印0.12、B停止、Enter重置；搜索B/A评估、打印k1返回C、健身房空指标、Enter重置；RAG完整资料支持高亮、缺规则及冲突保持未知、Enter重置。第四来源回跳 embedding-config / semantic-evaluation / rag-evaluation，顶部262.23/262.19/262.19px，不被手机阅读栏遮挡。搜索修复后桌面也观察过淡入中间态：88px行高、100px步距，四行不互穿。

dev 合并和重启后的核心核对尚待本次交付，实际状态以 DP 记录为准。当前 Mac 无 `D:/Obsidian/gysnote`，跳过该库同步。没有产生正式飞书文档，不建空索引。未部署远端或生产。
