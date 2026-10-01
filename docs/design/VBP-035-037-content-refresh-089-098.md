# VBP-035–037 · 089–098 文案边界复审

本记录对应 2026-10-01 的十条词条复审批次。正文改动先在 `feat/VBP-035-semantic-content-audit` 完成本地验证，再从最新 `origin/main` 生成一个发布分支统一上线；Lesson、交互逻辑和公开词条登记不随本批正文发布。

## 范围与 DP

| 序号 | slug | 需求 | 本批任务 |
| ---: | --- | --- | --- |
| 089 | `full-text-search` | VBP-034 · `ed5087bc-fa66-4ea4-a49e-c78247bde3b1` | `86628c38-b99b-4ffb-a4ad-9efc1d7d8282` |
| 090 | `vector-database` | VBP-034 · `ed5087bc-fa66-4ea4-a49e-c78247bde3b1` | `3d459853-f1e5-473d-978e-5aa6931f02be` |
| 091 | `embedding` | VBP-035 · `dabda955-1b42-4ec7-b6d6-9f84e9a5f21b` | `4ef6ea14-0f17-4635-8050-bcc0c728608b` |
| 092 | `semantic-search` | VBP-035 · `dabda955-1b42-4ec7-b6d6-9f84e9a5f21b` | `38914e6c-2853-40d1-818a-d12042111890` |
| 093 | `rag` | VBP-035 · `dabda955-1b42-4ec7-b6d6-9f84e9a5f21b` | `a4dd9b7d-2cd4-4b66-b3f2-b1ea20d62bbd` |
| 094 | `retrieval` | VBP-036 · `bc9c02c2-4f69-4bd1-9ab9-d42374e22f8b` | `912b7059-79f9-48e2-944c-d2242daf2782` |
| 095 | `chunking` | VBP-036 · `bc9c02c2-4f69-4bd1-9ab9-d42374e22f8b` | `b43be190-6f55-42d0-980c-0def48d83434` |
| 096 | `reranking` | VBP-036 · `bc9c02c2-4f69-4bd1-9ab9-d42374e22f8b` | `138c618e-56e2-42af-80d6-8fa514e47540` |
| 097 | `hybrid-search` | VBP-037 · `9d74df3e-ec68-4804-b067-53d46fa15c0a` | `57c991d8-eb13-4f25-a6da-29dd0d9dabd3` |
| 098 | `vector-store` | VBP-037 · `9d74df3e-ec68-4804-b067-53d46fa15c0a` | `53bb3a78-68e8-42ee-8888-d28d2a9726ca` |

## 先写机制差异

| 词条 | 这页让读者观察的机制 | 本页明确的边界 |
| --- | --- | --- |
| 全文搜索 | 分词、倒排表和 AND/OR/短语查询怎样组成候选集 | 语言配置、解析器、词典和排序配置会改变命中；命中不等于语义相似 |
| 向量数据库 | 向量、ID、payload 与过滤条件怎样影响近邻候选 | 编码器先生成向量；距离近不代表权限或业务条件满足，近似索引也可能漏召回 |
| 嵌入 | 编码器把词、句子映射到可比较的向量空间 | 维度、模型版本、预处理和度量必须兼容；相似度不是答案概率 |
| 语义搜索 | 查询/文档编码、top-k/阈值和重排怎样影响候选顺序 | 分数要靠标注解释；召回阶段漏掉的文档无法由重排找回 |
| RAG | 检索资料、证据片段和生成回答的四步链路 | 生成模型仍可能越过资料；索引更新、资料冲突与上下文位置都需要检查 |
| 检索 | 查询、过滤、limit 和读取状态怎样决定候选集 | retriever 返回候选，不替用户阅读原文，也不自动证明授权 |
| 分块 | 边界、大小、重叠和结构保留怎样改变可检索片段 | 分块不是越小越好；Unicode 码点/Token、结构和问题集都会影响选择 |
| 重排序 | Cross-Encoder 逐对检查候选后重新排位 | 只能处理送入窗口的候选；扩大窗口是扩大输入，不等同于重排找到新文档 |
| 混合搜索 | 关键词路由与向量路由如何用 RRF 合并排名 | 两路分数不在同一量纲；硬过滤、权限和融合窗口仍会限制结果 |
| 向量存储 | point/记录、内容指针、版本和 upsert 如何保持可追溯 | 向量库保存的是可查询状态，不是事实真相；模型、维度、命名空间与同步状态必须对应 |

## 公开资料与正文锚点

每个词条均阅读并在正文 `sources` 映射四份公开资料；以下保留 URL 和锚点，便于后续复核。

### 089–090 · VBP-034

- `full-text-search`：PostgreSQL [全文搜索导论](https://www.postgresql.org/docs/18/textsearch-intro.html)（`text-definition`, `text-analysis`）；PostgreSQL [控制文本搜索](https://www.postgresql.org/docs/18/textsearch-controls.html)（`text-ranking`）；SQLite [FTS5](https://sqlite.org/fts5.html)（`text-positions`）；Elastic [match query](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-match-query)（`text-configuration`）。
- `vector-database`：Qdrant [Points](https://qdrant.tech/documentation/manage-data/points/)（`vector-records`）；Faiss [Getting started](https://github.com/facebookresearch/faiss/wiki/Getting-started)（`vector-distance`）；Malkov/Yashunin [HNSW](https://arxiv.org/pdf/1603.09320)（`vector-index`）；Qdrant [Filtering](https://qdrant.tech/documentation/search/filtering/)（`vector-filter`）。

### 091–093 · VBP-035

- `embedding`：Mikolov 等 [Word2Vec](https://arxiv.org/pdf/1301.3781)（`embedding-learning`）；Reimers/Gurevych [Sentence-BERT](https://arxiv.org/html/1908.10084)（`embedding-sentences`）；Hugging Face [Feature Extraction](https://huggingface.co/tasks/feature-extraction)（`embedding-output`）；Sentence Transformers [Computing Embeddings](https://www.sbert.net/examples/sentence_transformer/applications/computing-embeddings/README.html)（`embedding-config`, `embedding-length`）。
- `semantic-search`：Karpukhin 等 [DPR](https://arxiv.org/pdf/2004.04906)（`semantic-encoding`）；Sentence Transformers [Retrieve & Re-Rank](https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html)（`semantic-rerank`）；Thakur 等 [BEIR](https://arxiv.org/pdf/2104.08663)（`semantic-generalization`）；Stanford IR book [precision/recall](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-unranked-retrieval-sets-1.html)（`semantic-evaluation`）。
- `rag`：Lewis 等 [RAG](https://arxiv.org/pdf/2005.11401)（`rag-definition`, `rag-original`）；Hugging Face [RAG](https://huggingface.co/docs/transformers/model_doc/rag)（`rag-index`）；Liu 等 [Lost in the Middle](https://arxiv.org/pdf/2307.03172)（`rag-context`）；Es 等 [RAGAS](https://arxiv.org/pdf/2309.15217)（`rag-evaluation`）。

### 094–096 · VBP-036

- `retrieval`：Stanford IR book [Boolean retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/boolean-retrieval-1.html)（`retrieval-definition`）；Elastic [Retrievers overview](https://www.elastic.co/docs/solutions/search/retrievers-overview)（`retrieval-stages`）；Karpukhin 等 [DPR](https://arxiv.org/pdf/2004.04906)（`retrieval-output`）；PostgreSQL [Controlling Text Search](https://www.postgresql.org/docs/18/textsearch-controls.html)（`retrieval-relevance`）。
- `chunking`：Microsoft [Chunk large documents](https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents)（`chunk-purpose`）；LangChain [Recursive splitter](https://docs.langchain.com/oss/python/integrations/splitters/recursive_text_splitter)（`chunk-size`, `chunk-language`）；Unstructured [Chunking](https://docs.unstructured.io/open-source/core-functionality/chunking)（`chunk-structure`, `chunk-provenance`）；Chroma [Evaluating Chunking Strategies](https://www.trychroma.com/research/evaluating-chunking)（`chunk-evaluation`）。
- `reranking`：Sentence Transformers [Retrieve & Re-Rank](https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html)（`rerank-pairs`）；Nogueira/Cho [Passage Re-ranking with BERT](https://arxiv.org/pdf/1901.04085)（`rerank-learning`）；Cohere [Rerank overview](https://docs.cohere.com/docs/rerank-overview)（`rerank-index`）；Elastic [Rescore](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/rescore-search-results)（`rerank-window`）。

### 097–098 · VBP-037

- `hybrid-search`：Microsoft [Hybrid search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview)（`hybrid-definition`）；Elastic [RRF](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)（`hybrid-calculation`, `hybrid-window`）；Weaviate [Hybrid search](https://docs.weaviate.io/weaviate/concepts/search/hybrid-search)（`hybrid-scales`）；Cormack 等 [RRF paper](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf)（`hybrid-evaluation`）。
- `vector-store`：LangChain [Vector stores](https://docs.langchain.com/oss/python/integrations/vectorstores)（`store-definition`, `store-lifetime`）；Qdrant [Points, Vectors and Payloads](https://qdrant.tech/course/essentials/day-1/embedding-models/)（`store-record`）；Pinecone [Upsert records](https://docs.pinecone.io/guides/index-data/upsert-data)（`store-upsert`）；Chroma [Updating data](https://docs.trychroma.com/docs/collections/update-data)（`store-sync`）。

## ZCode 协作记录

每条词条都分别运行了真实 ZCode reader 和 language 会话。reader 只提供零基础读者追问，language 使用项目的 `vibepolaris-zcode-partner` 与 `humanizer-zh`；主助手逐条核对反馈并提交正文，ZCode 没有直接写入代码。会话材料、提示和结果的 SHA-256 前 12 位作为可复核指纹。

| slug | reader 会话 | language 会话 | 材料/提示/结果指纹（依次） |
| --- | --- | --- | --- |
| full-text-search | `sess_40537852-91df-4a10-aaa1-b1e4ae780940` | `sess_c616f247-34f8-4509-89a2-3e19c126df02` | `1b31c27ea4de / d24167a15395 / 9236c79c6407 / 5c90f44379d2 / 54b32ada01d8` |
| vector-database | `sess_7ce74965-71e5-4788-84ee-e85b97feee7e` | `sess_1c48f0ff-3c4e-4219-9ac3-02ddef7fb946` | `5bfb8a1950aa / d059a155b83f / 492b181a9fc3 / 6ea878533826 / d6aee540393b` |
| embedding | `sess_573799bd-5916-4b58-bd34-6771b20d43f4` | `sess_aa586ce3-f3a7-45f2-aa2d-735d9773b82c` | `7a174b61e73e / a759cf923536 / bfec6e292532 / d4ad7e2cb982 / 604292f15c3a` |
| semantic-search | `sess_10512ff8-fb0e-42eb-a1c9-a983fd8c3a78` | `sess_c6d0db5b-b812-4e46-b081-726b7b2046eb` | `7cb8b669441b / 3ea5039e4d1a / a6fa3e576ee4 / b64693430f77 / 31748f70950d` |
| rag | `sess_b1678754-2196-4b32-9561-a8ed9b59022a` | `sess_bb02a663-c028-4899-875e-0d03d8f23ecb` | `a84887ce1096 / 79d639dbea52 / 292f3e1efd9e / 9dd934241222 / b8553e22c222` |
| retrieval | `sess_033df68c-fecb-4bde-b744-06b86cfb6b1f` | `sess_b50abd5d-73f9-4481-9e10-094d2990c246` | `465ebed26f06 / 040269955f35 / 31eccaabb79d / 9dfb4599803b / 9c6e14aefedb` |
| chunking | `sess_6ae74db5-21bc-4892-89c9-9a123241cc7a` | `sess_8d0ddb7c-191c-4965-98db-5bce53ce7886` | `39540c51caf2 / a7d3833bd0c1 / b93385804785 / dbd7623513d2 / 63616f9701df` |
| reranking | `sess_00616ab3-dd7f-4880-ad81-1f5a7e428854` | `sess_133c2a40-9f76-41e8-bc7c-ee3d129d00f9` | `cbc4b80f1492 / 2106d02b6b19 / ef9a13624bfb / b2a4605d11ae / 1c031b328fa8` |
| hybrid-search | `sess_9a597b49-8ead-4598-9554-2432e3a72345` | `sess_ff25f68d-ade0-45b9-8eeb-9dcad181f6b5` | `a23cbd95bc05 / 17cf3dd28c86 / 71cb58d88633 / 04597364df52 / ae6365d5f819` |
| vector-store | `sess_563c0197-a0a4-4b01-8960-5b9af972c3ba` | `sess_1c3da499-2d53-46f6-9620-ccd81e58b330` | `24d5298e54c6 / 9d5341e84609 / 7d74a50c13c6 / 78e22f5ec840 / bec1c6b4964e` |

### 反馈取舍

reader 反馈主要补足 token/词项、向量编码器、候选集与授权、分块单位、重排窗口、RRF 的排名合并和向量库版本同步；language 反馈主要压低术语密度、删掉空泛转折并把边界改成可观察的句子。已采纳的修改都由主助手在实际 diff 中复核；没有把“分数高”“距离近”写成事实正确，也没有把演示固定数据写成真实后端能力。

## 变更边界与验证记录

- 正文改动集中在 `components/terms/RetrievalConceptPages.tsx`、`SemanticConceptPages.tsx`、`SelectionConceptPages.tsx`、`EvidenceConceptPages.tsx`；本批没有修改四组 Lesson 文件、词条登记或本地交互逻辑。
- 当前分支已运行 `git diff --check`、`npm ci` 和整批 `npm run build`；2026-10-01 构建通过（Next.js 16.3.3，TypeScript、静态页 117/117 均通过）。安装器报告仓库现有依赖审计中的 2 条漏洞提示，本批没有执行自动升级。发布分支会从最新 `origin/main` 只 cherry-pick 正文提交后再次构建。
- 本地浏览器验收已覆盖十条路由的正文关键词，并对每条词条至少操作一个现有演示控件；全屏本地预览还检查了向量存储的写入、查询结果和版本说明。生产验收再检查十条路由 HTTP 200、关键词和一条代表性交互；当前 CUA 会话未提供可设置窄屏视口的能力，因此不把窄屏结果写成已验证。
- 生产发布由一个批次发布分支统一完成，记录镜像提交号、部署目录、健康检查和上一版回滚目录；若任一步失败，不把 DP 任务移为 done。
- `D:/Obsidian/gysnote` 在当前 macOS 工作区不存在，本批不写入 Obsidian。

### 实际发布结果

- PR [#261](https://github.com/Gyschuaner/VibePolaris/pull/261) 已合入 `main`，合并提交为 `4be7a885b08d3feb073bef82882a9af9a925d751`；主线发布分支只包含四个正文组件，未带本记录和 Lesson 改动。
- 生产当时已运行未合入主线的 VBP-049 新闻版本 `ea338085184bfa1e1188d70570068ec59533d474`。为保留线上功能，部署镜像从该线上提交构建，再叠加本批正文；部署 overlay 分支为 `release/VBP-035-prod-overlay-20261001`，镜像提交 `b3b079cfa40401805f3d8e137b2bff8946cdf63f`。
- DP 部署记录为 `4166517b-5ddd-42f6-9d1c-81c1cf19db82`（`deploy-vbp035-037-content-batch-89-98-prod-20261001`）。生产目录 `/opt/vibepolaris/releases/20261001T110733Z-b3b079c`，当前容器 `healthy`；回滚目录 `/opt/vibepolaris/releases/20261001T094545Z-ea338085`，旧镜像仍保留。
- 公网验收：089–098 十条 `/terms/<slug>` 路由均 HTTP 200，正文关键词逐条通过；`/news` 仍 HTTP 200，新闻内容保留。生产浏览器复验全文搜索 OR 命中和向量存储写入/查询状态；本次只公开文字，演示状态仍为浏览器本地状态。
- 十个批次 DP 任务已 done，VBP-034、VBP-035、VBP-036、VBP-037 已 released。发布 PR 附件工具因当前线程附件数量上限未能挂载 PR，PR 本身已存在并可直接访问。
