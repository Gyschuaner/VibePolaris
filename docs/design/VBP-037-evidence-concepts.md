# 第022批：混合搜索、向量存储、引用 · VBP-037

## 机制与阅读安排

三篇延续已有阅读壳、主题、目录、术语卡片、参考文献和局部星图。常驻正文解释定义、输入输出、相邻概念和适用边界，不播放动画也能通读。

| 词条 | 初态 → 操作 → 证据 / 停止 | 首图 / 主体组织 |
| --- | --- | --- |
| hybrid-search | 两份预设排名 → 路线开关与窗口 → 同ID按1/(60+rank)合计，截取前三 → 两路关闭时为空 | 两路候选汇聚；排名双列、贡献条、合并结果；比较两种融合信息 |
| vector-store | 空内存 → 写入A/B，原文版本切换 → 旧记录仍可被查到 → 当前版本过滤为空；同ID同步覆盖、删除后不再返回 | 单记录字段版本更新；原文与保存对象分栏，不重复ANN地图 |
| citation | 固定草稿与三段资料 → 标记来源、点角标定位 → 对照完整/部分/无支持 → 更换材料清空判断 | 句子角标对应原文范围；草稿与可读资料错位，无生成聊天 |

## 实际阅读与正文映射

每页四份公开一手资料，共十二份；正文均用自己的话组织。只概括支持范围，不把产品功能或有限论文实验写成普遍保证。阅读日2026-09-27，未知发布日期留空。

| 正文锚点 | 已读来源与适用范围 |
| --- | --- |
| hybrid-definition | [Azure：Hybrid search overview](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview)：全文与向量并行、RRF、可继续语义重排；不是混合搜索唯一实现 |
| hybrid-calculation、hybrid-window | [Elastic：Reciprocal rank fusion](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)：排名从1开始、每路窗口、贡献求和再截取；没有复制API特定默认值 |
| hybrid-scales | [Weaviate：Hybrid search](https://docs.weaviate.io/weaviate/concepts/search/hybrid-search)：排名融合与归一化分数融合的信息差异；正文不假定所有规则都要归一化 |
| hybrid-evaluation | [Cormack、Clarke、Büttcher，2009：RRF原论文](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf)：k60及TREC/LETOR实验，结果限定实验范围 |
| store-definition、store-lifetime | [LangChain：Vector stores](https://docs.langchain.com/oss/python/integrations/vectorstores)：通用添加/删除/相似查询与内存实现；不同后端能力不同 |
| store-record | [Qdrant：Points, Vectors and Payloads](https://qdrant.tech/course/essentials/day-1/embedding-models/)：point三个字段，payload的文字/数字元数据和过滤；本例字母ID不是Qdrant API参数 |
| store-upsert | [Pinecone：Upsert records](https://docs.pinecone.io/guides/index-data/upsert-data)：同ID整体覆盖，部分更新另有接口，不能推广所有厂商一致 |
| store-sync | [Chroma：Updating Data](https://docs.trychroma.com/docs/collections/update-data)：无显式embedding时更新document重新编码，维度校验与upsert；本例手工二维向量不是实际编码器 |
| citation-location | [Chicago：Notes and Bibliography](https://www.chicagomanualofstyle.org/tools_citationguide/citation-guide-1.html)：注释具体页码与书目区分，无页码电子文本可用章节；未把范例中的书籍当作已读来源 |
| citation-selector | [W3C：Web Annotation Data Model](https://www.w3.org/TR/annotation-model/)：TextQuoteSelector、前后文，TextPositionSelector起止位置与编辑脆弱性；技术标注而非引文格式强制要求 |
| citation-support、citation-limits | [Gao、Yen、Yu、Chen，2023：ALCE](https://arxiv.org/pdf/2305.14627)：引用支持/必要性与部分支持评估限制；演示不是NLI或自动核查 |
| citation-identifiers | [Crossref：Display guidelines](https://www.crossref.org/display-guidelines/)：完整HTTPS DOI与出版方维护目标网址；稳定入口不证明真实性 |

## 实现契约与 review

- RRF默认B/A/D/C，显示前三；每路窗口1只有A/B，同分按ID排序；原始分数不参与。预设排名说明在正文，无冒充实际检索。
- 向量记录包含ID/版本/vector/text，upsert稳定替换；原文版本与记录版本独立。手工单位向量A-v1[1,0]、A-v2[.96,.28]、B[0,1]，固定查询[1,0]，余弦>.2且最多一条。过滤比较当前原文版本，真实系统需要自己的版本机制。源文件更新/删除不是自动执行。
- 引用标记与核对分开；原文支持必须保留渠道、条件、通常时效。标记可对任何选定段落生成，不能因此变成绿色通过。固定对照表不宣称真实性验证。
- Reveal保留退出对象快照且隐藏时inert；结果只有执行时更新快照，参数变化仅使结果失效。States保留版本/句子双向过渡；删除时保留退出记录文本，不插入未读新结果。无计时器或永久React帧循环。
- 首图三种机制不同，有限CSS单轮、可见与后台暂停、重播、减少运动直接可读。保留元数据别名/分类/真实关联；修正“向量存储总要建索引”和“混合搜索总要归一化”；保留六历史锚点。不引入依赖。

## 验证与实际阶段

模型检查覆盖融合贡献、去重、候选窗口、空路线、同ID替换、旧版本过滤、删除和完整/部分/无支持。构建及限定真实浏览器结果在完成后补入，不预报通过。没有main或生产发布；Obsidian指定Windows路径在本机不存在，跳过。无需新建空飞书文档。

### 本地验收证据

`npm run build`通过（94静态页，83公开词条）；`node --experimental-strip-types --test tests/evidence-teaching.test.mjs`一项组合检查通过。构建初次发现数字属性选择器未加引号，修正后通过；之后核对Qdrant原标题并构建最终源码。`git diff --check`通过。

真实Chrome 1470×956与390×844完成：

- 混合默认B/A/D，贡献0.03252/0.03227/0.01613；仅词项A/B/C，窗口1只有A/B且各0.01639，两路关闭为空。Enter可融合、重置恢复；收起opacity约0.032且inert，保留旧输出直到退出。
- 空存储无依据，写入v1后源文v2仍返回旧A/v1并提示过期；当前版本过滤为空；同步覆盖后仍两条、A/v2余弦0.96、七个工作日；删除A再查为空，重置清空。Enter可写入；退出记录和旧结果opacity约0.052且inert，保存版本不被原文切换污染。
- 引用先标记，点角标高亮选定原文，完整有限定句支持；全部保证只有部分支持；免费/门店来源不支持。更换输入核对禁用、重置渐出opacity约0.074且inert，Enter可标记。
- 三页第四引用点击摘录分别回到#hybrid-evaluation/#store-sync/#citation-identifiers，终态top约130px，低于固定页头。六历史锚点存在。
- 手机三页document宽390、演示342；展开状态截图可读、无横溢出。三种首图重播、有限iteration1，三页首图终态均opacity1；引用角标及依据终态可读，临时视口已还原。减少运动规则从CSS核对，未切换系统偏好。页面相关warn/error日志为空。

Skill review：四来源各映射真实段落、常驻正文足以理解过程与边界；原始排名、向量和判断均标明教学约定；三页核心画面与机制不同，未新增依赖或复制星图/鼠标循环。没有新增真实产品缺陷信号，不扩大测试。dev集成待完成，未声称远端或生产部署；用户视觉认可待反馈。

实际DP计划6715ce87-1f92-43f5-8c2e-d60267faefa4已完成，三用例passed；PR [#81](https://github.com/Gyschuaner/VibePolaris/pull/81)已创建并附加任务。dev合并及本地预览重启在下一阶段执行，完成后由DP记录权威状态；未部署远端。
