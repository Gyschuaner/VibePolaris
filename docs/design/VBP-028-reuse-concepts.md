# VBP-028 · 第013批：缓存、连接池与复制

父需求VBP-012，基线dev `f856f8347a87c310ec571c7c1293094c49c750b2`，功能分支 `feat/VBP-028-cache-pool-replication`。顾毅盛负责研究、设计、实现、review及限定验收。范围为dev与本地集成，不包含main、远端部署或生产。

## 读者目标与机制差异

三页此前均未公开。缓存旧独立实验把副本固定为129、回源后不回填，还带虚构7/8/82ms；池/复制旧稿为通用固定流程。新页沿书目场景，分别学习数据复用、连接资源借还、提交变更传播。原始元数据与relatedSlugs不改，6个旧锚点保留。

| 页 | 首图 | 主体 | 正文编排与边界 |
| --- | --- | --- | --- |
| 缓存 | 原记录与错位副本，副本稍后出现 | 数据库/键副本并排；读回填/命中、改源旧副本、主动失效、手动到期 | 常驻因果、写入失效顺序、TTL，容量淘汰旁支；一键/逻辑时间，不虚构访问或速度 |
| 连接池 | 两条连接的A/B租用，C等待，A释放后C接手 | 三个请求对象在请求/连接/等待结束区域移动，真实持有者与有限等待 | 资源与结果区分、清理与finally代码、容量预算；只有2条已建健康连接、无临时扩容，不运行查询 |
| 复制 | 主库新值、变更纸片发送到错位副本、应用后值出现 | 提交/收到/应用三种进度；改名和删除分别传播，副本查询读取已应用值 | 观察点、物理/逻辑、同步确认、备份历史；v0/1/2不是WAL位置，无真实网络或协议 |

缓存初态源#42《山间来信》、空副本，逻辑t=0；回填期限2格，改源只生成修订版，结果在条件变化时失效。池请求A/B/C初态未借用，连接1/2空闲；等待上限仅通过按钮推进，超时者不再自动获连接。复制两库v0有原书名；固定v1改名、v2删除，收到与应用分别递增且不得超过前一进度；每次查询新快照。

## 实际阅读的公开原文

2026-09-27读以下12份官方文档，日期无法确认则留空。搜索摘要仅定位，不作证据。Psycopg在线文档页标记3.3.7.dev1，本文只用其已有连接、排队与生命周期机制，不宣传它为稳定发布版本；不执行原文安装代码。

| 原文 | 已核对论断与限制 | 段落ID |
| --- | --- | --- |
| [Microsoft Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) | 应用查/回源/回填；写源再失效；外部写与本地多副本不保证一致 | cache-mechanism / cache-invalidating / cache-consistency |
| [Redis GET](https://redis.io/docs/latest/commands/get/) | 键字符串读取，不存在nil，不查业务库 | cache-key |
| [Redis EXPIRE](https://redis.io/docs/latest/commands/expire/) | 到期删除键，不自行刷新业务内容 | cache-expiry |
| [Redis Key eviction](https://redis.io/docs/latest/develop/reference/eviction/) | maxmemory-policy、noeviction、近似LRU | cache-eviction |
| [Psycopg Connection pools](https://www.psycopg.org/psycopg3/docs/advanced/pool.html) | 已有资源借还、无可用时排队、timeout限制、生命周期 | pool-mechanism / pool-waiting |
| [SQLAlchemy2.0 Pooling](https://docs.sqlalchemy.org/en/20/core/pooling.html) | 按需建连、QueuePool参数、归还清理、pre_ping不能恢复中途断开的事务 | pool-lazy / pool-reset / pool-disconnect |
| [node-postgres Pooling](https://node-postgres.com/features/pooling) | 借用client必须归还；不归还耗尽池，finally范围 | pool-release |
| [PostgreSQL18 Connections and Authentication](https://www.postgresql.org/docs/18/runtime-config-connection.html) | max_connections限制与增大资源分配 | pool-capacity |
| [PostgreSQL18 Log-Shipping Standby](https://www.postgresql.org/docs/18/warm-standby.html) | WAL重放、默认异步延迟、remote_apply等待可见确认 | replica-stream / replica-sync |
| [PostgreSQL18 Hot Standby](https://www.postgresql.org/docs/18/hot-standby.html) | 只读、提交记录重放后新快照可见、隔离级别 | replica-visible |
| [PostgreSQL18 Logical Replication](https://www.postgresql.org/docs/18/logical-replication.html) | 数据对象/标识与物理块字节粒度区别 | replica-granularity |
| [PostgreSQL18 Continuous Archiving/PITR](https://www.postgresql.org/docs/18/continuous-archiving.html) | 合适基础备份+WAL、恢复目标点停止重放，不能把最新副本当误删恢复 | replica-recovery |

每页四份，全部对应常驻正文或有意义旁支，完整网址/机构与角标由共用组件生成；点击三角读取当前正文摘录。

## Skill review与验收范围

- 不播放与不展开仍能读定义、过程、主要边界；不恢复测验、冗长循环代码、“本页”或引用数量徽标。
- 三页共享阅读壳、图标、术语卡、引用、inline星图；核心对象与首图不同，不套三节点曲线。
- 每个主实验只有有限状态与原生按钮，无动画依赖、定时器或全页每帧更新。首图复用ConceptHero可见性/后台暂停与重播。
- 值与短状态用States，出现/消失和查询结果用Reveal，退出保留DOM并inert；数据条件变化使旧返回失效。CSS颜色用主题变量，reduce-motion直接显示可读终态，不擅自修改偏好。
- 每页6个旧锚点与原元数据保留；来源ID避开legacy-definition重复。
- 验收仅本批：build、一份状态检查、桌面及390px正常/等待失败/重置、相关键盘与引用回跳、最长数据/展开和退出过渡。不新增全站check。

## 实际验证与交付

- 一份纯状态检查 `tests/reuse-teaching.test.mjs` 通过：空缓存回填/旧副本命中/到期回源，独占连接/交接/超时，复制前置阶段/删除传播/重置。
- `npm run build` 最终通过，56个公开词条、67个静态页面。第一次构建通过后只因实际退出文案问题及删除未使用旧组件重建；不执行全站check、不增加依赖。
- Chrome桌面1470×956、手机390×844：缓存先读取未命中并回填，第二次命中；只改数据库后缓存旧书名与数据库修订版并存；失效后读到新值，到期t=2后副本消失；重置为空副本/原书名/t=0。读取Enter有效。失效中的Reveal有非零透明度与0.42/0.3秒过渡，随后关闭并inert。
- 连接池桌面A/B占两槽、C等待，归还连接1让C接手；另一分支C等待超时，归还后C仍未获连接。390px图与文本一致，归还连接2让C接手同一槽，重置三请求未借用；借用/重置Enter有效。资源对象持续移动，不造出查询成功。
- 复制两种视口：主库提交v1后副本仍v0；收到v1后查询仍原名，应用后新查询为修订版。提交v2删除后副本仍v1，发送/应用后两库与查询都是0行。无前置记录时发送/应用禁用；重置恢复两库v0并关闭旧查询。条件变化时旧查询保留淡出（实测非零opacity），不把旧查询当当前结果。
- 三页第四份书目用Enter展开当前正文摘录，点击回到cache-eviction、pool-capacity、replica-recovery；缓存旁支先打开，实际390px落点在页头下约262px。完整URL、最长书目、演示与终态无横向溢出。
- 静态HTML检查三页各4份来源、每个来源段落ID和6个旧锚点唯一；原始别名与relatedSlugs元数据未变。无动画/不展开通读可以读懂定义、过程与边界，主题变量/reduce-motion代码检查；未擅自修改系统偏好，不声称真实数据库或远端部署通过。
- 浏览器发现BUG-E2A8422B：归还时退出的active文字短暂变成“连接0”。用稳定“已借到连接”替代动态槽位文案，具体编号仍由资源图表达。修复构建后390px同路径回归全部节点无连接0，B已归还/C借到连接2，重置正确，Bug已关闭。
- 移除已脱离路由的旧CacheTermPage及旧测试中的历史缓存文案断言，缓存实际逻辑由本批状态检查覆盖；未扩展成无关旧样式清理。
- Git交付采用功能分支PR进入dev；最终PR、提交与实际本地dev集成运行记录以DP为准，没有main或生产发布。

约定的Obsidian `D:/Obsidian/gysnote` 在本机不存在，跳过；有效研究与review记录随代码留Git，本批不创建空飞书文档。
