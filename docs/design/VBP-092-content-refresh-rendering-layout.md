# VBP-092 渲染与布局词条更新记录

## 范围

从 `origin/main` `7ef40b45` 切出 `feat/VBP-092-rendering-layout-signatures`。本批按词条逐条实现，每个词条独立提交；十条全部完成后才统一更新公开清单、合入 `dev` / `main` 和生产发布。

本批词条：`flexbox`、`css-grid`、`positioning`、`breakpoint`、`media-query`、`module`、`code-splitting`、`lazy-loading`、`hydration`、`csr`。

## 设计决定

- 旧的流程工作台不再从十个页面入口渲染，避免打开文章后看到相同的三栏流程图。
- 每页首图只承担一个可观察机制，使用自己的对象和空间：弹性尺、二维座位表、参照系锚点、内容压力计、环境信号拨盘、live binding、功能门、视口窗口、DOM 插座、浏览器画布。
- 所有首图使用有限步进与重播，进入后台或离开视口暂停，遵守 `prefers-reduced-motion`；失败/边界在画面内有明确状态。
- 正文仍保留原有段落级来源映射；来源数组补齐水合、CSR 的第四份公开资料。

## 逐条记录

| 顺序 | slug | 机制与正文接点 | 实现提交 | review / 浏览器 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 1 | flexbox | 主轴自由空间、grow/shrink、wrap、axis；`flex-free-space` / `flex-grow-ratio` | `6184e076` | 唯一 reviewer PASS；桌面与 390px CUA | 待统一发布 |
| 2 | css-grid | 轨道、跨列、sparse/dense、implicit track；`grid-span` / `grid-dense` | `84740bc7` | 唯一 reviewer PASS；sparse/dense 实际回填 | 待统一发布 |
| 3 | positioning | containing block、占位、viewport、sticky threshold；`position-containing-block` / `position-sticky` | `6fc4537d` | 唯一 reviewer PASS；桌面与 390px CUA | 待统一发布 |
| 4 | breakpoint | 内容压力线先于断点；`breakpoint-content` / `breakpoint-failure` | `578a71d5` | 唯一 reviewer PASS；桌面与 390px CUA | 待统一发布 |
| 5 | media-query | width、hover、motion 信号分别命中规则；`mq-condition` / `mq-combine` | `e6cf6155` | 唯一 reviewer PASS；首步重置已验证 | 待统一发布 |
| 6 | module | live binding、复制快照、TDZ；`module-live` / `module-cycle` | `f3a53024` | 唯一 reviewer PASS；首步 live binding 重置已验证 | 待统一发布 |
| 7 | code-splitting | 动态入口、chunk 请求、缓存、过度拆分；`split-boundary` / `split-granularity` | `dc745744` | 唯一 reviewer PASS；桌面与 390px CUA | 待统一发布 |
| 8 | lazy-loading | viewport window、预留尺寸、ready/error；`lazy-intersection` / `lazy-loading-attribute` | `a4d450b3` | 唯一 reviewer PASS；失败态重试已验证 | 待统一发布 |
| 9 | hydration | server HTML、客户端匹配、事件接管、mismatch；`hydration-match` / `hydration-mismatch` | `de043a82` | 唯一 reviewer PASS；4 来源同序 | 待统一发布 |
| 10 | csr | shell、脚本、数据、DOM、交互；`csr-shell` / `csr-data` | `925a0940` | 唯一 reviewer PASS；4 来源同序 | 待统一发布 |

## 资料核对

已实际打开 W3C、TC39、WHATWG、React、Next.js、MDN、web.dev 和 webpack 的公开资料；完整 URL 与段落锚点见各 `lib/*-sources.ts` 和 [VBP-092-mechanism-matrix.md](VBP-092-mechanism-matrix.md)。

## 验收记录

- `npm run typecheck`：通过（HEAD `5db016ab`）。
- `npm run build`：通过，生成 1064 个静态页面；仅有既有 Node module type / experimental warning。
- `npm run audit:terms`：通过，322 条唯一演示、322 条来源覆盖、重复场景与近重复均为 0。
- 真实浏览器：桌面端十页均 `h1=1`、无横向溢出、无重复 ID、无控制台 error/warn；390px 下十页 `scrollWidth=390`，逐步、重播、Flexbox 几何、Grid dense、Media/Module 首步重置与 Lazy retry 均实测。
- 唯一 reviewer：`/root/ai_stack_review`，HEAD `5db016ab`，十条逐条 PASS；helper、research、experience 来源顺序和 Cite 映射无 orphan/missing/duplicate。

## 发布记录

十条独立提交、唯一 reviewer PASS、真实浏览器验收和构建均已完成；公开清单原已包含这十个 slug，本批统一发布代码与演示更新。生产提交、镜像 digest、release、健康检查和回滚路径在发布后补齐；DP CLI 当前仍受 TLS EOF 阻塞，不能伪造状态或绕过 CLI。
