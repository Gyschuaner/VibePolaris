# VBP-025 · 第010批：表、主键与外键

父需求 VBP-012。从 dev `9bc4aa369e585749800690b2115e605bf0d31b6a` 开始；三页进入本地与 dev 验收，不进入 main 或生产。

## 阅读目标与机制差异

共同场景是图书室。表页的 #42 山间来信、#12 河流手记、#78 夜空地图，与数据库页前三条一致。主键页单独讨论两册同名书，明确编号42/78并非同一册；外键页借阅记录分别以 loan_id 和 book_id 表达自己的身份与引用。

| 词条 | 正文要学会的判断 | 首图 | 主体交互 / 证据 |
| --- | --- | --- | --- |
| 表 | 一行是什么；筛选行、投影列、排序结果不改变原表 | 三列结构下逐行填入记录 | 原始表常驻，上下查询面板；切换列/条件后重新查询，空结果仍保留表定义 |
| 主键 | 同名不同记录；唯一非空约束与编号生成的区别 | 两册同名书稳定编号，42书名淡出更换，编号不动 | 左侧新记录，右侧身份条目；重复42和NULL拒绝，65同名通过；42改名不改编号 |
| 外键 | 引用必须有效；删除行为由策略决定 | 一个父记录连接两条借阅 | 两表并置；65拒绝，42通过；RESTRICT保留父子，CASCADE实际移除对应父子，78保留 |

先编写独立正文与论断来源映射，再实现状态与表现。没有自动轮播的实验控制；首图使用已有 ConceptHero 的有限播放、离屏/后台暂停与重播能力。主体复用 Reveal/States，在对象与反馈退出时保留DOM并过渡，未引入依赖或通用演示框架。

## 实际阅读的公开资料（2026-09-27）

每页四份原始资料，均打开正文；无可确认发布日期则不填日期，不把阅读日期冒充发布日期。资料映射定义在 `lib/relational-sources.ts`。

| 页 | 原始资料 / URL | 支持的论断与正文ID | 适用范围 |
| --- | --- | --- | --- |
| 表 | PostgreSQL 18 · Table Basics · https://www.postgresql.org/docs/18/ddl-basics.html | table-shape / table-types：行列、空表仍有定义、列类型 | 类型约束明确限定PG，不泛化SQLite |
| 表 | PostgreSQL 18 · Table Expressions · https://www.postgresql.org/docs/18/queries-table-expressions.html | table-filter：WHERE保留符合条件的输出行 | 读取结果，不修改源表 |
| 表 | PostgreSQL 18 · Select Lists · https://www.postgresql.org/docs/18/queries-select-lists.html | table-columns：返回列与结果表达式 | 不把结果列误作新增表列 |
| 表 | PostgreSQL 18 · Sorting Rows · https://www.postgresql.org/docs/18/queries-order.html | table-order：无ORDER BY不承诺次序 | 样例输入顺序只是教学选择 |
| 主键 | PostgreSQL 18 · Constraints · https://www.postgresql.org/docs/18/ddl-constraints.html | primary-key-identity / primary-key-composite：唯一非空、复合主键、每表一个 | 主键不要求值不可更新，稳定编号是设计选择 |
| 主键 | PostgreSQL 18 · Identity Columns · https://www.postgresql.org/docs/18/ddl-identity-columns.html | primary-key-generated：生成值仍需唯一约束 | PG identity语义 |
| 主键 | SQLite Autoincrement · https://www.sqlite.org/autoinc.html | primary-key-autoincrement：INTEGER PRIMARY KEY与自动分配，不重用算法及开销 | SQLite普通rowid表，不泛化所有主键 |
| 主键 | SQLite WITHOUT ROWID · https://www.sqlite.org/withoutrowid.html | primary-key-sqlite：历史NULL兼容与WITHOUT ROWID非空要求 | 更新2025-05-31；普通表部分声明有例外 |
| 外键 | PostgreSQL 18 · Constraints · https://www.postgresql.org/docs/18/ddl-constraints.html | foreign-key-reference / delete / null：引用、策略、非空是额外条件 | 样例显式RESTRICT；默认NO ACTION与延迟检查不混淆 |
| 外键 | SQLite Foreign Key Support · https://www.sqlite.org/foreignkeys.html | foreign-key-enforcement：每连接确认运行时检查 | 先有支持外键的构建，不假定默认开启 |
| 外键 | MySQL 8.4 · FOREIGN KEY Constraints · https://dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html | foreign-key-indexes：引用方索引要求/自动创建 | 与PG不自动创建引用方索引对照 |
| 外键 | PostgreSQL 18 · Modifying Tables · https://www.postgresql.org/docs/18/ddl-alter.html | foreign-key-existing：常规添加约束检查既有数据 | 不声称所有特殊迁移模式均立即验证 |

## 适用验收与 review

- 正文不播放、不展开也可解释定义、因果过程与主要边界；旁支SQLite实现差异/引用方索引放入可展开补充。
- 一共16个论断段落，角标和书目同一来源数据；摘录来自当前DOM，可返回折叠段落；每页保留6个旧锚点，既有 relatedSlugs 不改。
- 教学样例明确本地模型，不接真实DB；固定新增槽位只演示一次新借阅，不当成通用SQL引擎。
- 表原始三条不变，零行和零选择边界；主键失败不覆盖原对象；外键绝不留下无效引用；场景切换取消旧反馈，重置移除新增对象。
- 构建、一个纯逻辑检查与受影响桌面/390px实际浏览器操作；键盘、引用返回、过渡与无横溢出；主题/减少动态按代码检查，不改用户偏好。

实际执行和集成结果待追加；DP测试计划及执行为测试状态事实来源。Obsidian指定Windows库在本机不存在，本次跳过。

## 实际验证（2026-09-27）

- `node --experimental-strip-types --test tests/relational-teaching.test.mjs`：1个合并检查通过，验证筛选/排序不改源数组、主键拒绝不改旧记录、复合状态删除不产生孤儿。Node类型剥离提示为运行器提示，未新增依赖。
- `npm run build`：通过；浏览器发现排序辅助顺序问题后修复并再次构建通过。没有运行无关全量测试。
- 正常桌面1470px：表可借筛选得42/78、取消状态列只返回编号/书名，排序视觉12/42/78，65零行，全取消字段不能查询；源表不变。主键42和NULL拒绝、65同名新增、42改名编号保留、重置恢复2条。外键65拒绝、42新增第二借阅、RESTRICT拒删且保留两借阅；切换策略恢复一借阅，CASCADE删除42与引用行、78保留；删除后再次引用42拒绝。
- 390×844：三页展开操作后 document.scrollWidth 均390。表键盘查询/排序/空结果，主键键盘新增与改名，外键键盘重置/写入及级联分支均实际操作；查看了窄屏结果与连线画面，字段和控件没有横溢出。临时视口已恢复。
- 外键角标[2]跳到书目，三角键盘展开当前摘录，返回 `#foreign-key-enforcement`；主键SQLite书目展开摘录，返回 `#primary-key-sqlite`自动打开details，窄屏段落top约262px，在固定页头以下；summary可Enter收起。未把点击瞬间尚未结束的收起/滚动当作最终落点。
- 16个引用段落ID与sources映射一致且无重复。每页6个旧锚点保留；47个公开路由。没有改既有关联，也没有恢复旧测验。
- BUG-A7D290B1：表排序视觉12/42/78，初版DOM阅读42/12/78；改为按结果顺序组织可见对象，退出对象仍保留用于过渡。新构建在390px回归DOM12/42/78，与视觉一致；DP Bug已关闭。另外将外键65与已删除42的失败反馈拆成固定状态，避免旧反馈退出时被新输入改写。
- 代码检查主题变量、reduce规则与ConceptHero离屏/后台暂停；未更改用户主题或系统动态偏好，因此其他主题和系统reduce模式未做实际UI切换。新页浏览器console error/warn为空。

Skill review：不播放/不展开仍有定义、因果链与边界；三页在首图、交互空间和正文节奏上分别使用网格视图、身份卡与两表引用；图标表达对象职责，星星仅复用品牌/星图；失败不制造成功，状态切换使旧结果失效并保留退出过渡；旁支资料有明确实现限定。验收范围已完成，后续不追加全站回归。

## Git 与本地集成

实现提交 `51e37a4`；PR [#68](https://github.com/Gyschuaner/VibePolaris/pull/68) 目标 dev。构建输入以该实现提交为基准；后续记录提交仅更新此文档。合并提交、实际本地运行批次、回滚基线以DP部署记录为准。未部署远端dev、main或生产。回退本批可恢复上一个dev基线 `9bc4aa369e585749800690b2115e605bf0d31b6a` 并构建启动本地3001。
