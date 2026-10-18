# VBP-093 小北词条引用专属图标

2026-10-18，分支 `feat/VBP-093-xiaobei-term-icons`，基于 dev `755d545b`。

## 实现

- 小北共享 `Answer` 组件按已公开词条链接的 slug 复用 `TermIcon`，取代统一书本图标；尺寸 16px。
- CSS 将图标的 span 包装与文字居中对齐。沿用原有名称、链接白名单及关闭回调。
- 新回答、流式文本、历史回答及展开过程均经过此组件；新闻引用与读取词条活动保留原有图标。
- 无新依赖、配置或存储变更。回滚可撤销本需求的代码提交。

## 本地验证

- 执行 `build` 的等价命令：新闻内容校验与 Next.js production build。此机器无 npm 可执行文件，使用已安装 Node 直接执行原脚本及 Next CLI。
- 构建成功，TypeScript 通过，生成 1184 个页面；日志 `/tmp/vbp-xiaobei-icons-build.log`。
- 真实浏览器加载临时本地预览页，使用正式 `Transcript` / `Answer` 和小北样式，示例覆盖 Markdown 链接与裸路径。分词、Token、智能体、上下文、工具调用呈现各自 SVG，图标均为 16×16px；新闻仍为报纸图标。
- 390px 视口展开过程后，文档宽度/滚动宽度均 390px，回答容器宽度/滚动宽度均 350px。点击分词链接触发关闭回调并到达 `/terms/tokenization`。
- 临时预览页不纳入提交或生产构建。无需新增自动化测试；仅验证受影响的展示与跳转。
- 本地小北未激活，此次未调用模型、未验证真实服务端历史读取；新旧回答共用渲染入口由代码确认。

证据：[桌面](xiaobei-icon-evidence/desktop.jpg)、[手机](xiaobei-icon-evidence/mobile.jpg)。截图内容为组件示例回答。

## 集成范围

通过功能分支 PR 集成 dev，部署到本机 `127.0.0.1:3238` 供预览；最终 PR、提交号与实际集成状态记录在 DP VBP-093。未进行远端 dev 部署或生产发布。

本机不存在规则指定的 `D:/Obsidian/gysnote`，跳过该知识库同步。
