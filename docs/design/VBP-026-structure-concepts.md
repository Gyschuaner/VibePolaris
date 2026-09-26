# 第011批：数据库模式、连接查询与唯一约束 · VBP-026

2026-09-27。父需求 VBP-012；实际状态以 DP 为准。本批针对三个待处理词条，沿用已确认的阅读能力，不套用同一种演示。保留规范名称、别名、关系与六个旧锚点。

## 读者目标与机制差异

| 页面 | 读完能判断什么 | 首图 / 主体操作 / 阅读编排 |
| --- | --- | --- |
| database-schema | 结构定义不等于数据；加列与补旧数据不同，收紧约束需验证现有值；PG namespace 的另一种含义 | 结构蓝图追加列及两个 NULL；左侧定义与右侧记录分别变化；结构/数据对照、变更实例、目标建表语句与命名空间解释 |
| join | 一行结果来自哪一对记录；一对多不应随意去重；LEFT 保留谁、NULL 补在哪边 | 两次借阅向结果配对；2×3 候选矩阵与四种结果；配对正文、未匹配查询及 ON/WHERE 边界 |
| unique-constraint | 预查不保证写入时仍无冲突；唯一性范围与非空要求各自定义 | 同邮箱两请求，第二次被挡住；双请求与写入台账；竞争解释、组合规则、部分索引旁支、NULL 实现差异 |

教学边界：不访问数据库，不解析任意 SQL；JOIN 的 #65 是特意保留的未受相应外键约束的旧数据，不是外键会允许的新增；注册模型把成功写入视为已提交，实际数据库可能等待其他事务。schema 模型只修改两条固定旧记录，不声称生产变更都能即时完成。

## 已读资料与正文映射

均为公开原始文档，阅读日期不是发布日期。每页四份，全部通过正文角标生成书目与动态摘录；无发布日期则留空。PG 18 资料由 PostgreSQL Global Development Group 发布，MySQL 8.4 资料由 Oracle 发布，SQLite 为官方文档。

| 页面 / 来源 | 完整 URL | 支持的论断 / 段落 |
| --- | --- | --- |
| 模式 · PG Table Basics | https://www.postgresql.org/docs/18/ddl-basics.html | 列/类型与记录区别：schema-definition |
| 模式 · PG Modifying Tables | https://www.postgresql.org/docs/18/ddl-alter.html | 无默认值新列 NULL、收紧非空前验证旧数据：schema-new-column、schema-validation |
| 模式 · PG Constraints | https://www.postgresql.org/docs/18/ddl-constraints.html | 键、引用与唯一性约束：schema-contract |
| 模式 · PG Schemas | https://www.postgresql.org/docs/18/ddl-schemas.html | 命名空间、同名表与 search_path：schema-namespace |
| JOIN · PG Joins Between Tables | https://www.postgresql.org/docs/18/tutorial-join.html | 按条件组合行、别名与字段来源：join-definition |
| JOIN · PG Table Expressions | https://www.postgresql.org/docs/18/queries-table-expressions.html | 每个匹配生成行、CROSS 乘积、LEFT 补行：join-multiplicity、join-outer |
| JOIN · SQLite SELECT | https://www.sqlite.org/lang_select.html | 外连接 NULL 补行在 ON 后、WHERE 前，FALSE/NULL 不通过 WHERE：join-where |
| JOIN · MySQL JOIN Clause | https://dev.mysql.com/doc/refman/8.4/en/join.html | LEFT 配合右侧键 IS NULL 查未匹配：join-missing |
| 唯一 · PG Constraints | https://www.postgresql.org/docs/18/ddl-constraints.html | 唯一约束与主键区别、组合、NULL：unique-definition、unique-composite、unique-null |
| 唯一 · PG Unique Indexes | https://www.postgresql.org/docs/18/indexes-unique.html | 自动建立 B-tree、避免重复建相同索引：unique-index |
| 唯一 · PG Index Uniqueness Checks | https://www.postgresql.org/docs/18/index-unique-checks.html | 插入时核对、未提交冲突需等待再查，预查竞争边界：unique-race |
| 唯一 · PG Partial Indexes | https://www.postgresql.org/docs/18/indexes-partial.html | 按谓词限定参与唯一性检查的行：unique-partial |

## 实现与 review

复用 ConceptArticle、ConceptHero、Reveal、States、术语卡片、目录与引用，不新增依赖、全局动画循环或数据库模拟引擎。首图有限播放、可重播且不可见/后台暂停；公共减少动态效果逻辑与局部静态终态保留可读信息。

正文不展开补充也能解释定义、过程、结果与边界；重点只加粗关键结论。语义图标用于结构、配对、邮箱与冲突；品牌星星只沿用标题及真实关联星图。公开关系只采用已有 relatedSlugs，不按分类补边。正文宽度内的布局按390px调整，控件至少44px。

初次构建指出 flatMap 对带 NULL 的行推断过窄，已指定 JoinedRow 泛型。review 时将重置过程中的结果内容改成固定状态层，避免先删除文字再淡出。下方记录实际验证，不把构建或源码检查当作视觉验收。

## 验证与交付

- 最终 `npm run build` 通过；一项纯逻辑检查覆盖旧 NULL 验证、2/3/3/6 配对及两种写入顺序、邮箱/NULL 唯一规则，通过。未运行无关全套检查。
- 桌面1470px：结构新增后两行 NULL，补 #42 后设非空被拒绝，补 #78 后成功，恢复结构可观察到 opacity/网格高度过渡，隐藏层 inert。JOIN 四种结果2/3/3/6及书/借阅侧补NULL正确；注册 B 先写 A 冲突，关闭约束两行，默认两NULL两行、NOT DISTINCT 第二NULL拒绝，重置清空。
- 390px：三页关键操作及宽度通过（scrollWidth=innerWidth=390）；结构变更键盘完成成功/拒绝；JOIN 借阅 LEFT 的缺失书目、矩阵与换行代码可读；注册 A 成功 B 冲突，台账只有 #101。
- 引用：JOIN [4] 小三角 Enter 展开实时摘录，返回 join-missing 段落 top≈262px；模式 [4] 摘录生成并返回 schema-namespace，落点≈262px；唯一 [4] 返回 unique-partial 自动展开原文 details，落点≈262px，summary Enter 可收起。其余16个来源映射目标经源码核对存在。
- BUG-B1B8FA01 已闭环：原 States 隐藏六行也占高684px，初态仅57px内容；局部改为 Reveal，实际初态57px、INNER333px、隐藏面板0px，保留过渡，390px无溢出。
- 服务构建切换期间旧地址曾出现 ChunkLoadError；服务器最终脚本200，改以 localhost:3001 使用同一本机服务验证，未改浏览器缓存或用户偏好。不是把加载失败当成通过。
- 减少动态效果与其他主题仅代码检查，未更改用户系统或主题偏好。三张首图的桌面终态已实际查看，分别为结构新增列、两条配对结果与邮箱冲突；后续dev集成记录见交付补充。
- 首屏review另发现结构首图的 Blueprint 被纵向 flex 收缩至5.6px；局部调整行高、间距并禁止 SVG 收缩，桌面标题已收为52.92px的一整行。BUG-93807975 跟踪本页首屏布局修复，实际回归后已关闭（图标28×28，标题整行）。源码未修改其他文章的字号或全站图标样式。

Obsidian 的 Windows 路径在当前 Mac 不存在，跳过。没有生成需要关联飞书的正式方案正文；本次代码相关研究与 review 保留在此，业务状态及实际测试记录在 DP。
