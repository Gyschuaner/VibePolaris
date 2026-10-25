# VBP-122 组件库分类浏览与按需预览

本轮按用户反馈调整已有组件库：默认展示分类与真实静帧，鼠标移入或键盘聚焦具体动画后才加载当前效果。沿用现有纸感视觉和精简详情。关联 `BUG-6621DC80`，并修复静帧检查发现的 `BUG-1690BA6A`。负责人顾毅盛。

## 浏览方式

| 分类入口 | 类型 | 动画数 |
| --- | --- | ---: |
| 入场与退场 | 入场、退场 | 132 |
| 强调与空间 | 强调、空间变换 | 30 |
| 加载等待 | 圆环、圆点、条形、线条、文字、趣味、图形 | 108 |
| 进度与骨架 | 进度加载、骨架屏 | 30 |

首页和动画页先展示四组入口与全部 13 个类型，避免默认平铺 300 项。全部页继续提供原 6 个组件、样式和素材；搜索可跨类型查找。选中动画类型后，桌面显示分类侧栏，窄屏显示类型选择器。类型、搜索、排序、页码仍保存在 URL；点击动画主分类或选择“分类总览”可返回入口，切换类型从页面开头查看。

## 加载与资产

- 列表请求时直接输出静帧 HTML；详情只把查询参数相关的返回链接放进 Suspense，正文不再等待客户端查询参数才能显示。
- 不预先下载卡片动画 CSS，不预取每个详情。当前卡片可见且悬停/聚焦时才请求对应 CSS；离开即恢复静帧，未完成的请求取消。完成的样式保存在会话内 Map，并通过带内容版本的 URL 使用浏览器缓存。
- 当前详情沿用服务端提供的一份 CSS。保留重播、暂停、倍速、离屏/后台停止与减少动态偏好；用户明确播放可开启当前详情。
- `public/library/posters` 包含 300 张 280×180 JPEG，合计 590,302 字节。它们来自真实 CSS 动画的暂停帧，不是概念示意图。静帧及卡片播放使用相同固定纸色/陶土色，详情跟随站点主题。
- 文件名包含 CSS 与文本内容版本，响应为 `public, max-age=31536000, immutable`。来源许可保留在原 CSS、来源许可证和 `public/library/posters-LICENSE.txt`，没有运行时第三方请求。

导入器现在读取并校验固定上游的 `@content` 文本注解。text05/07/09/10/11/13/14/15 与 graph08 恢复各自所需的 `Load ng`、`Loading` 或 `Deleting`；预览、React、独立 HTML 和静帧统一使用同一 label。原来其中四张帧完全空白，另五项只剩局部伪元素。

## 复现静帧

先按 [VBP-121 的固定来源](VBP-121-animation-library.md) 运行导入脚本。随后运行 `node scripts/library-poster-sheet.mjs 3123`，打开其本机地址；`?batch=0` 至 `?batch=18` 每批最多 16 项。页面会暂停真实动画并选择可见帧，用分区截图按每个 `.poster` 的 `data-file` 与 280×180 区域保存 JPEG。具体取帧见 [poster-frames.json](VBP-122-component-library-browse/poster-frames.json)。

上游 CSS 或 label 改变后，导入器产生新版本，需要重新截图对应文件；改变取帧或渲染方案时升级 `poster-v1`，避免不可变缓存继续使用旧图。目录检查会拒绝缺图、旧版本和遗漏类型。纸色与真实动画对象应同时维护，避免封面和播放跳变。

## 验证证据

最终 `npm run build` 成功，Build ID `vLytukv9XvEmkIjvw2CG_`。单个现有目录检查扩展验证分类覆盖、300 张静帧、内容版本和文字导出，继续覆盖原有作用域、来源许可、HTML 与全部 300 份 JSX 编译。额外解码检查确认 300 张图均为 280×180，均有可见内容；没有逐项目视审核 300 个效果。

最终候选的实际浏览器证据：分类首页和进入文字类型后，动画样式请求均为 0；聚焦 text09 后仅请求该项一次，DOM 只有当前一个活动动画，内容为 `Loading`。失焦恢复已加载静帧，再聚焦不新增请求。详情只有当前项，HTML 源码包含正确文字和 MIT。

同轮浏览器相关验证还覆盖鼠标移入/移出、键盘连续聚焦、临时 503 时保留静帧、入场分类 fade 搜索 13 项、按名称排序、第二页进入详情后返回仍为第二页；暂停生效，2 倍速为 0.5s，重播恢复运行。390px 手机分类、类型切换、返回总览与详情的 scrollWidth 均为 390。最终候选标签的控制台 warn/error 为空。中途的临时请求失败仅用于本机代理故障夹具，不修改应用或生产服务。

证据目录：[构建](VBP-122-component-library-browse/build.txt)、[目录检查](VBP-122-component-library-browse/check.txt)、[HTTP](VBP-122-component-library-browse/http.json)、[浏览器](VBP-122-component-library-browse/browser.json)、[图片检查](VBP-122-component-library-browse/poster-check.json)、[桌面分类](VBP-122-component-library-browse/overview-desktop.jpg)、[手机分类](VBP-122-component-library-browse/overview-mobile.jpg)。早期交互证据与最终候选增量复核在 browser.json 中分开保留。

没有扩大全站回归，没有修改系统减少动态设置；后台与减少动态分支按实现保留，未声称本机宿主已实际触发。指定的 Obsidian 库 `D:/Obsidian/gysnote` 在本机不存在，跳过；研发事实保留在本记录和 DP。

## 集成与回退

分支 `fix/BUG-6621DC80-preview-loading` 从 dev 建立。集成与 dev-local 部署的最终提交、测试状态以 DP 的 VBP-122、两个 Bug 和批次 `vbp122-dev-browse-20261025` 为准。本轮没有生产发布，不改变上次生产版本；本机优化服务使用独立 `/private/tmp/vbp-preview-perf.sqlite`，不接触生产数据。

回退本次 PR 的合并提交并重建即可恢复此前目录，不涉及数据库迁移或用户数据恢复。生产上线仍需本轮明确授权。
