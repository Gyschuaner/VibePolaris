# 第019批：数据帧、全文搜索与向量数据库 · VBP-034

VBP-012 的第十九批。2026-09-27，以 `dev` 的 `8de498dd61600e57c1f5aa0c1c51946ce44f36ea` 为基线；负责人顾毅盛。按 concept-pages 与 ponytail full 完成，保留原有分类、别名、关联、六个历史锚点。纯浏览器教学数据，无外部数据库、模型、文件与中文分词服务。

## 机制差异与正文组织

| 词条 | 首图 | 主体操作与证据 | 阅读节奏 |
| --- | --- | --- | --- |
| 数据帧 | 四行来源筛出B/D，二维表保留列定义 | 行条件0/1/10天、字段投影；4×3→2×3→2×2→0×2，原始标签与内容保留 | 二维结构、并列的数据集区别、筛选原表/结果、聚合改变粒度、列式表示及执行边界 |
| 全文搜索 | 两个词项的文档集合求交 | 从固定词项数组生成倒排含位置；AND A/E、OR A/B/C/E、按序短语A；未知词与空查询 | 词项形成、词典/文档对照、高亮证据、配置默认值、排序与更新 |
| 向量数据库 | 查询与近邻的小型点场 | 全量精确欧氏距离top2；过滤候选、更新A位置、重算、空范围 | 记录三部分、等比例坐标与元数据、距离口径、HNSW索引的边界、原文核验 |

三者不是三图标换名词的同形曲线。每个首图有限CSS动画，继承 ConceptHero 的离屏/后台暂停、重播及减少动态效果。文章能够不播放、不展开而独立读懂；具体库能力不泛化为所有产品保证。

## 实读来源与正文对应

每篇四份公开一手资料，共十二份；不是只列搜索结果。文献日期未明确的不猜写。

数据帧：

1. [pandas 子集选择](https://pandas.pydata.org/docs/getting_started/intro_tutorials/03_subset_data.html)：读单列Series、多列DataFrame、布尔筛选、loc与iloc；对应 `frame-selection`、`frame-labels`。
2. [Polars Expressions and contexts](https://docs.pola.rs/user-guide/concepts/expressions-and-contexts/)：读表达式、select/with_columns/filter/group_by及输出形状示例；对应 `frame-operations`。
3. [Arrow Columnar Format](https://arrow.apache.org/docs/format/Columnar.html)：读语言无关内存格式、同类型数组、扫描/修改代价、空值与缓冲区；对应 `frame-storage`。不声称所有DataFrame基于Arrow。
4. [Spark SQL Guide](https://spark.apache.org/docs/latest/sql-programming-guide.html)：读SQL/同执行引擎及命名列Dataset、分布式对象；对应 `frame-execution`。不是把pandas行索引套到Spark。

全文搜索：

1. [PostgreSQL 18 Introduction](https://www.postgresql.org/docs/18/textsearch-intro.html)：读token→lexeme、词典、停用词、同义词、配置与文档关联；对应 `text-definition`、`text-analysis`。
2. [PostgreSQL 18 Controlling Text Search](https://www.postgresql.org/docs/18/textsearch-controls.html)：读ts_rank/ts_rank_cd、词频/接近/字段权重及应用相关性；对应 `text-ranking`。
3. [SQLite FTS5](https://sqlite.org/fts5.html)：读3.2短语有序词项、3.7布尔AND/OR、4.2词项记录位置；对应 `text-positions`。
4. [Elastic match query](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-match-query)：读text分析器、operator默认OR及AND、同接口语义字段例外；对应 `text-configuration`。

向量数据库：

1. [Qdrant Points](https://qdrant.tech/documentation/manage-data/points/)：读record/vector/payload与ID、管理接口；对应 `vector-records`。教学字母ID不冒充其真实API合法ID。
2. [Faiss Getting started](https://github.com/facebookresearch/faiss/wiki/Getting-started)：读IndexFlatL2、add/search、k近邻ID及距离平方；对应 `vector-distance`。本页显示开平方后距离，数值不同但排序同。
3. [Malkov / Yashunin HNSW原始论文](https://arxiv.org/pdf/1603.09320)：读摘要/引言、算法1/2/5的多层构建/搜索、ef候选与时间/召回代价；对应 `vector-index`。不把二维全量搜索冒充ANN。
4. [Qdrant Filtering](https://qdrant.tech/documentation/search/filtering/)：读payload/ID条件、业务约束、must AND及组合；对应 `vector-filter`。公开字段不是前端权限实现。

## review

- 原始metadata、relatedSlugs未改；只公开新增三页，覆盖变为65新流程+9历史=74，227待处理。早期批次四来源复核仍需完成。
- 固定记录推导结果，不写伪搜索相关分数；索引由词项数组生成，短语真正核对位置；0行保留字段；向量过滤先缩小候选。
- 输入/模式/坐标变化使旧检索报告失效并双向收起；保留旧报告供退出过渡，不在收起时先改成新内容。没有定时器、额外动画循环或新依赖。
- 标题使用普通陈述；定义、过程与主要限制常驻；加粗只用于核心判断，补充内容用现有双向过渡组件。参考资料小三角手动展开，不使用hover、引用计数徽标。
- 英文与网址可换行；五字“向量数据库”只在此页调整标题尺寸。移动版上下编排，不把整桌面画面缩小。

## 验证

`npm run build`通过：85个静态页面、74个公开词条。`node --experimental-strip-types --test tests/retrieval-teaching.test.mjs`通过一个组合机制检查：保留标签/投影维度/空行、倒排集合/正反短语顺序/未知与空查询、距离排序/先过滤/更新与空范围。未运行无关整站check。

桌面Chrome 1470×956：数据帧B/D、2×2、0×2、Enter重置4×3；全文AND A/E、OR A/B/C/E、短语A、未知词无匹配；向量全部B/A距离0.28/1.00，公开A/C距离1.00/2.83，更新后C/D距离2.83/4.00，归档0条及Enter重置。第四来源摘录均手动展开并回跳 `frame-execution` / `text-configuration` / `vector-filter`，顶部分别约129.8/129.8/129.9px，未被页头遮住。

390px数据帧：首图内容底624.3px、图底666.3px、正文始688.3px，无横向溢出；B/D投影2×2、空表0×2与Enter重置4×3、第四资料回跳261.94px。390px全文：首图内容底624.1px、图底666.3px、正文始688.3px；AND/OR/短语/未知词均一致，键盘全选删除后空输入Enter提示“请输入至少一个词项”，旧报告有inert，重置恢复默认查询。浏览器工具fill空字符串未清空控件，通过真实键盘核对，不把工具动作未发生记作产品Bug。390px向量：五字标题正常，图内文字底628.7px、图底663.2px、正文始685.2px；全部B/A、公开A/C、更新C/D、第二查询E/A与距离0/1.41、归档空候选、Enter重置均一致。三页窄屏第四来源回跳约262px。review补齐结果表头row语义与任意长查询报告换行，最终build再次通过；其余模型未变未重复机制测试。dev集成后仅核对三页核心流程与这两项小修正。当前Obsidian指定路径 `D:/Obsidian/gysnote` 在此Mac不存在，跳过同步。未创建空正式文档或飞书索引。
