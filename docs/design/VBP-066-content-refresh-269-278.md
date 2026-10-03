# VBP-066 · 第 046 批部署恢复与产品规划词条更新及发布记录

## 范围

本批按“逐条修改、逐条审核、十条合批发布”完成：`preview-deployment`、`rollback`、`user-story`、`problem-statement`、`target-user`、`use-case`、`acceptance-criteria`、`scope`、`roadmap`、`priority`。每条词条独立完成资料研究、面向零基础读者的追问式正文、段落级来源映射、概念专属可观察演示、边界与失败分支、真实浏览器验收和独立提交；十条完成后才一次性更新公开清单并统一发布。主工作区中未纳入本批的图标和其他本地功能继续留在本地。

按用户最新规则，本批未调用 ZCode CLI，只使用唯一 review 子智能体 `/root/ai_stack_review` 做读者与语言审查。审查结论为 PASS：十条路由、页面、lesson、batch、research 与公开清单一致；段落引用无 missing/orphan；桌面与 390px 页面无横向溢出，概念专属演示和失败分支均可观察。

## 逐条实现与审查

功能分支：`feat/VBP-066-deployment-product-269-278`，从 `origin/main` 创建。

| slug | 独立提交 |
| --- | --- |
| preview-deployment | `4f3ed5cf` |
| rollback | `92ab07e4` |
| user-story | `74824a6c` |
| problem-statement | `3636e92e` |
| target-user | `7ff47120` |
| use-case | `53495b6c` |
| acceptance-criteria | `87abad2a` |
| scope | `869e2f86` |
| roadmap | `91734671` |
| priority | `17b6637e` |

十条完成后统一更新 `content/zh/published-terms.json`，对应提交为 `90b501f8`；公开清单共 233 条且无重复。功能分支与最新 `origin/dev` 合并解决集成差异后，合并提交为 `3fd0dc12`。

## 本地与 dev 验收

- `npm run typecheck`：通过。
- `npm run build`：通过，生成 245 个静态页。
- `git diff --check`：通过。
- `npm run check`：未通过仓库既有 ESLint 基线（`.agents`、历史页面及其他既有目录共有 1,047 个 error、42 个 warning）；其中包含新 lesson 的 React Hooks 规则提示。该结果已记录，未把无关基线改动混入本批。
- 32 个唯一资料 URL 均返回 HTTP 200；十条页面的段落来源映射无 missing/orphan。
- 真实浏览器桌面 1025px 与移动 390px 验收通过：十条路由均可打开，三步交互可完成，页面无横向溢出、404 或运行时错误。
- dev PR [#309](https://github.com/Gyschuaner/VibePolaris/pull/309) 合入 `dev`，合并提交 `7c4eac88ead3785717c837334dbf7c70b4c04831`。
- DP dev 部署：`local-dev-20261003-vbp066-7c4eac8`，对象 ID `438bfe03-b585-4061-9117-8774079bb262`，地址 `http://127.0.0.1:3223`。

## 生产发布

- 生产 PR [#310](https://github.com/Gyschuaner/VibePolaris/pull/310) 合入 `main`，生产源提交 `9b9b961a3af8bd56f837fc0960081ba84e775b97`。
- 生产镜像：`vibepolaris:9b9b961a3af8bd56f837fc0960081ba84e775b97`（linux/amd64）。
- DP 生产部署：`deploy-vbp066-deployment-product-269-278-prod-20261003`，对象 ID `8d08b7ee-d93c-455d-818d-4ee490af10e1`，环境 `production`，地址 `https://vibe.chuansgu.top`。
- 当前 release：`/opt/vibepolaris/releases/20261003T150429Z-9b9b961a`；`vibepolaris-web-1` 健康检查为 `healthy`。
- 公网十条词条、根路径、`/sitemap.xml` 与 `/about` 均返回 HTTP 200。

## 回滚

- 切换前 release：`/opt/vibepolaris/releases/20261003T120347Z-529786b2`。
- 切换前镜像：`vibepolaris:529786b2002bd33230c26c5dd66d4e0dc87a1ef4`。
- 备份目录：`/opt/vibepolaris/backups/20261003T150429Z-from-529786b2`，保留旧发布目录、旧镜像标识和 Compose 配置。
- 回滚时使用备份中的 Compose 与旧镜像重新启动 `web` 服务，再把 `/opt/vibepolaris/current` 指回旧 release；保留 `xiaobei_data` 数据卷，不覆盖上线后的用户数据。

生产主机根分区在部署后仅剩约 205MB 可用空间；当前服务仍保持 healthy，后续批次部署前需要先处理磁盘容量。DP 中 VBP-066 已推进为 `released`，十条研发任务完成，生产部署与回滚证据已记录。当前机器不存在规则指定的 `D:/Obsidian/gysnote`，未创建空记录。
