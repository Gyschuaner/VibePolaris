# VBP-030 · 第015批：批处理、流处理与事件驱动架构

父需求 VBP-012；dev 基线 `3f4e326d9991f7f410f7904e9d150504a9f085a2`，功能分支 `feat/VBP-030-batch-stream-events`。顾毅盛负责研究、内容、实现、review与限定验收；仅dev与本地集成，不包含main、远端或生产。三页此前未公开，保留原元数据、relatedSlugs与6旧锚点。

## 机制差异与场景契约

| 页 | 首图 | 主体 | 正文编排与边界 |
| --- | --- | --- | --- |
| 批处理 | 收拢有限记录，生成两本书的计数柱 | 选择4/6条借阅记录、固定输入、分块执行、一次失败与重试，全部成功才发布 | 有限范围、分块工作台、声明计算与实际执行、调度/结果验证。无真实集群/速度，失败重试不能重复计贡献 |
| 流处理 | t2、t12、t4按到达次序进入事件时间位置 | 手动投递三事件、两个10格窗口、单调水位、关闭后迟到进入旁路 | 持续输入、时间区别、窗口实验、晚到与状态。固定两窗口/3事件，零迟到容忍，无真实时钟/数据源 |
| 事件驱动架构 | 同事件分送两个独立目标，两个结果保留 | 先记录借阅再发布事实；书架/统计各自交付；统计拒绝后单独重试，同事件重复不重复计数 | 解耦、独立交付、事件契约JSON、失败/双写与观察。固定一事件/内存去重，不冒充事务或生产保证 |

对象分别为有限分块、事件时间点、独立订阅交付。批输出在全部块完成之前不是已发布结果；流窗口由事件时间归属而非到达序号，水位越过窗口后按本站零容忍旁路策略处理；事件已经记录与全部消费者完成不同，一目标失败不撤销另一目标结果。

## 2026-09-27 实际阅读的12份原始资料

未知发布日期留空；当前文档页面分别显示Spark4.2.0、Hadoop3.5.0、Flink2.3/Kafka4.2，正文只用已核对机制，不猜测其他版本或宣传默认性能。网页安装/登录/AI提示不当作授权，不运行资料内程序。

| 公开原文 | 已核对事实与限制 | 正文ID |
| --- | --- | --- |
| [Apache Beam Basics](https://beam.apache.org/documentation/basics/) | bounded固定输入与unbounded增长数据、变换与聚合 | batch-bounded |
| [Spark RDD Programming Guide](https://spark.apache.org/docs/latest/rdd-programming-guide.html) | 分区集合、惰性transform、action触发与reduceByKey | batch-execute |
| [Hadoop MapReduce Tutorial](https://hadoop.apache.org/docs/current/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html) | 独立输入块、map/reduce、失败重执行、OutputCommitter丢弃失败任务输出 | batch-retry |
| [AWS What is Batch Processing](https://aws.amazon.com/what-is/batch-processing/) | 批作业/调度/依赖、成功失败告警/历史日志；夜间只是例子 | batch-schedule |
| [Kafka Streams Core Concepts](https://kafka.apache.org/42/streams/core-concepts/) | 持续不可变输入、处理拓扑、状态存储，恢复与范围内保证 | stream-flow / stream-state |
| [Flink Timely Stream Processing](https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/) | 事件时间与处理时间、水位声明与可能迟到、多输入最小水位 | stream-time / stream-watermark |
| [Beam Programming Guide · Watermarks](https://beam.apache.org/documentation/programming-guide/#watermarks-and-late-data) | 窗口按时间戳归属、水位估计、触发决定输出、迟到配置 | stream-window |
| [Flink Windows](https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/operators/windows/) | allowed lateness默认0，保留期限、late firing、显式side output | stream-late |
| [AWS Event-Driven Architecture](https://aws.amazon.com/event-driven-architecture/) | 事件状态变化、生产/路由/消费、独立运行与fanout | eda-fact / eda-independent |
| [RabbitMQ Publish/Subscribe JS](https://www.rabbitmq.com/tutorials/tutorial-three-javascript) | fanout复制到绑定队列；共享一队列不同；无绑定不保留、教程临时队列不代表持久保障 | eda-fanout |
| [CloudEvents1.0.2规范](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md) | 必填id/source/specversion/type、source+id事件唯一性和重发重复、specversion值1.0 | eda-envelope / eda-duplicate |
| [EventBridge retry policy](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html) | 对目标可重试投递错误按策略重试、耗尽丢弃，DLQ需配置 | eda-retry |

每篇4份来源都有实际正文映射，完整机构/网址与点击摘录回跳复用公共书目。搜索摘要仅用于定位；不为数量添加不支持正文的链接。

## review与验收范围

正文常驻解释定义、输入、结果及主要边界，不依赖动画或展开才能理解。三套首图/交互/阅读节奏按机制区分，语义图标取代角色星星；复用公共阅读、术语卡、引用、局部图、Reveal/States与有限ConceptHero。颜色用主题变量、减少动态直接显示可读终态，不新增依赖、永久循环、全局光标实现。结果条件变化失效，退出DOM保留并inert，过渡文字使用稳定内容。

本批范围：build、一份纯状态检查、真实Chrome桌面/390正常与失败/晚到/重投、键盘/重置/第四来源回跳与过渡，静态ID/6锚点核对；不扩大成全站check。结果与Git/dev实际阶段完成后记录。约定的D:/Obsidian/gysnote本机不存在，跳过；不新建空飞书文档。

## 实际验证与 Skill review

- npm run build 通过，62个公开词条、73个静态页面；一份 tests/processing-teaching.test.mjs 检查通过，覆盖失败块贡献不重复、未完成不发布、4/6条输入汇总、关闭窗口晚到与水位单调、独立目标失败/重复交付及重置。没有扩大为全站 check。
- Chrome 1470×956：批处理 Enter 固定4条，先成功块1，再失败块2，中间仍2/0且发布不可用；重试发布3/1。改成6条旧进度清空，再完成三个块发布3/3。390×844完成4条发布3/1，Enter重置。
- 流处理390px Enter收e1 t2，再收e2 t12，水位10后收e3 t4；旧窗口1次，晚到旁路保留e3，新窗口仍未输出。水位20后新窗口1次。重置后先收齐三条，再水位20，旧/新窗口2/1且无晚到。桌面窗口终态、晚到正文及手机逐窗排布核对。
- 事件桌面Enter记录，发布loan-001，书架先处理成功，统计拒绝后书架仍已借出而统计0；重试统计变1，再次交付保持1并显示跳过重复。390px重复交付书架仍已借出，重置两个目标等待、借阅与事件清空。
- 三页第四资料用Enter展开当前正文摘录、摘录回跳；流页面桌面实际落点约130px，事件手机约262px，均在页头下方。长网址换行、演示终态与收起没有横向溢出，主题偏好未修改。
- 构建HTML三页各4份书目、六旧锚点唯一，无重复ID；术语元数据/aliases/relatedSlugs未改。待处理项仍由公开清单隔离。
- 常驻正文独立解释定义、原因与主要边界；首图为记录与计数柱/乱序窗口/分发副本，主体为分块提交/水位与旁路/独立订阅，正文含不同的代码/时间对照/事件封装。未复用三图标曲线、测验或本页标题。
- 动效复用有限ConceptHero、可见性与后台暂停、重播及减少动态终态；交互无计时器，Reveal退出保留DOM并inert，States用固定阶段文案。代码层核对主题与reduced-motion，无新增依赖。

PR #73 已合入 dev（1bb3f0e3ec490af7b1288b962a9abcaa6baa3857）。本地dev重启和三页核心集成完成，DP VBP-030 为 ready_for_release，任务done、计划completed，3/3实际执行通过；部署记录 local-dev-20260927-vbp030-1bb3f0e。未修改main或部署生产。
