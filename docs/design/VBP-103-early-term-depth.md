# VBP-103 · 早期词条深度复核

## 范围

本批复核最近一轮用户实际查看的十个词条：视觉层级、微交互、反馈、加载状态、减少动态、站点地图、设计令牌、关系型数据库、NoSQL、行。每个词条逐条研究、改写和提交；本批没有把十条压成同一套动画模板。

本批沿用“先把文章写成立，再让演示回答一个具体疑问”的设计规则。正文补齐读者需要的前提、主要例子、过程、边界和相邻概念；演示只保留能观察到机制变化的对象与结果。流程类画面不是默认形式：全库 372 个体验中，pipeline、route、loop 共 44 个，占 11.8%；本批十条没有使用这三类流程视觉。

## 机制差异表

| 词条 | 读者要学会的判断 | 演示机制 | 场景变化与可见证据 | 资料方向 |
| --- | --- | --- | --- | --- |
| visual-hierarchy | 为什么同一页面会有多个竞争焦点，以及怎样只改一个变量建立阅读顺序 | spectrum | 撤掉装饰竞争、拉开尺度与留白、把操作放回任务语境；焦点由 5 个收敛到标题→条件→提交 | Nielsen Norman Group、W3C、Material、Apple HIG、MDN |
| microinteraction | 一个小动作怎样包含触发、状态、反馈和撤销，而不是只换图标 | state-machine | 收藏从 idle 进入 pressed、pending、success/undo/failure；键盘、网络失败与撤销都可见 | Nielsen Norman Group、Material、WAI、Apple HIG |
| feedback | 状态变化与反馈消息如何对应，为什么“有 toast”不等于反馈完整 | state-machine | 保存动作区分 pending、success、failure、retry；反馈落在当前对象和可达的 live region 上 | WAI-ARIA、Material、Nielsen Norman Group、web.dev |
| loading-state | 等待期间能承诺什么，何时应显示进度、超时和重试 | timeline | 骨架、已知进度、未知进度和超时分别展示；等待预算耗尽后才出现重试，不伪造完成 | Material、WAI、web.dev、Nielsen Norman Group |
| reduced-motion | 减少动态改变的是表现方式，不是状态、焦点或结果 | compare | 正常模式的位移与缩放切换为原位淡入/颜色变化；URL、阅读顺序、焦点与成功失败信息保持一致 | W3C Media Queries、MDN、web.dev、WAI |
| sitemap | 页面归属、人的导航和 XML 清单解决的不是同一件事 | tree | 把页面挂回任务层级，标出主导航、孤立页和 XML 状态；树不是用户点击流程 | Google Search Central、W3C、Nielsen Norman Group、MDN |
| design-token | 组件使用的是语义用途，主题变化时为何不应到处改具体颜色 | network | 同一语义 token 连接亮/暗主题与多个组件；改 token 后一组组件同步变化，硬编码节点不随之更新 | W3C Design Tokens Community Group、Salesforce、Material、Style Dictionary |
| relational-database | 表、行、键、约束和连接怎样构成可查询的关系 | assembly | 客户与订单保持为两张事实表，通过主外键投影、连接和过滤形成新关系；输入表不被改写 | PostgreSQL、SQLite、IBM、Microsoft |
| nosql | 选择非关系模型时应从访问模式和一致性取舍出发 | compare | 同一购物车分别落在文档、键值和宽列模型；查询路径、局部性和跨实体更新成本随模型变化 | MongoDB、AWS、Cassandra、Google Cloud |
| row | 行是一次记录实例，位置、版本和列约束如何影响它能否被读取 | timeline | 同一订单出现旧/新版本与提交状态；排序需显式声明，非法列值在写入边界被拒 | PostgreSQL、SQLite、MySQL、Microsoft |

## 逐条实现记录

- `visual-hierarchy`：定义注意顺序的相对关系，修正“越大越重要”和“热图等于结论”的误解；5 帧 spectrum 演示只改竞争、尺度、位置和窄屏排列。
- `microinteraction`：把触发、即时反馈、异步结果和撤销拆开，补上失败与键盘触发；5 帧 state-machine 演示以收藏动作贯穿。
- `feedback`：区分系统状态、反馈载体和反馈时机；保存演示包含成功、失败和 retry，避免用一条 toast 代表所有结果。
- `loading-state`：解释已知进度、未知等待、骨架和超时的适用边界；5 帧 timeline 演示等待预算耗尽前不冒充完成。
- `reduced-motion`：把 `prefers-reduced-motion` 解释为表现预算变化，保留终点、URL、焦点和语义顺序；5 帧 compare 演示同一对象的两种表现。
- `sitemap`：分开信息架构、主导航与 XML sitemap；5 帧 tree 演示页面归属、孤立页和抓取清单的差异。
- `design-token`：用语义用途连接组件和主题，不把 token 写成某个颜色值；5 帧 network 演示单点改动如何传播以及硬编码为何脱离主题。
- `relational-database`：围绕 customers/orders 讲关系、键、投影、连接和过滤；5 帧 assembly 保留未匹配证据，说明输入表与结果关系的区别。
- `nosql`：从访问模式切入文档、键值和宽列模型，补充跨实体更新和一致性成本；5 帧 compare 不把 NoSQL 简化成“没有表”。
- `row`：用订单版本讲行实例、提交状态、排序和列约束；5 帧 timeline 展示旧值不会被无条件倒写。

## 研究与审读

每条 research card 记录机制、易混淆边界、演示签名、相邻词条和四份以上公开来源；前端七条写入 `term-research/frontend-product.json`，后端三条写入 `term-research/backend-data.json`。新增与重写中文均按 `humanizer-zh` 做了第二轮审读，保留必要的中间解释，不用统一金句或固定三步压缩正文。

本批每条体验帧数按机制设定，均为 5 帧；`demoSteps` 不存在固定三步要求，后续词条继续按理解所需的对象和状态变化决定帧数与视觉类型。

## 验收证据

- `node --experimental-strip-types --test tests/term-library.test.mjs`：8/8 通过。
- `npm run typecheck`：通过。
- `npm run build`：通过，静态页面 1111/1111；构建前新闻校验为 published 725、drafts 869、pending 144。
- `npm run audit:terms --silent`：372 个体验、372 个唯一 slug、372 条来源覆盖；流程视觉 44/372（11.8%）；重复场景、相邻同类场景和近重复对均为 0。全库保留 spectrum、compare、transform、layers、matrix、timeline、tree、network、assembly 等多种机制画面。
- 真实浏览器在本地端口 3341 打开十条新路由，均返回 200；逐页检查了标题、定义、互动控件、参考资料和主体演示，未见 404 或构建错误。
- 唯一 reviewer 子智能体独立复核 PASS：十条的数据、正文、来源、体验结构和全库比例均通过；复核指出的 `microinteraction` 页面帧数与计数漂移已修复并增量复核 PASS。其余专属页按实际机制保留比 canonical 台账更紧凑的局部阶段，不把 5 帧硬套成统一页面模板。

## 发布记录

本文件随 VBP-103 代码分支提交；待 reviewer PASS 后合入 `main` 并按 AGENTS.md 执行生产部署。生产部署完成后补充提交号、镜像、发布目录、数据库备份、回滚脚本、健康检查和 DP CLI 结果。DP CLI 若继续出现 SSL EOF，只记录实际失败，不伪造部署对象。
