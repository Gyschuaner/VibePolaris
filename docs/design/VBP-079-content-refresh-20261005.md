# VBP-079：CSS 层叠、模块与渲染词条逐条重写及统一发布记录

## 范围

本批按 `vibepolaris-concept-pages` Skill 逐条完成十条前端基础概念：`cascade`、`specificity`、`positioning`、`module`、`hydration`、`csr`、`ssr`、`ssg`、`routing`、`local-storage`。每条都重新查阅公开原始资料，围绕零基础读者的真实追问组织正文，保留段落级 Cite 映射、边界与失败分支、重置和 reduced-motion；每条有自己的机制演示，没有把十条压成同一套动画。首图统一收紧为标题旁的小型、可观察演示。

按用户要求，十条逐条修改和 review，十条全部完成后一次性加入 `content/zh/published-terms.json`；News 使用已在 main 的现有发布内容，本批没有新增 News 或其他未授权功能。没有调用 ZCode CLI，只使用唯一 review 子智能体 `/root/ai_stack_review`。

## 独立提交与 review

| 词条 | 主要提交 | 首图机制 |
| --- | --- | --- |
| `cascade` | `3493dfb5` | 同一声明在来源、重要性、层、优先级和顺序中逐步决胜 |
| `specificity` | `ed0fd69c`、`bfb8f8df` | ID、类、元素三列比较，包含相同分数和 `:where()` / `:is()` 分支 |
| `positioning` | `0e344aeb`、`5e209cbb` | static、relative、absolute、fixed、sticky 的参照系和阈值 |
| `module` | `c865195a` | 依赖求值、live binding、调用结果和循环依赖 TDZ |
| `hydration` | `3e2723bf`、`85d33a1e` | 已有 HTML 与客户端首次渲染对齐，再接回事件 |
| `csr` | `3e2723bf` | 空壳、浏览器执行、数据到达和可交互时间线 |
| `ssr` | `3e2723bf`、`5d9cff09` | 请求、服务端数据、HTML 流和客户端水合两条时间线 |
| `ssg` | `3e2723bf`、`5d9cff09` | 源文件、构建产物、CDN 发布，发布前不能跳过构建 |
| `routing` | `3e2723bf` | URL 解析、匹配、历史、鉴权和 404 分支 |
| `local-storage` | `3e2723bf` | origin 分盒、字符串化、storage event 和持久化边界 |

最终复审覆盖十条：来源 helper、正文 Cite、research / experience / batch 台账、首图紧凑性、交互状态是否可见、失败/边界分支和响应式布局均 PASS。复审中修正了 specificity 假“下一种情况”按钮、SSR 输入切换残留水合结果、SSG 直接发布跳过构建、module TDZ 仍显示成功图标和 SSG 发布中间态图标等问题。

统一公开清单提交为 `f530e3d6`；随后补记全量来源审计为 `c45dcfa1`。

## 资料与台账

- 每条正文的 Cite 只指向实际支持对应论断的官方规范、官方文档或原始资料。
- helper 与 research / experience / batch 的来源顺序和帧语义逐项对齐，无 orphan、missing、duplicate Cite。
- 新增来源最终检查为 23 个 URL，均可访问（部分 Next 文档经过 308 后最终 200）。
- 全量来源审计更新到 `docs/research/audits/term-sources-2026-08-31.json`；审计中仍有既有 `websocket` MDN 404，以及 Nvidia Dynamo / Kubernetes RBAC 两个网络检查未完成项，它们不属于本批新增来源。

## 验证

- `npm run typecheck`：通过。
- `npm run build`：通过，`news:validate` 同时通过；生成 1,051 个静态页面。
- `npm run audit:terms`：通过，321 条体验、321 个唯一 slug、321 条来源覆盖，duplicate scene、adjacent scene kind、near-duplicate 均为 0。
- `git diff --check`：通过。
- 全量 lint 没有作为本批门禁：仓库既有 `.agents`、新闻和旧词条代码触发约 2,699 个 baseline errors；本批以 typecheck、build、audit 和真实浏览器验收为准。
- 本地预览 `http://127.0.0.1:3250`：十条公开路由逐条加载，桌面宽度 `1085px` 下首图约 `270–402px` 高、无横向溢出；specificity 的下一种情况、module 循环 TDZ、hydration mismatch、CSR 慢 CPU、SSR 慢数据/流式边界、SSG 构建/发布、routing 未知路径、local-storage 直接写对象等分支实际操作可见。
- 生产 `https://vibe.chuansgu.top`：`/`、`/news`、`/sitemap.xml` 和十条 `/terms/<slug>` 均 HTTP 200；Chrome 逐条检查 H1、紧凑首图和无横向溢出，生产 localStorage 分支显示“先序列化对象”，News 时间线显示 135 篇当前范围内容，浏览器控制台无 error。

## Git、DP、发布与回滚

- 功能分支：`feat/VBP-079-css-rendering-concepts`。
- dev PR [#352](https://github.com/Gyschuaner/VibePolaris/pull/352) 已合入，dev 合并提交 `237ccdb7b03ed9b360af74092c7084d81100eb47`。
- main PR [#353](https://github.com/Gyschuaner/VibePolaris/pull/353) 已合入，生产源提交 `ab3ea17964ec63b6a9e659d4ae5bb68b4aa99295`。
- DP 需求 `VBP-079`（`9b953262-db9d-4de2-86ee-6938708556e8`）已 `released`；研发任务 `6597f328-d545-4da4-961e-c31187ed361d` 已 `done`。
- DP dev deployment：`local-dev-20261005-vbp079-237ccdb7`，对象 `02d4d3d8-2978-42e3-b3ea-7da0ffdad3e9`，地址 `http://127.0.0.1:3250`，状态 `released`。
- DP production deployment：`deploy-vbp079-css-rendering-prod-20261005`，对象 `75e56932-a50e-48c3-8eaf-a91a47525b51`，状态 `released`，地址 `https://vibe.chuansgu.top`。
- 生产镜像：`vibepolaris:ab3ea17964ec63b6a9e659d4ae5bb68b4aa99295`（本机构建 `linux/amd64`）。
- 当前 release：`/opt/vibepolaris/releases/20261005T123203Z-ab3ea179`；`/opt/vibepolaris/current` 已原子切换到该目录；`vibepolaris-web-1` 为 `running/healthy`。
- 回滚备份：`/opt/vibepolaris/backups/20261005T123203Z-from-4fee04f9e1e4a426ae37e58537ca9f9470613b07`；旧镜像 `vibepolaris:4fee04f9e1e4a426ae37e58537ca9f9470613b07` 和旧 release 保留。回滚时恢复备份的 Compose / 旧镜像并将 `current` 指回 `/opt/vibepolaris/releases/20261005T104610Z-4fee04f9`，保留 `vibepolaris_xiaobei_data` 数据卷，不覆盖上线后新增数据。

`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此没有创建空记录。
