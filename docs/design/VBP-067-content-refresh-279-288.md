# VBP-067：访问控制、数据库与网络基础词条升级

父需求：VBP-012「全站概念词条分批升级与补全」  
需求：VBP-067「第047批：访问控制、数据库与网络基础词条升级」  
范围：逐条重写十个面向零基础读者的概念页；每十条统一更新公开清单并发布。ZCode CLI 未调用，审查仅使用唯一 review 子智能体 `/root/ai_stack_review`。

## 词条范围

| # | slug | 机制主线 |
|---:|---|---|
| 1 | `rbac` | 角色把权限绑定到职责，换角色即可观察可访问范围变化 |
| 2 | `api-key` | 长期凭证只负责证明身份，不能替代最小权限与轮换 |
| 3 | `relational-database` | 表、关系和查询把同一对象的事实组织成可组合的数据结构 |
| 4 | `nosql` | 文档结构随读取方式调整，灵活性与一致的查询契约需要取舍 |
| 5 | `row` | 一行保存一个对象实例，筛选后仍能定位完整记录 |
| 6 | `column` | 一列表达同一属性，类型与缺失值约束批量计算 |
| 7 | `acid` | 事务把多步写入包成全有或全无，并在故障后维持约束 |
| 8 | `tcp` | 连接、编号、确认和重传让字节按序到达 |
| 9 | `udp` | 独立数据报直接发送，不承诺连接、顺序或重传 |
| 10 | `tls-handshake` | 握手协商密码套件、认证服务端并建立后续加密会话 |

每页均保留原有 slug、relatedSlugs 与正文锚点，并使用独立的首图、三步机制演示、可见结果和失败分支；十页的场景、角色和状态变化没有复用同一套动画模板。

## 研究与正文

- 每个词条的研究数据位于 `content/zh/term-research/backend-data.json`，均包含四个可直接打开的官方或规范资料 URL；十条共 40 个研究链接，逐段映射到正文或演示说明。
- 页面正文围绕读者原话展开，补齐必要前提、过程、边界和相邻概念；来源锚点与段落一一对应，避免只在页尾堆一组链接。
- `content/zh/term-batches/backend-data.json` 中的十条记录与当前实现的三步演示逐一同步；`published-terms.json` 在十条完成后一次性从 233 条更新为 243 条。

## 实现与逐条提交

实现位于：

- `components/terms/BackendNetworkTermPages.tsx`
- `components/terms/backend-network-lessons/BackendNetworkLesson.tsx`
- `components/terms/BackendNetworkConcepts.module.css`
- `lib/backend-network-sources.ts`
- `app/terms/[slug]/page.tsx`

十个词条分别提交，之后才做统一公开清单更新：

| slug | commit |
|---|---|
| `rbac` | `3fb3409d` |
| `api-key` | `3e7459b6` |
| `relational-database` | `900ee96d` |
| `nosql` | `a7435dcc` |
| `row` | `36399306` |
| `column` | `9f12d463` |
| `acid` | `4638339c` |
| `tcp` | `89339245` |
| `udp` | `b68facac` |
| `tls-handshake` | `3f95466f` |

统一收口与验收修复提交包括：来源与锚点稳定化、段落来源映射、公开清单更新、十条演示与三步 lesson ledger 对齐、TCP/UDP 数量修正、首图高度和移动端溢出修正；最终功能分支树为 `4e35284a`，生产源为 `8f17b4d064979ab2c7e41e47af9a84d213cd413d`。

## 审查与验证

唯一 review 子智能体对最终树给出 PASS。审查期间修复了重复 AI 锚点、研究签名与 batch steps 漂移、TCP/UDP 演示数量错误以及移动端首图固定高度遮挡正文等问题。

- `npm run typecheck`：通过。
- `npm run build`：通过，生成 255 个静态页。
- `git diff --check`：通过。
- 十条研究数据均为 4 个 URL；所有 backend source URL 返回 HTTP 200；段落引用无 missing/orphan。
- 真实浏览器开发环境：1450px 与 390px 逐条打开十页；三步演示、失败分支、重置、键盘可达状态和 aria-pressed 均通过；无横向溢出、首图遮挡、404 或 console error。
- 生产 HTTPS：根路径及 `/terms/rbac`、`/terms/api-key`、`/terms/relational-database`、`/terms/nosql`、`/terms/row`、`/terms/column`、`/terms/acid`、`/terms/tcp`、`/terms/udp`、`/terms/tls-handshake` 全部返回 HTTP 200；`vibepolaris-web-1` 为 `running healthy`。
- 文本的 `<strong>` 与证据句在无 CSS 的可访问文本中会直接相邻，但视觉间距与语义结构正常；这不是阻塞问题。

## Git、DP 与发布

- dev PR [#312](https://github.com/Gyschuaner/VibePolaris/pull/312) 已合入 `dev`，合并提交 `41ecaa69ed8e2f73ba2eee5cfd37c8bdb00ff1fd`。
- DP dev 部署：`local-dev-20261004-vbp067-41ecaa6`，对象 ID `6d140d2b-3f61-4d7e-aa84-fb4bdd0b90c5`，地址 `http://127.0.0.1:3223`。
- 生产 PR [#313](https://github.com/Gyschuaner/VibePolaris/pull/313) 已合入 `main`，生产源提交 `8f17b4d064979ab2c7e41e47af9a84d213cd413d`。
- DP 生产部署：`deploy-vbp067-backend-network-279-288-prod-20261004`，对象 ID `3dc3e8ec-0f91-4f5b-a305-7a97293487ac`，地址 `https://vibe.chuansgu.top`。
- DP 中 VBP-067 已从 `testing` → `ready_for_release` → `released`；质量门禁通过，无开放 Bug。
- 生产 release：`/opt/vibepolaris/releases/20261003T170829Z-8f17b4d0`；当前链接 `/opt/vibepolaris/current` 已指向该目录。
- 回滚备份：`/opt/vibepolaris/backups/20261003T170829Z-from-9b9b961a`，保留上一版 release、Compose 配置和 `vibepolaris:9b9b961a3af8bd56f837fc0960081ba84e775b97`；`vibepolaris_xiaobei_data` 数据卷未改动。
- 生产镜像首次构建时 Docker Registry 拉取 `node:22-alpine` 超时；改用已存在且依赖锁文件一致的 amd64 生产基底，在本机完成干净 `npm run build` 后构建并流式传输。服务器满盘时只清理未被容器使用的旧 VibePolaris 镜像标签，保留当前、上一版和本次镜像；部署后根分区约 5.6GB 可用。

回滚时使用备份目录中的 Compose 与上一版镜像重新启动同名 `web` 服务，再将 `/opt/vibepolaris/current` 指回上一版 release；保留上线后产生的数据，不覆盖 `vibepolaris_xiaobei_data`。

## 本地范围

用户主工作区 `/Users/guyisheng/Documents/VibePolaris` 的 icon 设计改动仍留在本地工作区，没有进入本批提交、dev、main 或生产发布。
