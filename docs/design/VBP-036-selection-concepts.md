# 第021批：检索、分块、重排序 · VBP-036

## 读者与机制差异

资料检索中的三个相邻概念，使用虚构的退款资料区分“选出候选、决定处理单位、重新安排阅读顺序”。正文独立说明定义、因果过程、边界；没有访问真实退款记录或调用模型。

| 词条 | 初态 → 操作 → 可见变化 → 结果/停止 | 首图 / 阅读编排 |
| --- | --- | --- |
| retrieval | 四篇文档 → 查询、身份、最多数量 → 词项匹配候选突出 → 单独读取这些原文；赛事空结果不允许读取 | 2×2文档选中子集；候选入口与原文错位对照 |
| chunking | 完整原文 → 字符长度/重叠或段落切分 → 真实区间块，点击对应原文高亮 → 检查完整条件句；24/8没有完整句，段落保留 | 原页拆成三个横向错位片段；原文常驻，块和边界检查逐步展开 |
| reranking | 固定A/C/B候选 → 逐篇核对查询条件 → 条件标注累计 → 全部核对后排序；窗口2缺B，窗口3可排B优先；空候选停止 | 文档与条件核对；查询/原文成对读取，随后纵向原文列表 |

## 实际阅读与正文映射

每页四份公开原始资料，共十二份。读取具体方法和适用限制，未把厂商实现当成统一定义。

| 页 / 正文位置 | 资料 / 支持的论断 |
| --- | --- |
| retrieval-definition | [Manning、Raghavan、Schütze：Boolean retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/boolean-retrieval-1.html)：资料集合与信息需求，不限AI回答 |
| retrieval-stages | [Elastic：Retrievers overview](https://www.elastic.co/docs/solutions/search/retrievers-overview)：候选检索与多路组合；教学词项选择不冒充该接口 |
| retrieval-output | [Karpukhin等：DPR](https://arxiv.org/pdf/2004.04906)：小候选集合交给阅读器；配对编码器是论文方案 |
| retrieval-relevance | [PostgreSQL18：Controlling Text Search](https://www.postgresql.org/docs/18/textsearch-controls.html)：排序因素、应用相关性，0–1归一化不是概率 |
| chunk-purpose | [Azure AI Search：Chunk large documents](https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents)：输入限制与长文多主题，不引用模型特定上限或中英文token换算 |
| chunk-size、chunk-language | [LangChain：Splitting recursively](https://docs.langchain.com/oss/python/integrations/splitters/recursive_text_splitter)：分隔符、长度函数、重叠与中文；本例不是递归切分器 |
| chunk-structure、chunk-provenance | [Unstructured：Chunking](https://docs.unstructured.io/open-source/core-functionality/chunking)：结构元素、by_title、过长元素与原始元素出处 |
| chunk-evaluation | [Chroma：Evaluating Chunking Strategies](https://www.trychroma.com/research/evaluating-chunking)：相关片段覆盖与干扰/重复，有限语料和合成查询的局限，不能推导通用最优块长 |
| rerank-pairs | [Sentence Transformers：Retrieve & Re-Rank](https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html)：先检索后逐对Cross-Encoder；模型不是重排唯一方法 |
| rerank-learning | [Nogueira、Cho：Passage Re-ranking with BERT](https://arxiv.org/pdf/1901.04085)：查询/段落成对输入与标注训练，数据集结论限定范围 |
| rerank-index | [Cohere：Rerank overview](https://docs.cohere.com/docs/rerank-overview)：返回原列表索引与相关性分数，须正确映射原文 |
| rerank-window | [Elastic：Rescore search results](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/rescore-search-results)：各分片窗口与查询/脚本/学习排序，本例没有分片模拟 |

## 实现契约与 review

- 检索先身份过滤→词项匹配→按目录顺序截取数量；D只在运营/退款/数量3进入。服务端权限未实现，正文明确这是前端教学。
- Unicode码点区间为[start,end)，界面1起点。相邻固定块步长为size-overlap，最后一个结束时停止，不产生重复尾块。段落分隔符保留在前一块，实现全字符覆盖；无token估算。完整句检测是字符串包含，不是语义模型。
- 重排按明确人工事实满足查询条件的数量，稳定排序；文档对象和文本不改。初始候选是固定列表，不伪造检索来源。零候选不提供核对或排序成功。
- 共用Reveal保留收起时旧内容、aria-hidden/inert阻止隐藏区交互；原文切换用States双向淡入淡出。输入变化取消有效结果，缓存只用于退出过渡；无定时器或后台循环。
- 三页首图为有限CSS动画，ConceptHero可重播、可见/后台暂停；reduced-motion直接显示完整状态。继承主题、角标、完整网址与点击摘录、目录、术语卡片、星图。
- 元数据仅修正retrieval/reranking解释，保留别名/分类/关系；六个历史锚点由各Legacy与公共学习区保留。无需新依赖。

## 验证与交付阶段

模型检查 `node --experimental-strip-types --test tests/selection-teaching.test.mjs` 已通过，覆盖权限/空候选、Unicode边界、重叠与全区间、完整句、候选缺失和原文不变。应用构建通过（91个静态页、80个公开词条）。真实Chrome 1470×956与390×844完成本批正常/空结果、条件切换、重置、Enter、第四引用摘录及回跳（目标低于页头）、六锚点检查；手机页面宽度390、演示342，无横向溢出。首图有限播放/重播终态与展开收起中间态已观察。dev集成尚待完成，不把本机验证写成远端或生产部署。Obsidian配置路径在本机不存在，未写空文档；未创建飞书正式方案。

### 浏览器结果与缺陷修复

- 检索读者A/B，运营/3条A/B/D，打印C，赛事空且读取禁用；原文只在读取后出现。BUG-1B26DD08：快速变更条件时退出中的原文被新候选替换，分离readPacket后同路径回归，未读取D不再出现，DP已closed。
- 分块24/8：6块、重叠覆盖40字符、没有完整条件句；段落模式：3块、0重复、1块保留完整句。点击第三字符块与第二段落块对应原文，范围分别33–56、32–76；重置清除标记并恢复24/8，隐藏区inert，收起时opacity仍有中间值。
- 重排窗口2按条件得到C/A，无完整匹配；窗口3得到B/C/A；申请入口查询得到A/B/C；零候选两动作都禁用。逐篇原文终态只有当前对象可见，旧对象透明/不可交互；重置恢复默认、结果渐出。
- 每页四份来源和常驻正文论断对应，厂商/论文范围限定，代码只执行明确词项、字符切片与事实计数，无模型调用或伪造测量。实际用户视觉认可尚未取得；没有扩大为全站回归。
