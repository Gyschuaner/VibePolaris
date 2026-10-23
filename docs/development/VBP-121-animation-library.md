# VBP-121 首批 300 个动画

在 VBP-120 已确认的陈列首页和精简详情中加入 300 个独立动画，原有 6 项继续保留，合计 306 项。负责人顾毅盛。代码不引入新依赖、账号写操作、数据库变更或外部运行时请求。

## 收录与许可

| 来源 | 数量 | 固定版本 | 许可 |
| --- | ---: | --- | --- |
| [Animate.css](https://github.com/animate-css/animate.css/tree/v4.1.1) | 97 | v4.1.1 / `4aa415199dd4ed7d877d10343e745e8bbb4b7a0c` | 该版本 MIT |
| [Magic Animations](https://github.com/miniMAC/magic) | 65 | `f26d3c3beaf3017c90fb27ac6f67168fac26de06` | MIT |
| [CSS Loaders](https://github.com/vineethtrv/css-loader) | 138 | `e9078959e48c39b97613f333c14aac1c3d765c1f` | MIT |

直接检查固定提交的源文件和 LICENSE；Animate.css 当前主分支的许可与旧版本不同，因此使用经核实的 MIT 4.1.1，不推断后续版本也能按同样许可再分发。每份导出 CSS 带完整版权、许可及精确源文件地址，详情提供来源与许可证下载。未收录许可不明确的搜索结果。

Animate.css 源效果中的同义重复经过结构去重，未用换色、倍速复制充数。CSS Loaders 从 9 类效果轮流选取，合并后为强调、入场、退场、空间变换及 9 种加载效果，共 13 类。保留原始英文名称方便检索。

## 实现与维护

- `content/library/animations.json` 是轻量目录，`animation-sources.json` 保存固定版本；`public/library/animations` 保存 300 份 CSS 和三份原始许可证。
- `scripts/import-library-animations.mjs` 可复现导入：准备三个 checkout，目录名为 `animate`、`magic`、`loaders`，检出上述提交，然后执行 `node scripts/import-library-animations.mjs <checkout-parent>`。脚本检查 HEAD 和许可，不运行上游项目脚本。
- 每个选择器和关键帧使用独立名称；移除上游仅用于展示平台的样式，补充速度变量及 reduced-motion 规则。生成器用归一化结构去重。
- 每页 24 条，分类、类型、搜索、排序、页码保存在 URL。详情返回保持筛选与页码；筛选变化重置第一页。只有进入视口的卡片加载对应 CSS，悬停或键盘聚焦时播放。
- 详情只保留当前效果，提供播放/重播、暂停、0.5–2 倍速；当前速度写入 React JSX 和独立 HTML+CSS。离屏与页面隐藏时暂停；减少动态偏好默认静止，用户主动播放后才开启当前预览。
- 预览使用站点主题色。导出保留来源的默认色，可自行修改 CSS 变量；加载动画的独立 HTML 使用深色背景，以展示上游白色主体。

## 已执行验证

最终 `npm run build` 成功，Build ID `XUDZsmMhSOGLISHTni-06`。单个目录完整性检查覆盖全部 300 项：总数与唯一 slug、CSS 数量、精确来源和 MIT 文本、选择器与关键帧隔离、无外部 URL/import、减少动态规则、HTML 输出和 300 份 JSX 编译。构建与检查输出在 `docs/design/VBP-121-animations`。

实际浏览器：300 项、每页 24 项/13 页、下一页和详情返回保留页码；入场类型搜索 fade 得 13 项；无结果和清除恢复列表。抽查弹跳、旋转换位、圆环、进度、文字、趣味、骨架屏及图形加载，计算样式包含真实关键帧；圆环暂停生效，2 倍速将 1s 缩至 0.5s，重播恢复，复制反馈正常。复制出的 HTML 在独立静态服务中运行，观察到实际运动。

离屏卡片的播放状态实测为 paused。390×844 手机目录和详情的 scrollWidth 均为 390，没有横向溢出；1440×1024 详情没有其他动画的列表。最终浏览器控制台 warn/error 为空。截图、抽样计算样式及具体界面检查见根目录 `design-qa.md`。

验证边界：没有逐个目视审查 300 个效果；采用全量结构检查与跨来源/类型抽样。IAB 切换标签未将原页面置为 hidden，无法在该宿主触发后台暂停分支；减少动态偏好未修改操作系统设置，仅检查实现与 CSS。后续人工如需验证，在普通浏览器打开圆环详情，切后台后应暂停；启用系统“减少动态”并刷新应静止，点击播放后当前预览可运行。未扩大到全站回归或新增权限失败场景。

DP 用例 `85423cc0-c814-45ac-86c4-6cdff2565fe2`，计划 `6475f47f-a3fb-499e-9200-155e845df2de`。实际状态与精确集成提交以 DP 为准。

## 集成与回退

分支 `feat/VBP-121-animation-library` 从 dev 创建，经 PR 集成 dev。本机优化构建服务 `http://127.0.0.1:3119/library?category=animation`，使用独立 `/private/tmp/vbp121-preview.sqlite`，环境记录为 `dev-local`；不是远端 dev 服务。此次 300 动画扩充尚未发布生产，已上线的 VBP-120 六项基础库记录见 [VBP-120](VBP-120-component-library.md)。

回退本需求合并提交并重建即可恢复六项基础库，不涉及用户数据恢复。指定的 Obsidian 库 `D:/Obsidian/gysnote` 在本机不存在，跳过；保留本研发记录与 DP 文档索引。
