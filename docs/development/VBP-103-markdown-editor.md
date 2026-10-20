# VBP-103 画布 Markdown 编辑与渲染

在既有左右分栏正文编辑器中增加轻量格式工具栏；选区包裹或取消格式，无选区时成对插入并将光标放在标记之间。浏览器原生插入保留撤销栈，不支持时保留单步兜底。中文输入法组合事件期间不触发格式命令。输入框中 Escape 后再按 Tab 可移焦，避免键盘困在编辑区。

| 操作 | macOS / Windows、Linux |
| --- | --- |
| 加粗、斜体、链接 | Command / Ctrl + B、I、K |
| 行内代码、代码块 | Command / Ctrl + 反引号、Shift + 反引号 |
| 高亮、删除线 | Command / Ctrl + Shift + H、X |
| 缩进、取消缩进 | Tab、Shift + Tab |
| 小北补全、接受、放弃 | 原有 Command / Ctrl + Enter、Tab、Escape |

B/I 采用 [Obsidian 编辑习惯](https://help.obsidian.md/editing-shortcuts)；高亮和删除线另提供本编辑器的快捷键，未声称完整复刻 Obsidian 默认键位或插件。悬浮工具栏按钮可查看快捷键。

同一 MarkdownDocument 用于实时预览和全文阅读：`==高亮==`、GFM 删除线、代码语法高亮、`mermaid` 围栏图表。颜色使用可导出到 Markdown 的 `<span style="color: #777777">灰色字</span>`；工具栏可选红、橙、绿、蓝、紫、灰和默认色。仅保留 span 单一合法 color 属性，经过 HTML 清洗；其他任意样式、脚本和事件属性被去除。图片数据地址仍经过原有格式与地址校验。节点自动摘要剥除高亮标记，不改原文。

Mermaid 延迟加载并在停顿350毫秒后绘图，严格模式、HTML标签关闭、资源上限和安全配置不可被笔记覆盖；生成 SVG 作为图片展示。未完成或错误图表显示原始代码与提示，修正后恢复。取消的渲染不能覆盖新内容。语法参考 [Obsidian 图表文档](https://help.obsidian.md/advanced-syntax)与[Mermaid 安全设置](https://mermaid.js.org/config/usage.html)。

小北 prompt 同步支持格式上下文：仅续写当前正文/代码/图表，不重复星号、高亮、颜色和闭合标记；代码块只输出当前语言，Mermaid 只输出图表语法。前文仍限制6000字符且不发送光标后文；另发送从光标前文识别的活动围栏（最长80字符），防止长代码截断后丢失语言信息。旧客户端不带该字段也能请求。补全沿用原有身份、同意提示、计量和价格，扣费开关保持关闭。提示词约束不代表模型能保证所有输出语法正确。

## 本地验收

- `npm run build` 通过；最终 dev 源构建ID：`oaFFvbPRL2dlsInK6bzyv`。
- `node --experimental-strip-types --test tests/markdown-editor.test.mjs tests/canvas-completion.test.mjs tests/canvas.test.mjs`：12项通过。覆盖格式选区/光标、包裹取消、块边界、缩进、HTML/颜色清洗、高亮与代码语言、活动围栏、长前文、现有补全计量及 Markdown 往返。
- 真实 IAB 使用独立端口 `http://127.0.0.1:3103`、临时数据库与合成笔记，验证 Command+B、I、反引号，空选区输入、撤销重做、颜色/灰色（计算色值 rgb(119,119,119)）、Tab与Escape移焦、实时预览与阅读、刷新保存、Mermaid错误恢复；390px宽工具栏可完整操作，无控制台error。未使用用户笔记。
- [编辑预览截图](VBP-103-markdown-editor/dev-editor.png)、[窄屏截图](VBP-103-markdown-editor/dev-mobile.png)。

当前机器不存在规定的 `D:/Obsidian/gysnote`；研发和发布记录保存在Git并关联DP。此记录尚未声称生产发布，部署事实在发布完成后补充。
