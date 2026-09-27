# 第009批 · 数据库、索引、事务

DP：VBP-024，父需求 VBP-012。顾毅盛负责研究、设计、实现、review、验收与 dev 集成。2026-09-27 开始；基线 dev `0e5ae07`，浏览器确认 database 当前为 404。仅开放本批完成的三页，保留全量源词库、relatedSlugs、六个旧锚点及阅读笔记。

## 机制差异与场景契约

读者是正在做图书室应用的初学者。分别能判断“界面变化是否保存”“索引是否改变答案”“两次写入是否一起生效”。统一主题变量、目录、引用、星图与开合能力，不统一动画构图。

| 词条 | 首图 | 主体操作与证据 | 正文节奏 |
| --- | --- | --- | --- |
| 数据库 | 书目表保留，查询副本从表旁出现 | 修改 #42 可借状态仅改草稿；保存才改共享记录；查询复制当时符合条件的记录；重开界面清除草稿/结果，记录保留 | 连续解释 → 编辑/查询工作台 → 约束与部署形态对照 |
| 索引 | 有序编号逐段排除，目标位置浮现 | 顺序扫描与有序目录使用同一组九条数据；比较实际生成轨迹；命中目录后还要读记录；缺失目标终止；换条件清空进度 | 原理 → 横向候选带与原记录 → 成本侧栏及执行计划 |
| 事务 | 两份改动聚合为一个提交包 | 可借2/借阅0；开始、减库存、写借阅、提交；失败只能回滚未提交改动；分别提交模式第一步已生效不能假回滚 | 业务约束 → 事务内/外两层空间 → 可见性、恢复与跨系统边界 |

演示只计算浏览器内教学状态，不连接数据库、不执行 SQL、不持久写入用户数据；真实持久性不靠界面重开证明。所有动画有限播放，复用 ConceptHero 可见性暂停/重播；主交互手动推进。Reveal/States 保留退出层并 inert，不增加定时器。

## 研究与论断映射

已打开以下原文（2026-09-27），每页四份，正文角标/段落 ID 以 `lib/storage-sources.ts` 为单一映射。文档未明确给出发布日期，留空而不填阅读日期。PostgreSQL 使用固定 18 版；SQLite 官方文档按本次访问内容。

| 页 | 来源 | 支持的论断 / 限制 |
| --- | --- | --- |
| 数据库 | [PG Concepts](https://www.postgresql.org/docs/18/tutorial-concepts.html) | 关系表、行列、数据库与 DBMS；不把所有数据库说成表格 |
| 数据库 | [PG Architecture](https://www.postgresql.org/docs/18/tutorial-arch.html) | 服务端管理数据文件与多个客户端；浏览器不是直接连生产数据库的示例 |
| 数据库 | [PG Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) | 主键、CHECK、外键；错误约束不会自动懂业务 |
| 数据库 | [SQLite Uses](https://www.sqlite.org/whentouse.html) | 嵌入式本地文件，无须独立数据库服务；不作产品选型排名 |
| 索引 | [PG Index Introduction](https://www.postgresql.org/docs/18/indexes-intro.html) | 辅助查找与写入维护成本 |
| 索引 | [SQLite Query Planning](https://www.sqlite.org/queryplanner.html) | 键与记录定位、查询答案不变；演示是有序数组二分简化，非存储引擎复刻 |
| 索引 | [PG Index Types](https://www.postgresql.org/docs/18/indexes-types.html) | B-tree 等值/范围，Hash 等值；并非所有索引都二分查找 |
| 索引 | [PG Examining Index Usage](https://www.postgresql.org/docs/18/indexes-examine.html) | 真实数据、统计、EXPLAIN；示意比较次数不是性能基准 |
| 事务 | [PG Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html) | BEGIN/COMMIT/ROLLBACK、整体提交、单语句隐式事务 |
| 事务 | [PG Isolation](https://www.postgresql.org/docs/18/transaction-iso.html) | Read Committed 新查询的可见性、序列值不回滚；不泛化为所有事务即时见新数据 |
| 事务 | [PG WAL](https://www.postgresql.org/docs/18/wal-intro.html) | 日志先持久化，故障恢复重放；不是备份/配置无关的数据零丢失承诺 |
| 事务 | [SQLite Transaction](https://www.sqlite.org/lang_transaction.html) | 单写者与事务错误处理不同；应用须检查真实执行与提交结果 |

## 本批验收范围

先构建与一个纯状态检查；真实浏览器桌面/390px操作三页核心成功和失败、条件切换、重置、一个键盘披露与引用往返；观察过渡中间态及终态、无横向溢出。只检查相关能力，不进行全站回归。主题/减少动态先按变量和媒体查询审阅，未操作的偏好不宣称实测。

用户新增“每词条至少四份来源”已同步总需求；旧批次的来源数量在最终复核补足，不冒充已经满足。本批正式文档与飞书关联未创建，工作笔记与代码一同版本化。配置的 Obsidian 库 `D:/Obsidian/gysnote` 在本机不存在，跳过。

## 实际结果

- `npm run build` 两次通过；第二次由明确 UI 修复触发。55 条静态路由，包含三页新增公开入口。
- `node --experimental-strip-types --test tests/storage-teaching.test.mjs`：1 项通过，覆盖保存不篡改旧查询、两条查找路径及不存在编号、四种事务/失败组合与终止后操作。
- Chrome 桌面1470px / 手机390×844真实操作：草稿不改记录，保存后上次查询仍保留原内容，重查只返回78；全部查询四条；重开界面保留记录，重置恢复。
- 索引目录查询64：2次比较再读取；扫描：5次并直接读到同一条；65：范围耗尽且读取禁用。键盘Enter可推进，修改目标重置，记录位置未排序。
- 事务提交前新查询为2本/0条，提交后1本/1条；分组失败回滚2/0；分开提交失败1/0，回滚不可用。手机Enter提交通过。
- BUG-4717440B：索引读出后提示未更新，已改为独立完成层；查询退出行保留旧数据。回归核对当前层“目录比较2次 · 已读取#64”，隐藏退出42行仍为原“可借”，退出层inert/aria-hidden。
- 截图检查三种首图与主体终态，查看查询退出、读出展开、书本离开及引用收起过渡。手机无横向溢出（390/390），浏览器无error/warn。
- 原生summary用Enter开合；WAL角标→书目三角→当前正文摘录→transaction-recovery，等待收起结束后落点距顶130px。正文15个引用ID与每页四份来源对应，六个旧锚点齐全。
- 按Skill自review：正文无需播放即能解释概念/过程/边界；三页分别是草稿与查询工作台、候选范围筛除、事务内外提交；样例和实际实现的边界常驻正文；无测验、重复脚注或装饰分隔线；重用公共披露、引用、目录和星图；保留笔记外壳。
- 使用现场主题变量；有限首图离屏/后台暂停和减少动态效果由代码核对，未修改用户偏好，不宣称实测所有主题。临时视口已恢复；未扩大整站回归。
- 公开清单44个（35个本轮升级+9个历史基准），257个仍待处理。父需求保持研发中，整个目标未完成。

## 集成范围

实现提交 `040751844ab5baa42c2bb01ea94a9efaed8ae057`；[PR #67](https://github.com/Gyschuaner/VibePolaris/pull/67) 从 `feat/VBP-024-storage-concepts` 集成 dev。最终合并提交及部署事实以 DP 的 VBP-024 与 local-dev 部署记录为准。仅部署本机 `http://127.0.0.1:3001`，没有远端dev或生产部署。回退基线为 `0e5ae0776a1db92d9c6e6f8fa429596c141a9c41`：在该提交的独立工作区构建并替换预览进程，保留当前代码。
