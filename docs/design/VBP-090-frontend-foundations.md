# VBP-090 前端基础词条：逐条写作与特色演示

父需求 VBP-012。分支 `feat/VBP-090-frontend-foundations`，从 2026-10-07 的 `origin/main`（`1e83615c`）开始；远端目前没有 `dev`，集成阶段据实记录，不把本地预览说成 dev 部署。

用户要求继续升级已有词条，逐条修改、逐条审核，十条完成后统一发布。旧页不能普遍使用流程图；只在顺序交接本身就是教学对象时保留。首图紧邻大标题，保持轻量；详细操作与解释放入正文。

## 本批机制差异

| 顺序 | 词条 | 读者任务 | 首图 | 正文交互 | 可见证据与边界 |
| --- | --- | --- | --- | --- | --- |
| 1 | responsive | 三栏活动页进窄屏以后仍能读和操作 | 可伸缩画框里的卡片重新排布 | 直接缩窄真实容器，对照固定三列与自动换列 | 同一内容保留、字体不缩小；二维表格有回流例外 |
| 2 | css | 看懂一条规则为何改变外观 | 同一张海报换视觉规则 | 点选海报元素、改属性，显示对应命中 | HTML 内容相同，CSS 只改变呈现 |
| 3 | form | 修正错误且不丢已有输入 | 一张报名卡字段就地反馈 | 填真实输入、提交、保留字段、修正拒绝 | 客户端提示与模拟服务端业务判断分开 |
| 4 | html | 区分内容用途与外观 | 页面轮廓贴上语义标签 | 切换原生元素并用键盘操作 | 看起来相似的元素仍有不同语义与默认行为 |
| 5 | javascript | 明白点击如何改变数据与页面 | 计数器把脚本值与屏幕读数拆开 | 计数器的内部值和屏幕值可独立观察 | 状态变化不自动等于 DOM 更新；刷新后示例复位 |
| 6 | dom | 定位脚本到底改了什么 | 文档剖面里的一片叶子改字 | 点树节点、改当前文本、对照原始 HTML | 当前节点改变，源文件不变；没匹配到元素时停止 |
| 7 | framework | 判断框架替你安排哪些事情 | 带槽位的应用骨架 | 填路由文件槽，看对应页面出现；破坏约定 | 框架的入口约定与库的主动调用区别 |
| 8 | ssg-ssr | 为公开内容和个人内容选生成时机 | 两个时间面板，一个预印一个现做 | 改内容版本、切换访客、比较快照 | 缓存边界、更新时机与水合分别判断 |
| 9 | library | 为日期需求选择已有能力 | 工具抽屉按用途取出一件工具 | 原生日期格式与扩展需求的功能覆盖对照 | 不编造包体积、性能或维护评分 |
| 10 | runtime | 判断接口是否存在于目标环境 | 两种宿主的能力插槽 | 把表达式放进浏览器/Node 插槽 | 语言内置与宿主 API 区分；结果是固定教学模拟 |

本批预期 0/10 使用流程箭头。`sceneKind` 或全库流程占比只能检查台账，不能证明实际画面合格；审核以组件与真实截图为准。帧数按概念决定，操作可直接改变对象，不强制播放若干步骤。全站台账目前 342 条，真正使用 `pipeline/route/loop` 的 50 条，占 14.6%；其余按对照、树、矩阵、状态或概念专属空间呈现。

## 逐条证据

仅当文章、来源、演示、审读、浏览器和构建完成，才写入下列记录；每条独立提交。十条实现、唯一 reviewer 复核和本地验收已完成，进入统一合并与生产发布。

| 词条 | 已读来源与论断映射 | 审读 | 浏览器 | build/typecheck | 提交 |
| --- | --- | --- | --- | --- | --- |
| responsive | MDN RWD→`responsive-definition`/`responsive-rules`；web.dev→`responsive-breakpoint`/`responsive-content`；MDN Container Queries→`responsive-container`；W3C Reflow→`responsive-reflow`/`responsive-exception` | reviewer PASS | 本地 3410：桌面、缩窄 45%、固定三列失败态；390px 无溢出；共享首图暂停/推进/重播 | `tsc`、build 1081/1081 | 44f9c271 + 90e4f069 |
| css | MDN CSS basics→`css-definition`/`css-responsibility`；MDN Cascade + W3C CSS Cascade→`css-cascade`/`css-specificity`/`css-computed`；MDN Grid→`css-layout`；MDN Box→`css-box`；边界补充→`css-boundary` | reviewer PASS | 本地 3410：海报首图、容器布局/间距、标题换色；390px 无溢出 | `tsc`、build 1081/1081 | a7c969db + 90e4f069 |
| form | MDN client validation/constraint→`form-definition`/`form-client`；W3C labels/errors→`form-label`/`form-error`；OWASP→`form-server`/`form-boundary` | reviewer PASS | 本地 3410：不完整邮箱保留姓名、已注册服务端分支、成功分支；焦点回邮箱 | `tsc`、build 1081/1081 | ac4be00d + cacda0b7 |
| html | WHATWG HTML→`html-definition`/`html-structure`；MDN structuring→`html-structure`/`html-semantics`；MDN elements→`html-elements`/`html-native`；W3C relationships→`html-semantics`/`html-boundary` | reviewer PASS | 本地 3410：语义开关、原生 button 与 div 对照、鼠标/键盘激活；390px 无溢出 | `tsc`、build 1081/1081 | 28cd0a21 + cacda0b7 |
| javascript | MDN language overview→`javascript-definition`/`javascript-state`；MDN events→`javascript-events`；MDN client-side APIs→`javascript-dom`/`javascript-host`；TC39→`javascript-definition`/`javascript-boundary` | reviewer PASS | 本地 3410：状态/DOM 读数分离、浏览器/Node 宿主切换；390/1450px 首图无重叠，暂停/推进/重播通过 | `tsc`、build 1081/1081 | 28c39858 + f9279df9 + d044aa7f |
| dom | WHATWG DOM→`dom-definition`/`dom-tree`；MDN DOM scripting→`dom-tree`/`dom-current`；MDN querySelector→`dom-query`；MDN textContent→`dom-text`/`dom-boundary` | reviewer PASS | 本地 3410：节点树选择、当前文本写入、源 HTML 不变；390px 无溢出 | `tsc`、build 1081/1081 | 53e44986 + 897b6f4 |
| framework | Next.js project structure→`framework-definition`/`framework-convention`；React describing UI→`framework-definition`/`framework-library`；Angular overview→`framework-convention`/`framework-library`；Next server/client→`framework-runtime`/`framework-boundary` | reviewer PASS | 本地 3410：框架模式切路径自动换页；库模式切路径后需主动 `render()`；390px 无溢出 | `tsc`、build 1081/1081 | 36733cc0 + 897b6f4 |
| ssg-ssr | Next.js SSG→`ssg-ssr-definition`/`ssg-ssr-static`；Next.js SSR→`ssg-ssr-definition`/`ssg-ssr-request`；Next.js ISR→`ssg-ssr-update`/`ssg-ssr-failure`；React hydrateRoot→`ssg-ssr-hydration`；MDN HTTP caching→`ssg-ssr-cache`/`ssg-ssr-choice` | reviewer PASS | 本地 3410：改票价后 SSG 复用旧票据、SSR 读取新票价；关闭→恢复数据源后旧失败文案清除；390px 无重叠 | `tsc`、build 1081/1081 | 28dc858c + 21a4cda3 |
| runtime | MDN execution model→`runtime-definition`/`runtime-language`；ECMAScript→`runtime-language`/`runtime-version`；Node globals→`runtime-host`/`runtime-version`；Node fs→`runtime-node`；MDN Document→`runtime-browser`/`runtime-boundary` | reviewer PASS | 本地 3410：浏览器/Node 宿主切换、表达式能力矩阵、缺失接口错误；390px 无溢出 | `tsc`、build 1081/1081 | 7e823966 + d044aa7 |
| library | MDN Intl→`library-definition`/`library-native`；React describing UI→`library-definition`/`library-interface`；npm dependencies→`library-dependency`/`library-boundary`；npm audit→`library-security`/`library-boundary` | reviewer PASS | 本地 3410：勾选日期运算后原生方案显出缺口；选择候选库后矩阵恢复覆盖；390px 无溢出 | `tsc`、build 1081/1081 | aba0be22 + d044aa7f |

## 现状证据

2026-10-07 发布前实际打开线上 `responsive`：主体仍是视口/容器/卡片/操作五张通用卡，详细讲解只有定义与边界；本批本地页已改成可观察的容器回流、规则命中、字段反馈、语义树、状态/DOM、槽位骨架、时间面板、工具抽屉和宿主能力等专属机制。`demoSteps` 与 CSS 专用 foundation schema 的 `steps`、`chain` 都是可变长度（1–7），不存在用户规定的固定三步要求；旧台账已补齐 css、html、javascript 三条记录。本批专属页不把流程当作默认画法。

Obsidian 配置指向的 `D:/Obsidian/gysnote` 在本机不存在，跳过；本文件保留代码相关记录，DP 保留实际研发状态。

## 生产发布记录

2026-10-07，本批通过 PR #443 合并到 `main`，合并提交为 `db5f7ff15a7a0cb935b1ac22d10c0c8e200d9d42`。按该提交构建的镜像 `vibepolaris:db5f7ff15a7a0cb935b1ac22d10c0c8e200d9d42` 已发布到 `https://vibe.chuansgu.top`；本地与服务器传输包 SHA-256 均为 `b19109da844312aca4ed8391fc1c5dc6d8f8fa964c05bdd70187d8b09f527a58`。

- 当前发布目录：`/opt/vibepolaris/releases/20261007T144721Z-db5f7ff1`
- 当前运行镜像：`vibepolaris:db5f7ff15a7a0cb935b1ac22d10c0c8e200d9d42`
- 容器状态：`vibepolaris-web-1` healthy，`errors_5m=0`
- 发布前备份：`/opt/vibepolaris/backups/20261007T144721Z-from-0f80bb6f22ec7d74d4e1162211da07d90c6a422b`
- SQLite 在线备份：`xiaobei.sqlite`，`561152` bytes，数据卷未替换
- 回滚脚本：`/opt/vibepolaris/releases/20261007T144721Z-db5f7ff1/rollback.sh`，恢复旧镜像 `vibepolaris:0f80bb6f22ec7d74d4e1162211da07d90c6a422b` 与旧 release

生产冒烟检查覆盖首页、新闻、关于、sitemap、十个本批词条和 `/api/xiaobei/session`，全部返回 HTTP 200；`javascript`、`ssg-ssr`、`css`、`runtime` 的关键内容标记均命中。DP deployment `deploy-vbp090-frontend-foundations-prod-20261007`（记录 ID `beb51add-d1a8-4648-a316-b21a18bff115`）状态为 `released`；`VBP-090` 已转为 `ready_for_test`，研发任务 `0ee8f8f7-8d68-49b0-a011-d964bbbf4b5d` 已完成。远端当前没有 `dev` 分支，本次不虚构 dev 部署记录。

这批仍遵循“少量流程图、其余概念专属空间演示”：全站台账 342 条中 50 条使用 `pipeline/route/loop`，比例 14.6%；本批十条为 0/10。演示帧数与 `demoSteps` 按概念自由设定，没有固定三步约束。
