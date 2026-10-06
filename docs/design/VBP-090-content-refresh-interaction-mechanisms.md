# VBP-090 前端与交互机制词条首图更新记录

本批逐条重做十个已有词条的标题旁演示：`semantic-html`、`deep-link`、`app-manifest`、`emulator`、`code-signing`、`gesture`、`haptic-feedback`、`touch-target`、`offline-first`、`adaptive-layout`。每条保留自己的对象、动作、证据和边界，采用紧凑的机制专属演示，不复用一条流程图换名词。

## 机制与资料

机制差异和初始状态见 [VBP-090 机制差异表](VBP-090-mechanism-matrix.md)。正文、研究卡、体验帧和来源仍保存在 `content/zh/term-research/frontend-product.json`、`content/zh/term-experiences/frontend-product.json` 与词条内容模型中；本批首图只把已有概念的关键状态变成可观察证据。

- 语义化 HTML：源代码从普通容器变成结构与原生操作，浏览器解析结果落到无障碍树。
- 深度链接：同一 `/orders/42` 根据登录和安装状态落到应用目标、登录后续走或网页回退。
- 应用清单：删除入口、权限或链接声明后，系统结果分别改变；声明与运行时请求保持边界。
- 仿真器：同一构建先在可重复的仿真器条件中复现，再把功耗和触觉等硬件证据交给真机。
- 代码签名：APK 字节改动会生成新摘要，旧签名无法通过设备验签。
- 手势：短距离快速抬起、越过位移速度阈值、停留后移动分别得到 tap、swipe、drag。
- 触觉反馈：语义事件经过平台模式到设备执行器，同时保留文字和视觉回退；设备不可用时不伪造震动结果。
- 触控目标：同一组落点按实际热区几何得到 3/10、9/10，热区扩大后相邻目标重叠会显出风险。
- 离线优先：编辑先写入本地持久化数据，再进入待同步队列，网络恢复后暴露版本冲突并选择字段结果。
- 自适应布局：390、720、1000 三种可用空间重排导航、列表和详情，最终把键盘焦点映射回原任务按钮。

## 逐条提交

每个词条先独立实现、构建和检查，再进入下一条；后续修正仍按独立提交保留因果关系。

| 词条 | 独立提交 |
| --- | --- |
| `semantic-html` | `3d6a5e60` |
| `deep-link` | `66079073` |
| `app-manifest` | `0f58126a` |
| `emulator` | `bd8d804b` |
| `code-signing` | `a7f9a7c0` |
| `gesture` | `4cfdb0e6` |
| `haptic-feedback` | `1f350c74` |
| `touch-target` | `51bda5f0` |
| `offline-first` | `4851a3f6` |
| `adaptive-layout` | `d5b89756` |
| 机制差异表 | `ee0567cd` |
| 分支与声明状态修正 | `136e3f78`, `46bf64ea` |
| 播放生命周期修正 | `e275027a` |
| 热区、离线与布局证据修正 | `29b707c9` |
| 签名、手势、焦点与来源修正 | `4144f10f`, `3ba53b78`, `3b7dc1c0` |

## 验证与审查

- `npm run typecheck` 通过。
- `npm run build` 通过：Next.js 生成 1064 个静态页面；只出现既有 Node experimental/module warnings。
- `npm run audit:terms` 通过：322 个体验、322 个唯一 slug、322 个来源覆盖；重复场景、相邻同类场景和近重复对均为 0。
- `git diff --check` 通过。
- 本地生产预览 `http://localhost:3291` 真实浏览器逐条打开十条路由并推进末步；桌面宽度 1280 下无横向溢出。触控演示实际命中为 3/10 和 9/10，末态热区与邻居矩形实际重叠；自适应末态的 `document.activeElement` 为“任务 8 完成”。
- 触觉初态不播放无限动画；只有场景播放且词条可见时运行一轮脉冲，暂停、离屏和减少动态效果时停止。
- 唯一 reviewer `/root/ai_stack_review` 最终结论为 PASS。其审查覆盖十条机制差异、状态与来源映射、边界分支、焦点和热区证据。
- 完整 `npm test` 仍有 12 个既有内容基线断言失败，集中在 CSS 教程来源、历史词库数量和早期专属演示期望；本批未修改这些断言对应的历史内容，也未将其误报为本批通过。
- CUA 当前环境无法提供可编程窄视口覆盖；保留此前 reviewer 对 390px 十条路由无横溢出、无重复 ID、无 console error 的真实浏览器证据，当前改动只改变状态常量、几何阈值和焦点行为。

## 发布记录

- 当前分支：`feat/VBP-090-interaction-mechanisms`，从最新 `origin/main` (`0dbb7371`) 创建。
- 本批十个 slug 在 `content/zh/published-terms.json` 中已有公开记录；本批不重复改动公开清单，统一发布页面实现。
- DP requirement/deployment 查询在本轮仍因 CLI TLS `UNEXPECTED_EOF_WHILE_READING` 无法连接，未创建或伪造 DP 对象；平台恢复后只用 `dp.exe` 补录真实需求、测试和部署记录。
- 生产发布沿用 [VBP-047 发布说明](../development/VBP-047-production.md)：本机构建 `linux/amd64` 镜像，原子切换 release，保留旧镜像、Compose 和 `vibepolaris_xiaobei_data` 数据卷，完成健康检查、HTTPS、根路径、新闻和十条词条冒烟后补写精确 release、镜像和回滚路径。
- `D:/Obsidian/gysnote` 在当前 Mac 环境不存在，本批未写入 Obsidian。
