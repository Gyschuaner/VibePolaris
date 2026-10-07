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
| 5 | javascript | 明白点击如何改变数据与页面 | 灯阵随开关变亮 | 计数器的内部值和屏幕值可独立观察 | 状态变化不自动等于 DOM 更新；刷新后示例复位 |
| 6 | dom | 定位脚本到底改了什么 | 文档剖面里的一片叶子改字 | 点树节点、改当前文本、对照原始 HTML | 当前节点改变，源文件不变；没匹配到元素时停止 |
| 7 | framework | 判断框架替你安排哪些事情 | 带槽位的应用骨架 | 填路由文件槽，看对应页面出现；破坏约定 | 框架的入口约定与库的主动调用区别 |
| 8 | ssg-ssr | 为公开内容和个人内容选生成时机 | 两个时间面板，一个预印一个现做 | 改内容版本、切换访客、比较快照 | 缓存边界、更新时机与水合分别判断 |
| 9 | library | 为日期需求选择已有能力 | 工具抽屉按用途取出一件工具 | 原生日期格式与扩展需求的功能覆盖对照 | 不编造包体积、性能或维护评分 |
| 10 | runtime | 判断接口是否存在于目标环境 | 两种宿主的能力插槽 | 把表达式放进浏览器/Node 插槽 | 语言内置与宿主 API 区分；结果是固定教学模拟 |

本批预期 0/10 使用流程箭头。`sceneKind` 或全库流程占比只能检查台账，不能证明实际画面合格；审核以组件与真实截图为准。帧数按概念决定，操作可直接改变对象，不强制播放若干步骤。

## 逐条证据

仅当文章、来源、演示、审读、浏览器和构建完成，才写入下列记录；每条独立提交。当前已完成前 3 条，继续处理第 4 条。

| 词条 | 已读来源与论断映射 | 审读 | 浏览器 | build/typecheck | 提交 |
| --- | --- | --- | --- | --- | --- |
| responsive | MDN RWD→`responsive-definition`/`responsive-rules`；web.dev→`responsive-breakpoint`/`responsive-content`；MDN Container Queries→`responsive-container`；W3C Reflow→`responsive-reflow`/`responsive-exception` | 待 reviewer 复核来源统一与标题修正 | 本地 3410：桌面首屏、缩窄 45%、固定三列失败态；键盘待补 | `tsc` 已过；build 待十条批量执行 | 44f9c271 + 90e4f069 |
| css | MDN CSS basics→`css-definition`/`css-responsibility`；MDN Cascade + W3C CSS Cascade→`css-cascade`/`css-specificity`/`css-computed`；MDN Grid→`css-layout`；MDN Box→`css-box`；边界补充→`css-boundary` | 待 reviewer 复核交互与来源对齐 | 本地 3410：海报首图、容器布局/间距、标题换色；键盘待补 | `tsc` 已过；build 待十条批量执行 | a7c969db + 90e4f069 |
| form | MDN client validation/constraint→`form-definition`/`form-client`；W3C labels/errors→`form-label`/`form-error`；OWASP→`form-server`/`form-boundary` | 待 reviewer | 本地 3410：不完整邮箱保留姓名、已注册服务端分支、成功分支；焦点回邮箱已验证 | `tsc` 已过；build 待十条批量执行 | ac4be00d |
| html | WHATWG HTML→`html-definition`/`html-structure`；MDN structuring→`html-structure`/`html-semantics`；MDN elements→`html-elements`/`html-native`；W3C relationships→`html-semantics`/`html-boundary` | 待 reviewer | 本地 3410：语义开关、原生 button 与 div 对照、鼠标激活；键盘待补 | `tsc` 已过；build 待十条批量执行 | 28cd0a21 |
| javascript | MDN language overview→`javascript-definition`/`javascript-state`；MDN events→`javascript-events`；MDN client-side APIs→`javascript-dom`/`javascript-host`；TC39→`javascript-definition`/`javascript-boundary` | 待 reviewer | 本地 3410：状态/DOM 读数分离、浏览器/Node 宿主切换；键盘待补 | `tsc` 已过；build 待十条批量执行 | 待提交 |
| dom | WHATWG DOM→`dom-definition`/`dom-tree`；MDN DOM scripting→`dom-tree`/`dom-current`；MDN querySelector→`dom-query`；MDN textContent→`dom-text`/`dom-boundary` | 待 reviewer | 本地 3410：节点树选择、当前文本写入、源 HTML 不变；键盘待补 | `tsc` 待本条完成；build 待十条批量执行 | 待提交 |

## 现状证据

2026-10-07 实际打开线上 `responsive`：主体仍是视口/容器/卡片/操作五张通用卡，详细讲解只有定义与边界。当前 `demoSteps` 与 CSS 专用 foundation schema 的 `steps`、`chain` 都已改为可变长度（1–7），不存在用户规定的固定三步要求；本批专属页也不把流程当作默认画法。其余与本批无关的字段不扩大修改。

Obsidian 配置指向的 `D:/Obsidian/gysnote` 在本机不存在，跳过；本文件保留代码相关记录，DP 保留实际研发状态。
