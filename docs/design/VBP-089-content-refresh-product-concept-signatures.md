# VBP-089 产品与技术基础词条首图更新记录

本批逐条重做十个已有词条的标题旁首屏演示，目标是让零基础读者直接看见概念的关键机制。每条保留自己的对象、操作、证据和边界；没有把十条压成同一张流程图，也没有把其他未完成词条带入本批发布。

## 范围与机制

- 运行时：同一段代码切换浏览器 / Node.js 宿主能力，在 `document` 与 `fs` 的边界停下。
- 包管理：版本范围展开依赖树，再用锁文件固定精确版本与完整性；切换“只按范围”显示重新解析风险。
- TypeScript：类型尺覆盖静态关系，外部 JSON 从尺下穿过；切换运行时校验显示静态保证的边界。
- MVP：假设靶盘保留关键任务与证据槽，移走愿望单后仍能看见验证目标。
- 用户流程：入口票据经过有效 / 过期分支，过期时回到原任务的恢复点。
- 线框图：低保真画布拆出内容、层级和操作；打开视觉层会明确显示它不能替结构验收。
- 信息架构：内容卡被用户任务词吸附到语义区域，团队目录词的宽结果展示命名边界。
- 原型：假设卡、任务胶片和观察台留下停顿或顺利完成的证据，结果只决定下一轮。
- 设计系统：token、组件织片、实例和治理记录一起变化，切换高对比 token 可观察全局替换。
- 无障碍：键盘焦点钥匙串沿真实控件移动，错误分支回到字段，成功分支落到有名称的结果。

机制设计与来源锚点见 [VBP-089 机制差异表](VBP-089-mechanism-matrix.md)。十条正文的段落引用、边界说明和相关概念链接均保留在既有词条内容中；本批新增首图只承担可观察证据。

## 逐条提交

每个词条先独立实现、检查并提交，再进入下一条；最后的共享播放修正单独提交，用来补齐十条的重播契约。

| 词条 | 独立提交 |
| --- | --- |
| runtime | `5ab481f3` |
| package | `a6d2b0e7` |
| typescript | `737ed241` |
| mvp | `9e6ac3f0` |
| user-flow | `ebe343cc` |
| wireframe | `8163c578` |
| prototype | `47e73d1e` |
| ia | `eb6ca73a` |
| design-system | `66088f23` |
| a11y | `dcb479cb` |
| 共享机制矩阵 | `a4d882ef` |
| 重播状态修正 | `f6f1e7e5` |

## 验证与审查

- `npm run audit:terms` 通过：322 个体验、322 个唯一 slug、322 个来源覆盖，重复场景、相邻同类场景和近重复对均为 0。
- `npm run typecheck` 通过；`git diff --check` 通过。
- `npm run build` 通过：Next.js 生成 1064 个静态页面；仅有既有 Node experimental/module warnings。
- 本地生产预览 `http://localhost:3289` 下十条路由均返回 HTTP 200，并逐条检查标题旁演示的分支变化。
- 真实浏览器逐条回归：十条均完成“切换非默认分支 → 跳到末步 → 重播”，重播后状态回到各自默认分支和第 0 步；信息架构单独复核同样通过。
- 真实浏览器 390×844 复核无障碍页，标题旁演示保持紧凑，`document.body.scrollWidth === document.documentElement.clientWidth === 390`，无横向溢出；验证后已恢复默认 viewport。
- 唯一 reviewer `/root/ai_stack_review` 最终结论为 PASS。其发现的重播 P1 已由 `f6f1e7e5` 修复：终态重播、末步 next 和第 0 步按钮都会清理分支；`prefers-reduced-motion` 下终态重播回到第 0 步且不自动播放。

## 发布状态

- 当前分支：`feat/VBP-089-product-concept-signatures`，从更新后的 `origin/main` (`a0edb5c9`) 创建；当前本地 HEAD 为 `f6f1e7e5`。
- 当前阶段：十条本地实现与 review 已完成，rollout 台账已登记为“待批次发布”；代码尚未合入 dev/main，也尚未部署生产。
- DP requirement list 在本次查询仍因 TLS `UNEXPECTED_EOF_WHILE_READING` 无法连接；未创建或伪造 VBP-089 需求、测试计划或部署记录。平台恢复后按 CLI 补录，并以返回的真实 ID 更新本记录。
- 生产发布沿用 [VBP-047 发布说明](../development/VBP-047-production.md)：本机构建 `linux/amd64` 镜像，保留当前 release、Compose 与 `vibepolaris_xiaobei_data`，原子切换 `current`，完成 HTTPS、健康状态、根路径、新闻和十条词条冒烟后记录真实 release、镜像和回滚路径。
- `D:/Obsidian/gysnote` 在当前 Mac 环境不存在，本批未写入 Obsidian。
