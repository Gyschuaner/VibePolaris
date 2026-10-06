# VBP-095 下一批十条词条机制差异表

本批从 `origin/main` 的 `465ebd1d` 开始。十条词条逐条重做，每条先完成资料研究、正文段落来源映射和独立演示，再由唯一 reviewer 逐条审读；十条完成后统一合入 `dev`、`main` 并发布。演示围绕词条自身的因果关系设计，不复用流程图模板。

| slug | 读者遇到的任务 | 首图的独立机制 | 改变条件 | 可见证据 | 边界/失败 |
| --- | --- | --- | --- | --- | --- |
| sitemap | 判断页面为什么在导航和搜索里都找得到，孤立页又会在哪里断掉 | 页面节点从站点地图分组到导航树，再切换到 XML 抓取视图；同一页面的“可导航”和“可发现”两条路径分开显影 | 父子层级、孤立页、导航入口、XML URL 集合 | 节点是否有父级入口、是否进入 sitemap、搜索抓取状态分别变化 | sitemap 是给爬虫的 URL 清单，不是导航菜单，也不证明页面内容质量 |
| design-token | 改一组颜色或间距时，怎样让组件和主题一起跟着变 | 一个语义 token 连接亮色/暗色主题和按钮、卡片两个消费端；修改原始值后沿引用链扩散 | primitive、semantic、component 引用与主题切换 | 同一 token 的引用路径、两个主题的最终值和未接入组件保持可见 | token 统一的是命名和关系，不自动解决组件状态、内容层级或视觉判断 |
| visual-hierarchy | 信息很多时，读者先看到什么、按什么顺序读 | 同一张设置卡只改变标题、对比、留白和顺序，注意力轨迹从标题落到关键操作；窄屏时层级重新折叠 | 类型尺度、对比、位置、留白、视口宽度 | 注视标记、标题与操作的顺序、窄屏后的单列结构 | 视觉层级引导注意力，不等于把所有重要性压成字号或颜色 |
| feedback | 点击保存后，怎样知道正在做什么、已完成还是失败 | 保存动作由空白态→进行中→成功/失败的状态与局部提示驱动；状态消息可读但不把装饰当作按钮 | 网络延迟、服务端结果、错误原因、再次尝试 | 按钮禁用、状态消息、失败恢复入口和成功数据变化 | toast 不能替代关键错误说明；状态消息与可操作控件是不同角色 |
| loading-state | 等待数据时，怎样知道页面正在加载、加载了多少、是否卡住 | 列表骨架、进度脉冲和错误重试是三条不同状态轨道；数据回来时只替换对应占位 | 初始加载、增量加载、慢响应、失败 | 占位形状、已完成项目数、重试入口和内容替换位置 | 加载状态不是单一 spinner；不能用动画掩盖未知耗时或失败 |
| microinteraction | 一个小动作怎样让界面回应用户而不抢走主任务 | 收藏图标按下后只改变局部形状和计数，悬停、按下、成功、撤销各有短促反馈；连续点击保持可逆 | 指针/键盘触发、成功确认、撤销窗口、重复操作 | 局部形变、计数增减、焦点保留和撤销结果 | 微交互服务于动作反馈，不应变成装饰动画或阻断主要路径 |
| reduced-motion | 用户选择减少动态效果时，怎样保留变化含义 | 同一状态切换在完整动效与 reduced-motion 下分别呈现：移动被替换成淡入和即时位置，结构信息不消失 | 媒体查询、用户偏好、状态变化 | 动画时长、位移是否关闭、文字与状态是否仍可辨 | 减少动态不是删掉反馈；必须保留状态、顺序和可操作性 |
| relational-database | 为什么把客户和订单拆成两张表后还能找回同一个人的订单 | 客户表的 `id` 与订单表的 `customer_id` 通过连接匹配，再过滤出目标客户；不把关联关系画成一条泛化箭头 | 保留列、连接条件、筛选条件、无匹配情况 | 3 个客户、5 条订单、最终 3 条匹配记录和未匹配记录 | 关系型数据库的关键是表结构与约束；连接结果取决于条件，不是“自动相关” |
| nosql | 数据结构变化很快时，为什么文档可以先长出不同字段 | 两份订单文档先以不同形状写入，再用按字段存在性的查询取出结果；另一个查询因缺少字段返回空集 | 文档字段、索引键、查询条件、缺字段记录 | 原始文档、命中/未命中计数和字段差异 | NoSQL 不是没有结构，也不等于一定比关系型数据库更快 |
| row | 同一行在并发编辑时，两个读者为什么可能看到不同版本 | 同一条订单经历未提交、B 读旧快照、A 提交、C 读新快照四帧；版本号和金额同时变 | 提交边界、快照版本、并发读时机 | `v1`/`v2`、旧金额/新金额和读者看到的快照 | 行是表中一条记录；快照隔离与提交时机决定可见版本，不是行自己“会更新” |

## 资料核对

每条正文的关键段落均绑定到代码中的来源台账，并在研究底稿中保留论断、边界和演示签名。资料覆盖以下一手或维护方文档：

- sitemap：W3C WAI Page Structure、W3C 站点层级模式、GOV.UK 内容规划、Google Search Central Sitemaps。
- design-token：Design Tokens Community Group Technical Reports、Material 3、Lightning Design System。
- visual-hierarchy：Nielsen Norman Group、W3C WCAG headings and labels、W3C Page Structure、Material 3。
- feedback：Nielsen Norman Group Visibility of System Status、W3C Status Messages、WAI-ARIA Alert Pattern、GOV.UK Error messages。
- loading-state：W3C WCAG、GOV.UK 服务设计、Material 3、Web.dev loading guidance。
- microinteraction：Material Design motion、Nielsen Norman Group microinteractions、WAI-ARIA button guidance、GOV.UK components。
- reduced-motion：W3C WCAG 2.3.3、MDN prefers-reduced-motion、web.dev、Material motion guidance。
- relational-database：PostgreSQL tutorial、SQLite foreign keys、SQL:1999 关系模型资料、Microsoft relational database guidance。
- nosql：MongoDB data modelling、AWS DynamoDB concepts、Cassandra data modelling、Azure Cosmos DB partitioning guidance。
- row：PostgreSQL MVCC、MySQL InnoDB consistent reads、SQLite isolation、Microsoft transaction isolation guidance。

## 发布记录

- 实现分支：`feat/VBP-095-next-concepts`，从 `origin/main` `cebf2acc` 创建；十条逐条完成后形成 `2e081146`，按 reviewer 反馈修正为 `f543e397`。
- review：唯一 reviewer `/root/ai_stack_review` 最终结论为 `PASS`；修正项覆盖关系型连接证据、row 四帧提交边界、feedback 真实控件角色、visual-hierarchy 窄屏状态和 reduced-motion 样式范围。
- 集成：PR #411 合入 `dev`，merge `c83f477720b07ed1c32a850dce433959a1eb793b`；PR #412 合入 `main`，merge `465ebd1df35831946dd54ad9225d2ea680b5131d`。
- 验证：`npm run typecheck`、`npm run audit:terms`（322 条体验、322 条来源覆盖、重复场景 0）、`npm run build`（1064 页）、`git diff --check`；真实浏览器覆盖桌面与 390px，十条页面无横向溢出，控制台无错误。
- 生产：amd64 镜像 `vibepolaris:465ebd1df35831946dd54ad9225d2ea680b5131d`，本地/服务器镜像 ID `sha256:4c496da3a84c9d4b5d2b2a326b5508ed5ea4bd57b656492a4794d681fd7b4a6f`，发布目录 `/opt/vibepolaris/releases/20261006T231925Z-465ebd1d`；容器健康，内部十条路由和公网冒烟均返回 200。上一版目录与镜像保留在 `/opt/vibepolaris/backups/20261006T231925Z-from-44169351bb0a91a39c02df8438d7f036e13ee12e`。
- 限制：DP CLI 当前仍因 TLS EOF 无法查询或写入，本批不伪造 DP 状态；Obsidian 路径 `D:/Obsidian/gysnote` 在当前 macOS 环境不存在。
