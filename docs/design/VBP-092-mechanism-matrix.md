# VBP-092 渲染与布局机制差异表

本批从 `origin/main`（`7ef40b45`）切出 `feat/VBP-092-rendering-layout-signatures`。十个词条逐条重做演示；旧的流程工作台不再从页面入口渲染，正文、来源锚点和阅读顺序保留。

## 读者任务与证据

| 词条 | 读者要回答的问题 | 画面中的核心对象 | 用户改变什么 | 可见证据 | 边界/失败分支 | 资料与正文锚点 |
| --- | --- | --- | --- | --- | --- | --- |
| flexbox | 为什么同一排项目会变宽、变窄或换行？ | 一条主轴弹性尺、A/B/C 三个项目 | 正空间、负空间、grow 比例、换行、主轴方向 | 尺子余量归零；B 得两份；负空间收回；项目落到第二行 | 最小内容仍可能溢出；多行不共享 Grid 轨道 | W3C Flexbox §9；MDN Basic concepts / controlling ratios；web.dev Flexbox → `flex-definition`、`flex-free-space`、`flex-wrap-boundary` |
| css-grid | 为什么卡片能跨列，自动放置还会留下空位？ | 带编号轨道线的二维座位表 | 跨列、sparse/dense、容器变窄 | 跨列卡片占两格；空位是否回填；隐式行出现 | dense 改视觉位置不改 DOM；minmax 下限可能减少列数 | W3C Grid Level 2；MDN Grid basic concepts / auto-placement；web.dev Grid → `grid-span`、`grid-dense`、`grid-implicit-track` |
| positioning | `top: 16px` 到底相对谁？ | 组件边框、占位幽灵、参照锚点 | static/relative/absolute/fixed/sticky 与滚动阈值 | 卡片相对自己的原位、容器、视口或滚动边界移动 | 没有 containing block 时 absolute 可能跑出组件；sticky 需要滚动边界 | W3C CSS Position 3；MDN position / containing block / inset → `position-scheme`、`position-containing-block`、`position-sticky` |
| breakpoint | 断点该放在哪条线上？ | 内容压力计、导航与按钮的碰撞 | 宽度从宽到窄，再在失效前切换规则 | 字符/按钮开始互相挤压；切换后内容恢复可读 | 断点不是设备名；流体或 container query 可能无需断点 | web.dev Responsive basics / Media queries；MDN media query fundamentals / CSS media queries；W3C MQ5 → `breakpoint-content`、`breakpoint-failure` |
| media-query | 环境条件怎样让一条 CSS 规则加入或退出？ | width、hover、motion 三个信号拨盘 | 切换环境信号和逻辑条件 | 命中的规则牌亮起；布局/提示/动效各自变化 | 查询只决定声明是否参与；布局仍由 Grid/Flex；多个条件可叠加 | W3C MQ5；MDN Using media queries / `@media` / `hover` / `prefers-reduced-motion`；web.dev Media queries → `mq-condition`、`mq-combine` |
| module | import 拿到的是副本，还是同一个绑定？ | 三个模块节点、一条 live wire | live binding / 快照、修改导出值、循环读取 | 调用方跟着值变或留在旧值；循环分支显示 TDZ | 循环依赖不是一律错误，初始化时读取未完成绑定才失败 | ECMA-262 Modules；MDN JavaScript modules / import / export → `module-graph`、`module-live`、`module-cycle` |
| code-splitting | 功能边界什么时候让 chunk 出发？ | 首页入口、上锁的编辑器门、chunk 包 | 打开功能、等待、缓存、过度拆分 | 首次首页无编辑器请求；开门才取包；ready 后复用缓存 | chunk 失败可重试；拆得过碎会增加请求与调度 | webpack Code Splitting；MDN `import()`；web.dev payload；Next.js Lazy Loading → `split-boundary`、`split-import`、`split-granularity` |
| lazy-loading | 资源何时值得进入网络？ | 视口窗口、预留尺寸的资源槽 | 远离/接近/相交/ready/error | 窗口推进后才出现请求；资源换入原槽位 | 首屏内容不应延后；失败必须有回退和重试；观察器不负责下载 | MDN Lazy loading / Intersection Observer；web.dev image lazy loading；WHATWG lazy-loading attributes；Next.js → `lazy-intersection`、`lazy-loading-attribute` |
| hydration | 可见的 HTML 何时真正接上事件？ | server HTML 纸片、client 插座、事件线 | 匹配、连接事件、制造首轮 mismatch | 结构一致后事件线接通；不一致停在警报 | visible ≠ interactive；时间/随机数造成 mismatch 需稳定首轮输入 | React `hydrateRoot` / `renderToPipeableStream`；Next hydration error；web.dev Rendering on the Web → `hydration-match`、`hydration-mismatch` |
| csr | 主要内容怎样在浏览器里长出来？ | 浏览器画布、HTML 壳、JS、数据、DOM 层 | 推进下载/执行/取数/填充 | 挂载点由空变为内容；慢 CPU 让空白停留更久 | 仍需要服务器提供壳、脚本和 API；CSR 不等于没有服务器 | React `createRoot`；MDN CSR / SPA；web.dev Rendering on the Web → `csr-shell`、`csr-runtime`、`csr-data` |

## 实现约束

- 首图主体控制在文章列宽内；不再使用三栏“大流程图 + 长说明”作为十页共同骨架。
- 统一使用 `useScene` 的有限步进、可见区暂停、后台暂停、重播和 `prefers-reduced-motion` 分支；每个词条的对象、空间关系和失败证据独立实现。
- 旧 lesson 工作台从十个页面入口移除，避免同一词条重复出现两套流程动画；正文继续承担详细解释和来源映射。
- 每条事实仍回到现有正文段落与 `lib/*-sources.ts`；本批只新增演示机制，不把动画标签当成正文事实来源。
