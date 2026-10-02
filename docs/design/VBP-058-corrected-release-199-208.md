# VBP-058 修订批次 · 199–208 词条上线记录

本批修订了十个已有移动端与 CSS 词条。每个词条按 `vibepolaris-concept-pages` 逐条完成资料核对、独立正文、段落级来源、概念专属演示、边界/失败分支和真实浏览器验收；十条完成后一次追加公开清单并统一发布。用户明确不使用 ZCode CLI，本轮未调用 ZCode；reader/language 复核由子智能体只读完成，主助手复核后整合。

需求：`VBP-058`（DP ID `5e56d2a9-c7ba-4acd-8b17-998431f016d1`）
Bug：`BUG-C7F87F9A`（DP ID `ac274385-f826-4f4a-9656-1695b2f404e3`，生产回归后 `closed`）

## 词条范围

| slug | 读者任务与机制演示 |
| --- | --- |
| `offline-first` | 断网编辑、设备保存、同步队列与冲突 |
| `adaptive-layout` | 390/720/1000 窗口下保留订单上下文 |
| `safe-area` | 动态 inset、刘海/手势区与旋转后的边界 |
| `app-lifecycle` | 前后台、冻结/回收与已保存状态恢复 |
| `app-permission` | 相机用途说明、允许/拒绝/不再直接弹窗与文件替代 |
| `push-notification` | 令牌登记、网关投递、点击后从服务器读取订单、无效令牌清理 |
| `cross-platform-development` | 共享核心、平台适配器与能力失败分支 |
| `webview` | origin/schema/version 校验、受控桥接与未知来源拒绝 |
| `css-selector` | `.card`、直接子代、`[disabled]` 与层叠覆盖 |
| `box-model` | content-box 200→234，border-box 200/166 的尺寸变化 |

每个词条使用五份已实际阅读的官方或规范资料；正文引用均有稳定段落锚点，最终检查无缺失来源锚点或段落/章节 ID 冲突。公开清单一次追加十个 slug，从 185 条变为 195 条。

## 逐条实现与集成

- 功能分支：`feat/VBP-058-agent-standard-199-208`，从当时的 `origin/main` 创建；十条及后续对齐修复保持为独立提交。
- 每条内容先在本地完成页面和交互验收，再合入 `dev`；PR [#286](https://github.com/Gyschuaner/VibePolaris/pull/286) 已合入 `dev`，合并提交 `026e8fbda4929221e6ccc385631d9ebaa9026da4`。
- 为保持 `main` 只接收本批修订，另从当前 `main` 生成干净分支 `fix/VBP-058-corrected-main-199-208`，仅 cherry-pick 本批 17 个修订提交；PR [#287](https://github.com/Gyschuaner/VibePolaris/pull/287) 已合入 `main`，合并提交 `50042c3647fadbc2e3064927e7041a6fa6f7e850`。

## 验证

- 每条词条：本地逐条构建、真实浏览器打开正文/资料/演示，抽查对应成功、边界或失败分支；dev 集成后十条入口均能打开并显示资料与演示。
- `npm run build`：通过；干净 main 分支生成 207 个静态路由，生产 overlay 生成 210 个路由。
- `npm run typecheck`：通过。
- 内容 JSON 与 `git diff --check`：通过；引用锚点和章节 ID：无缺失、无冲突。
- `npm run check`：未通过全仓既有 lint 门禁，错误集中在本批之外的历史页面、技能目录、笔记/Xiaobei 与测试文件；本批 build/typecheck 及生产镜像构建通过，未因该既有门禁修改无关代码。
- dev 本地集成记录：`local-dev-20261002-vbp058-026e8fb`，DP ID `fc810322-50d4-4276-962d-a189412b4196`，地址 `http://127.0.0.1:3001`；浏览器确认十条入口、盒模型 200→234→200/166 和权限失败/替代分支。

## 生产发布

旧的错误发布 `deploy-vbp058-content-199-208-prod-20261002`（镜像 `8bd295f6`）已回滚，生产回到 `46b7612c` 后才进行本次修订发布。修订版从生产基线 `46b7612c` 切出 overlay，保留线上既有新闻和其他功能；发布分支为 `release/VBP-058-corrected-prod-overlay-20261002`，提交 `044ef4317883be7b68903c126680bb38122571e7`。

- DP deployment：`deploy-vbp058-corrected-content-199-208-prod-20261002`，DP ID `d077e9e4-1ef3-452b-84c9-04fdb4a4e722`，状态 `released`。
- 发布目录：`/opt/vibepolaris/releases/20261002T150439Z-044ef431`；镜像：`vibepolaris:044ef4317883be7b68903c126680bb38122571e7`。
- 回滚备份：`/opt/vibepolaris/backups/20261002T150439Z-from-46b7612c`；旧镜像 `vibepolaris:46b7612c` 保留，`xiaobei_data` 卷未改动。
- 切换后容器为 `running/healthy`；首页、新闻和十个词条均 HTTP 200；真实浏览器复查盒模型三态与应用权限失败/替代分支；浏览器控制台错误为空。

`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，本轮未创建空记录。
