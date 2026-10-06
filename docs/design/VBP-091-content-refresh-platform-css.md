# VBP-091 平台与 CSS 词条首图更新记录

本批从 `origin/main@ceebb47b` 切出 `feat/VBP-091-platform-css-mechanisms`，逐条重做十个已有词条的首图；正文、来源、章节锚点和公开清单保持原有台账。用户要求一条一条修改、十条完成后统一发布，本批已完成唯一 reviewer 复核，等待合并和统一生产发布。

## 词条与独立提交

| 词条 | 首图差异 | 独立提交 |
| --- | --- | --- |
| safe-area | 带刘海/手势条的手机，背景边缘与动态 inset 分离，横屏重算左右安全距离 | `41765cb9` |
| app-lifecycle | 前台内存页面、后台暂停、进程回收和持久化草稿的生存关系 | `854693ac` |
| app-permission | 具体拍照任务、用途说明、系统决定与文件上传替代分支 | `50d686f4` |
| push-notification | 注册令牌、推送服务、服务器事件、通知展示与失效令牌清理 | `297f1ecf` |
| cross-platform-development | 共享订单核心与 iOS/Android 适配器的边界，含越界对照 | `7dc93eba` |
| webview | WebView 页面消息经过来源、方法和参数校验后才到原生分享 | `0e180cfd` |
| css-selector | 选择器逐步收窄 DOM 节点匹配集合，明确命中不等于最终样式 | `359c550a` |
| box-model | content、padding、border、margin 嵌套扩张，切换 content-box/border-box | `60b6357d` |
| cascade | 可叠放规则牌堆，普通层顺序与 `!important` 翻转分别产生胜者 | `8c35f432` |
| specificity | 两条实际选择器的 ID/类/元素三列比较，`:where()` 与 `:is()` 有可见差异 | `9675f591` |

共享窄列适配提交：`1ed21a2b`，为正文主列约 337px 和 390px 视口提供容器级紧凑布局；没有改变十条词条的机制对象或正文内容。完整对象差异见 [VBP-091 机制差异表](VBP-091-mechanism-matrix.md)。

## 资料与正文边界

十个词条的正文和资料台账已在 `content/zh/term-experiences/frontend-product.json` 中维护，每条已有至少四份公开资料。本批首图按这些既有定义表达：安全区域的动态 inset、生命周期的持久化边界、权限的拒绝降级、推送令牌刷新、跨平台适配器、WebView 消息桥、CSS 匹配/盒模型/层叠/优先级。首图不把教学值伪装成实时设备测量，也不把固定演示当成真实系统调用。

## 本地验证

- `npm run typecheck`：通过。
- `npm run build`：通过，Next.js 生成 1064 个静态页面。
- `npm run audit:terms`：通过，322 条 experience、322 条来源覆盖、重复场景 0、相邻场景类型重复 0、近重复对 0。
- `git diff --check`：通过。
- 本地生产构建在 `http://localhost:3292` 逐条打开十个路由；桌面视口 1280px 和显式 390×844 视口均无页面横向溢出。
- 十条首图均手动推进到最终帧；允许/拒绝、有效/过期令牌、清楚/越界边界、受信/未知来源、两种 `box-sizing`、普通/`!important` 分支均已在浏览器中验证。
- reviewer `/root/ai_stack_review` 在最新 HEAD `f0675e70` 复核通过：十条路由逐页 H1=1、`scrollWidth=innerWidth=1470`、无重复 ID、无 console error/warn；计算动画仅 `vp-enter` 单次运行，`infinite=0`，生命周期光标为 `animationName=none`。
- reviewer 还验证了生命周期 lesson 的持久化状态在终态重播后清空、权限拒绝分支显示“仍可选择文件上传”且使用 WarningCircle、跨平台批次步骤已与共享核心/适配器边界一致；十条逐项均 PASS。窄视口、键盘焦点、减少动态效果、来源顺序与 46 个资料 URL 的 200 响应沿用本批浏览器复核证据。
- 当前已提交至 `f0675e70`（包含 `51a5f472` 的 replay/reset 和批次台账修正）；尚未进入 dev、main 或生产部署。

整套 `npm test` 未作为本批必要检查重复执行；仓库已有 12 个与本批无关的内容基线失败，之前已记录。全仓 lint 也保留既有错误，不把它们归因于本批首图。
