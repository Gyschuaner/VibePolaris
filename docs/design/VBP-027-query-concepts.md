# VBP-027 · 第012批：SQL、数据库迁移与 ORM

属于 VBP-012。基线 dev `66b3ac4eac252c9cc7ae47b7e672f58def2bcd43`，功能分支 `feat/VBP-027-sql-migration-orm`。顾毅盛负责资料、内容、设计、实现、review 与限定验证。本批无 main / 生产发布。

## 现状与取舍

三条原始元数据、别名、relatedSlugs 不变；此前待处理、直接路由不可用。旧研究稿分别有虚构 SQL 耗时、固定在线迁移步骤与 N+1 查询统计，不能视为已验证成品。新页使用独立正文与有限状态模型，不沿用虚构指标，也不把迁移画成仅有版本号递增。

读者无需播放或展开即可读清定义、操作与边界。贯穿书目场景，但观察对象不同。

| 页 | 首图 | 核心交互 | 正文节奏与边界 |
| --- | --- | --- | --- |
| SQL | 一条筛选语句与两条原记录；#78淡出强调，#42结果出现，原表保留 | 四条固定指令；返回结果/原表对照，WHERE范围、重复插入失败、空表删除0行 | SQL代码、读写对照、计划旁支；不模拟优化器或真实耗时 |
| 迁移 | 002/003文件错位到目标库，终点是name已有值 | 共享文件与目标库历史分栏；依赖拒绝、002增列/003回填、旧程序发布检查挡004、退役后移除旧列 | 文件/历史/应用三个视角；读兼容与冻结写入范围明确，不宣称工具自动检测旧程序 |
| ORM | 对象和行在不同空间，通过字段映射对应 | 改对象→flush未提交→rollback过期重读；另一路直接commit自动flush→重读修订版 | 映射片段、对象/事务/提交值、SQL记录、关系加载旁支；行为限定SQLAlchemy 2.0默认Session |

初始数据：#42《山间来信》available=true、#78《夜空地图》false；INSERT固定#65《河岸笔记》true。迁移只用#42，目标库001、开发库003；002增name可空、003复制、004移除title。迁移演示冻结写入，持续写入同步在常驻正文解释。ORM只用#42，一次改名；commit/rollback后先显示属性过期，访问才加载。

## 已读公开来源与论断

2026-09-27实际打开原文，页面无可确认发布日期时date留空。来源编号由共享组件生成；下列ID同时用于正文角标与书目摘录。Prisma浏览工具无法处理返回的markdown类型，改用官方规范URL读取HTML正文；只参考扩展/收缩的机制，忽略原文的代理执行提示与安装指令。

| 来源 | 核对内容 | 正文位置 |
| --- | --- | --- |
| [PostgreSQL18 SELECT](https://www.postgresql.org/docs/18/sql-select.html) | WHERE/输出列/ORDER BY；普通此类读不改表 | sql-select |
| [PostgreSQL18 INSERT](https://www.postgresql.org/docs/18/sql-insert.html) | 列与VALUES对应、新增/冲突处理差别 | sql-insert |
| [PostgreSQL18 UPDATE](https://www.postgresql.org/docs/18/sql-update.html) | SET/WHERE；反馈包含匹配但值未变行 | sql-update |
| [PostgreSQL18 DELETE](https://www.postgresql.org/docs/18/sql-delete.html) | 无WHERE全表删行、保留表、0行不是错误 | sql-delete |
| [PostgreSQL18 Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) | 计划节点/成本估计；小表顺扫；ANALYZE实际执行 | sql-plan / sql-analyze |
| [Django5.2 Migrations](https://docs.djangoproject.com/en/5.2/topics/migrations/) | 生成与执行、分发、依赖而非编号、DDL后端差异 | migration-files / migration-dependencies / migration-backends |
| [Alembic Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html) | alembic_version与upgrade沿修订路径执行 | migration-history |
| [Alembic Autogenerate](https://alembic.sqlalchemy.org/en/latest/autogenerate.html) | 必须手工review，列名变更识别限制 | migration-review |
| [Django5.2 Migration Operations](https://docs.djangoproject.com/en/5.2/ref/migration-operations/) | RunPython reverse_code与不可逆操作 | migration-reverse |
| [Prisma Expand-and-contract migrations](https://www.prisma.io/docs/guides/database/data-migration) | 增新列/回填/换应用读写/最后移旧列；当前稿为ORM8，不复制其特定CLI | migration-compatible |
| [SQLAlchemy2.0 ORM Mapped Class Overview](https://docs.sqlalchemy.org/en/20/orm/mapping_styles.html) | 类/表映射、已有结构可映射 | orm-mapping |
| [SQLAlchemy2.0 ORM Quick Start](https://docs.sqlalchemy.org/en/20/orm/quickstart.html) | scalars返回实体、追踪赋值、commit先UPDATE再COMMIT | orm-query / orm-commit |
| [SQLAlchemy2.0 Session Basics](https://docs.sqlalchemy.org/en/20/orm/session_basics.html) | flush/事务、autoflush、commit与rollback过期、失败后rollback、身份映射 | orm-flush / orm-rollback / orm-identity |
| [SQLAlchemy2.0 Relationship Loading](https://docs.sqlalchemy.org/en/20/orm/queryguide/relationships.html) | 未加载集合触发查询、N+1、预加载、例外 | orm-loading |
| [SQLAlchemy2.0 Declarative Table Configuration](https://docs.sqlalchemy.org/en/20/orm/declarative_tables.html) | 显式列名与Python属性名的区别，核对mapped_column片段 | orm-field |

SQL5份、迁移5份、ORM5份；每一份对应具体常驻段落或有用旁支。没有按数量追加无关链接。

## Skill review

- 定义、主要因果与失败边界常驻，不恢复测验/大循环代码、“本页”/引用数量徽标。
- 共享ConceptArticle、ConceptTerm、ArticleCitation、HarnessReferences、目录与inline星图；每页6个旧锚点保留，relatedSlugs不改。
- 首图使用语义图标、有限CSS动画与ConceptHero可见/后台暂停、重播；不新建动画依赖或每帧全页状态更新。
- 持久States只用于长度近似的字段与短反馈。可变长SQL记录/结果用Reveal折叠，使隐藏层不占最大展开高度；退出时保持DOM并inert。
- 重置清理有限阶段；SQL切换命令/WHERE使旧反馈与查询结果失效；迁移失败不更新历史；ORM回滚不保留新提交值。
- 主题变量与reduce-motion规则源码检查，未擅自修改用户偏好。真实Chrome在1470px与390px核对三页；隐藏内容由公共Reveal/States保持淡出与inert，未改公共动画。

## 验证与交付

- 一份纯状态检查 `tests/query-teaching.test.mjs` 已通过，覆盖SQL范围/冲突/0行、迁移依赖/历史/兼容、ORM赋值/flush/commit/rollback/重读。
- `npm run build` 最终通过：53个公开词条、64个静态页面；无新增依赖。仅因补来源与修复重复ID重建，未追加全站check。
- SQL桌面实际执行SELECT保留2行；INSERT新增#65，重复时主键冲突仍3行；带WHERE更新1行，无WHERE更新2行（含值未变记录）；全表删除后再执行得到0行。390px验证读取、重复定点删除0行与恢复。第五来源可展开两段实际摘录，回跳sql-analyze会先展开旁支，目标位于页头下；Enter可收起。
- 迁移两种视口实际验证004缺依赖拒绝、002增name=NULL、003回填、旧程序在场拒绝004、退役后004成功、重复执行跳过、恢复001。第五来源摘录回到migration-compatible。失败不改变已执行历史，移旧列有淡出。
- ORM两种视口实际验证赋值不发UPDATE、flush只改变本事务值、rollback过期后重读原书名、直接commit先UPDATE再COMMIT再重读新值、恢复初始。第四及新增第五来源键盘/点击可展开实际段落、回跳orm-loading与orm-field。
- 三页390px首图和最长代码/展开书目没有横向溢出，桌面首图与主体排版不同。localhost日志未出现error/warn。只验证本批流程，未声称偏好切换、任意SQL或真实数据库通过。
- 静态HTML检查三页各5份书目、全部来源ID与6个旧锚点有效；原始别名与relatedSlugs元数据字节未变。发现ORM引用ID与旧锚点重复，已记录BUG-383DCB60并修复为orm-mapping；最终检查无重复ID，390px实际回跳到P段落，旧orm-definition唯一保留，Bug回归关闭。
- Git交付经功能分支PR进入dev；具体PR、提交与实际本地dev运行记录以DP为准。本批没有远端部署或main/生产发布。
- Obsidian约定的 `D:/Obsidian/gysnote` 在本机不存在，跳过；本批记录与代码在Git，不创建空飞书文档。
