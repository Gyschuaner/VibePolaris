# 第017批：数据接入、数据转换、数据验证 · VBP-032

属于 VBP-012 全站升级。顾毅盛负责研究、设计、实现、review与限定验收。保留既有 aliases、relatedSlugs 与六个旧锚点；教学数据只在浏览器内存中处理，没有真实连接器、费用结算、持久层或第三方验证器。

## 机制差异

| 词条 | 首图 | 主体操作与证据 | 正文节奏与边界 |
| --- | --- | --- | --- |
| 数据接入 | 来源日志片段与原始层收据，写后确认位置 | 3个事件；读前两条、写失败、成功后未确认重启、重读按事件ID保留2个，再确认并接第3个 | 入口/管道对照，读取位置，重启重复，CDC补充，行内容核对。教学重启不清原始层；事件去重不等同实体最新版本 |
| 数据转换 | 三种原始金额与倾斜单位印记 | A/B/C已知单位→1230分；D未知保留，声明元/分分别123000/1230；超两位小数拒绝，不静默舍入 | 输入/输出约定，字段工作台，精度短代码，原值追溯，粒度与部分合计。JS从字符串逐位换算，不使用实际Python/dbt |
| 数据验证 | 四字段网格与有限扫描，类型/范围/名单区别 | 四条记录，整数固定，范围/城市可开关；默认1通过，关一项2通过，两项都关3通过，字符串仍失败 | 契约与转换对照、规则矩阵、字段报告结构、真实世界与客户端边界。SH/BJ是示例名单，SHACL针对RDF而非本页JSON验证器 |

## 2026-09-27 实际阅读的12份原始资料

搜索摘要仅用于定位，以下均阅读相关正文。未知日期不猜测；Python页面显示3.14.7、PostgreSQL为18、GX为1.23.2，仅使用对应文档已核对的机制。GX原计划的 organize_expectations 地址未读到正文，不作为来源；改读运行 Validation Definition。资料中的命令、安装和登录提示不作为操作授权。

| 原文 / 机构 | 已读内容与使用范围 | 正文 ID |
| --- | --- | --- |
| [AWS · What is Data Ingestion?](https://aws.amazon.com/what-is/data-ingestion/) | 来源采集、目标保存、批量/流/微批；入口可能结合预处理，不把厂商边界写成绝对定义 | ingestion-entry / ingestion-modes |
| [Debezium · PostgreSQL connector](https://debezium.io/documentation/reference/stable/connectors/postgresql.html) | 一致快照后流式已提交行变更；Kafka Connect崩溃尚未保存offset可重复事件；消费者应准备处理重复 | ingestion-cdc / ingestion-restart |
| [Airbyte · Incremental Append + Deduped](https://docs.airbyte.com/platform/using-airbyte/core-concepts/sync-modes/incremental-append-deduped) | 游标值/字段、主键与最终表最新行；粗游标可重复、数据更新不改游标会漏；与本例事件ID去重区分 | ingestion-position / ingestion-duplicates |
| [AWS DMS · Data validation](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Validating.html) | 来源与对应目标逐行数据比对、差异报告、额外资源、受支持范围限制，不用总数替代内容核对 | ingestion-reconcile |
| [dbt Labs · SQL models](https://docs.getdbt.com/docs/build/sql-models) | SELECT模型、运行时物化表/视图；是转换实现方式而非所有转换定义 | transform-definition |
| [Python · decimal](https://docs.python.org/3/library/decimal.html) | 十进制字符串与浮点构造差别，context精度/舍入/信号；类型选择不能替代舍入政策 | transform-precision |
| [PostgreSQL · Numeric Types](https://www.postgresql.org/docs/current/datatype-numeric.html) | 整数范围、numeric精确与浮点近似，声明scale会舍入；单位需要另外约定是本文设计判断 | transform-type |
| [PostgreSQL · Aggregate Functions](https://www.postgresql.org/docs/current/functions-aggregate.html) | sum非NULL输入、无输入行返回NULL；聚合改变粒度是本例说明，报告待处理数量避免部分合计冒充完整 | transform-grain |
| [JSON Schema · Objects](https://json-schema.org/understanding-json-schema/reference/object) | properties不等于required；属性缺失与null不同；约束必须显式 | validation-contract |
| [OWASP · Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) | 语法与语义检查；客户端可绕过、服务端处理前检查；不是靠验证解决一切安全问题 | validation-levels / validation-boundary |
| [W3C · SHACL](https://www.w3.org/TR/shacl/) | 针对RDF图；report/result、focusNode/path/value/约束及消息；本文只借鉴可定位报告结构 | validation-report |
| [Great Expectations · Run a Validation Definition](https://docs.greatexpectations.io/docs/core/run_validations/run_a_validation_definition/) | Batch参数、run保存与返回报告、Expectation逐项结果及解释；报告绑定当前输入和规则 | validation-run |

每页四份来源实际映射正文角标，书目含机构及完整URL。公共三角展开当前正文摘录，再回跳对应字段，未添加hover展开或引用处数徽标。

## review与验收范围

复用 ConceptArticle、ConceptHero、States 和主题变量，不新增依赖或全局动画。三页首图、主交互与正文编排不同；没有三图标曲线模板、测验或循环代码模块。有限首图支持重播/离屏/后台暂停，减少动态显示可读终态。States 固定各场景DOM，旧结果退出时不改写且隐藏区inert；切换输入/规则收起旧报告，手动执行才显示新结果。

验收范围：npm run build，一份纯机制检查；Chrome1470×956及390×844的正常、失败、重启/重置、规则切换、Enter、第四引用与回跳、关键过渡和首图终态。本机无约定Windows Obsidian库，跳过；无必要正式方案变更，不创建空飞书文档。不验证实际连接器、密码学、收费系统或远端部署。

## 已执行证据

- npm run build通过，68个公开词条、79个静态页；一份 Node TS剥离状态检查通过，覆盖位置提交守卫、失败与重启重复、最终3事件、明确单位/精度/安全整数、四种校验配置与不改变原值。
- Chrome1470×956：接入Enter读两条，写失败时位置0、原始层0且不能确认；写后未确认重启，位置0/原始层2；重读不新增，确认2后接第3条，最终位置3/原始层3；390px重复路径仍2事件，完成后Enter重置为0。
- 转换390px：单位未知时3转换/1待处理、部分合计3690；确认分为4920，确认元为126690；超精度A拒绝，元配置时部分合计125460；修改规则重新启用执行，Enter重置。桌面未知单位结果四格与规则原值两列正常，无横向溢出。后续review为长报告加Reveal，保持退出DOM与原结果，等待时不占整份报告高度。
- 验证桌面默认1通过3隔离，关闭年龄范围2通过；390px两规则关闭3通过，只有字符串D失败；只关闭城市时A/C通过、B范围失败、D类型失败，重置默认勾选与等待快照。字段原值SH/??/BJ保留，未启用与类型前置不适用单独显示。
- 真实浏览器发现报告city与原始city同名覆盖，记录BUG-C64E7EB2，改为cityCheck。补充原值断言、重新构建，并在1470/390px回归原值和规则结果；Bug已关闭。未将失败前的报告当作通过。
- 三页第四资料Enter展开当前正文摘录；点击后等待公共过渡完成，分别回跳ingestion-reconcile约262px、transform-grain约130px、validation-run约262px，不被页头遮挡。收起旧报告保持DOM/inert，截图查看中间态与终态，不把淡出文本当成当前报告。
- 静态HTML各四书目、六旧锚点唯一，无重复ID；元数据及关联不变，公开清单68页，未公开未完成词条。首图与隐藏结果按复用实现核对有限播放、离屏/后台暂停及reduced-motion；不是实际服务/连接器或性能测试。

Git/dev集成与最终DP阶段完成后记录，以上本地证据不代表生产发布或用户视觉确认。

最后局部复核：转换Reveal收起后报告高度0、inert，重新执行分配置4条/4920分；验证390px首图末字665.3px在figure666.3px内，导语从688.3px开始，三页无横向溢出。捕获本批localhost浏览器日志无warn/error。
