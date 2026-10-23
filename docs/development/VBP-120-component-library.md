# VBP-120 组件库

用户确认采用页面 1 作为陈列首页，进入组件或素材后使用精简详情。负责人顾毅盛；本次范围为实现、定向验收与 dev 集成。

## 路由与内容

`/library` 展示六个条目：滑动导航、柔光渐变、线性图标、展开卡片、纸面阴影、颗粒纹理。分类、关键词及排序保存在 URL，进入 `/library/[slug]` 后返回可恢复当前筛选。

详情只围绕当前条目，包含实际预览、必要参数、复制源码或下载、给 AI 的描述。组件提供 React JSX 与独立 HTML+CSS，样式提供 CSS，预览与导出共用样式定义。素材下载为真实 PNG / SVG；Phosphor 图标保留 MIT 许可证。卡片导出使用当前站点的示例封面 URL，可按项目替换。

内容维护入口为 `lib/library.ts`，样式和导出在 `lib/library-source.ts`，资源位于 `public/library`。无需数据库迁移、账号或后端写接口。图片由 ImageGen 为本次界面生成，界面图标复用项目已有依赖。

新增 `content/site-modules.json` 的 `library` 开关，默认 `true`。关闭后入口和 sitemap 隐藏，列表及详情临时跳转到已开放的首页。桌面导航、移动导航、页脚、路由选中和小北页面上下文同步接入；保留 VBP-119 已隐藏的新闻/关于及个人主页入口。

## 验收证据

- `npm run build` 成功，Build ID `o8-YhfB_f3v6oECaUjzmO`；产出包含目录与六个静态详情。
- 既有 `site-modules.test.mjs`、`site-navigation.test.mjs` 共 2 项通过。开关聚焦检查扩展到 64 种布尔组合。
- 实际浏览器完成筛选/搜索/无结果、详情与返回、导航和折叠交互、参数写入源码、格式切换、复制反馈与描述粘贴核对、PNG/SVG 下载及字节一致性。独立导出的 HTML 可以直接运行并交互。
- 390×844 手机状态无横向溢出；详情保持聚焦，取用面板按屏宽下移。另检查浅色 clay、深色 moss。生产构建预览控制台无 warn/error。
- 源图与实现的同尺寸对照、早期问题与修正见根目录 `design-qa.md`；图片见 `docs/design/VBP-120-library`。

DP 用例 `bb354285-b334-41ca-8bba-db22bd6245a7`，计划 `a9c2375f-8457-446b-b41b-c260ab8590bf`。未调用收费模型或改动用户数据。未额外运行全站测试；剪贴板拒绝提示仅检查实现，未更改浏览器权限人为触发。

## dev 集成与回退

分支 `feat/VBP-120-component-library` 基于 `origin/dev`，通过 PR 集成 dev。本机优化构建预览为 `http://127.0.0.1:3119/library`，环境记录为 `dev-local`，使用独立的 `/private/tmp/vbp120-preview.sqlite`。精确 PR、集成提交及部署批次保存在 DP；不是远端 dev 服务或生产部署。本次没有合并 main。

没有新增依赖或数据结构。回退本需求的合并提交并重新构建即可恢复旧入口；也可先关闭 `library` 开关后重新构建以隐藏板块。无需恢复业务数据。

本机 node_modules 最初使用跨工作树符号链接导致 Turbopack 构建失败，已改为本地副本，最终构建成功；没有修改依赖清单。DP 专用 Agent 不可用时使用相同官方 CLI 完成记录。指定的 Obsidian 库 `D:/Obsidian/gysnote` 在本机不存在，跳过；本次只维护与代码关联的研发记录及 DP 文档索引，不另建飞书方案。
