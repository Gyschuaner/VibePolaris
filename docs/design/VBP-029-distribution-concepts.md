# VBP-029 · 第014批：备份、分片与队列

父需求 VBP-012，基线 dev `d2eab447dabfd58fb192236fd6e9e062b6b4aea9`，分支 `feat/VBP-029-backup-sharding-queue`。顾毅盛负责研究、设计、实现、review 与限定验收。范围为 dev、本地集成，不包含 main、远端或生产。三页原先未公开，原始别名、relatedSlugs 保留，6 个旧锚点保留。

## 读者目标与机制差异

| 页 | 首图 | 主体操作与证据 | 正文节奏与边界 |
| --- | --- | --- | --- |
| 备份 | 错位历史归档，修订版归档渐入，原版留下 | 保存 v0/v1/空 v2，现库改名与误删，选历史状态恢复到独立库，核对行与书名 | 常驻历史恢复、工作台、格式与三行命令、验证；PITR 旁支。恢复不改当前库，无真实文件或数据库 |
| 分片 | 键范围带，两条编号各自下落到所属片 | 定向查询/无键合并；指定迁移先复制、后改归属、再清旧副本；合并只计归属数据 | 子集与复制、查询迁移、键与热点对照、分区旁支。0–100 是教学边界，无并发协议，不冒充均衡建议 |
| 队列 | 消息移动到工作进程，处理后确认出现 | 两任务依次发布、领取、处理、ack；断开重投；已有业务缩略图由任务键保护 | 工作解耦、交付、业务防重、顺序/发布确认旁支。单槽、固定键、内存结果，非生产防重保证 |

三种生命周期分别是历史保留、范围归属、未确认交付。备份版本不随当前值变；分片持有复制数据不等于负责查询；队列工作完成不等于 ack 到达。先完成因果状态，再复用 Reveal/States 与有限 CSS 首图，不增加动画库或全局计时器。

## 实际阅读的公开原文

2026-09-27 阅读下列 12 份官方原文，各页 4 份，搜索摘要只用于定位。未知发布日期留空；网页内针对 AI 的操作提示不作为用户授权，未执行原文安装或数据库命令。

| 原文 | 已核对论断与边界 | 正文 ID |
| --- | --- | --- |
| [PostgreSQL18 SQL Dump](https://www.postgresql.org/docs/18/backup-dump.html) | 逻辑导出、开始时一致快照、读写可继续；不跟随后续改名 | backup-snapshot |
| [PostgreSQL18 pg_dump](https://www.postgresql.org/docs/18/app-pgdump.html) | 单数据库、不含全局对象；格式与恢复工具对应；不把它作为普适生产定期备份 | backup-scope |
| [PostgreSQL18 pg_restore](https://www.postgresql.org/docs/18/app-pgrestore.html) | 归档恢复、缺失数据无法恢复；默认遇错继续、single-transaction 限制 | backup-restore |
| [PostgreSQL18 Continuous Archiving/PITR](https://www.postgresql.org/docs/18/continuous-archiving.html) | 合适基础备份+持续 WAL、目标停止点；与逻辑导出区别 | backup-pitr |
| [MongoDB Sharding](https://www.mongodb.com/docs/manual/sharding/) | 多机子集、mongos/元数据、片为副本集、键定向与无键广播 | shard-distribution / shard-routing |
| [MongoDB Shard Keys](https://www.mongodb.com/docs/manual/core/sharding-shard-key/) | 单/复合索引字段、原值/哈希范围、键需同时考虑分布与查询 | shard-key |
| [MongoDB Manage Sharded Cluster Balancer](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/) | 复制时源负责、同步写入、位置元数据变更后清理、真实迁移其他条件 | shard-moving |
| [PostgreSQL18 Table Partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html) | 逻辑表/物理部分、边界路由、可有外部表，不自动构成 MongoDB 分片集群 | shard-partition |
| [RabbitMQ Work Queues JavaScript](https://www.rabbitmq.com/tutorials/tutorial-two-javascript) | 后台任务、工作共享、手动确认、断开重排、prefetch | queue-work / queue-prefetch |
| [RabbitMQ Acknowledgements and Confirms](https://www.rabbitmq.com/docs/confirms) | 消费确认与发布确认独立；协议不判断业务是否正确 | queue-ack / queue-publisher |
| [RabbitMQ Queues](https://www.rabbitmq.com/docs/queues) | FIFO 的顺序限制、并发/优先级/重投、持久元数据与消息条件 | queue-order / queue-durable |
| [RabbitMQ Reliability Guide](https://www.rabbitmq.com/docs/reliability) | 失败重复交付/幂等消费；拒绝/否定确认、配置死信 | queue-duplicate / queue-failure |

正文角标、机构、完整 URL 与当前正文摘录复用公共组件；第四份资料支持实际旁支或核心段落，不为数量堆无关链接。

## Skill review

- 无动画与不展开仍能独立读定义、过程、主要边界；重点加粗，不使用营销式问题标题，不恢复测验或“本页”。
- 首图、主体和正文节奏不同；归档/范围/任务对象变化实际影响可见结果，品牌星星不替代语义图标。
- 数据结果淡出保留旧 DOM，隐藏项 inert；静态 States 文案避免退出时由当前变量改成错误内容。无动画定时器，首图复用可见性/后台暂停与重播，减少动态效果提供可读终态。
- 复用主题变量、原生按钮/select、共同引用/目录/词语卡片/局部星图，不擅改系统或站点偏好。
- 验收限三页正常/失败/重置、1470 与 390px、相关键盘与来源回跳/退出。先 build，再一份纯状态检查与真实浏览器，不运行无关全站 check。

## 实际验证与交付

- 首次 `npm run build` 通过，59 个公开词条、70 个静态页面。
- `tests/distribution-teaching.test.mjs` 一份状态检查通过：无恢复点拒绝、旧/新/空状态恢复互不污染；迁移各阶段查询归属及无键结果无重复、不存在键0行；未处理不能 ack、处理前/后断开重投与固定键防重复、重置。
- Chrome 1470×956：无备份恢复拒绝；Enter 保存 v0，改名保存 v1，误删现库后恢复 v0 为原书名/2行，再恢复 v1 为修订版/2行，现库仍 v2/0行。390×844 保存空 v2 后恢复空库，Enter 重置回原书目/无归档/未导入。
- 分片桌面按42请求A、78请求B；复制阶段78仍请求B，无键请求A+B并返回2行。更新归属后78请求A；390px清理B后查询78仍1行，全量仍2行，99返回0行。Enter重置范围A/B、条件42、关闭旧结果。修改条件时结果淡出实测opacity约0.96、过渡0.42/0.3秒，后续隐藏项不可聚焦。
- 队列桌面Enter发布、领取后未处理ack不可用，单槽不能继续领取；处理前断开回到2条待领取。处理后断开已生成的1张图保留，再领/处理显示复用并仍1张。ack后390px领取第二条、处理、ack，2张业务结果、未确认0、两消息已确认；Enter重置全部清空。阅读与动态对象均为固定教学状态，无真实网络或图片处理。
- 三页第四份书目Enter展开当前正文摘录，备份与分区回跳自动打开旁支，390px实际落点约262px、页头下方；队列可靠性指南包含两个有效引用段落，首段回跳有效。完整URL/长标题、主体/终态、重置无水平溢出；相关本地浏览器error/warn为空。
- 静态输出核对三页各4份书目、6旧锚点唯一，全页无重复ID；原始术语数据及关系无改动。无动画通读/主题/reduced-motion检查在代码层完成，未擅改偏好。
- review将队列空区说明改成稳定文案，避免发布与重置时退出的空态文字被当前变量重写；选中备份框线改成内描边，避免Reveal裁切外描边。必要重建后只回归这两处。
- Git与本地dev集成实际记录完成后补记，不把构建、状态检查、浏览器验收当作远端或生产验证。

本机不存在约定的 `D:/Obsidian/gysnote`，跳过该知识库记录；有效研究与 review 随代码留 Git，不创建空飞书文档。
