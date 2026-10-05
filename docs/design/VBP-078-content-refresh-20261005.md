# VBP-078：前端布局与交付词条及已整理 News 生产发布记录

## 范围

本批按 `vibepolaris-concept-pages` Skill 逐条完成并统一公开十条已有词条：`flexbox`、`css-grid`、`breakpoint`、`media-query`、`code-splitting`、`lazy-loading`、`dockerfile`、`infrastructure-as-code`、`cdn`、`visual-regression-testing`。每条保留自己的问题入口、资料来源、正文 Cite、失败边界和演示机制；唯一 review 子智能体 `/root/ai_stack_review` 对十条逐条 PASS。Visual Regression Testing 额外修正了 review approval 门禁，未批准时矩阵保持 blocked，回退或重播会清除旧批准。

本次同时恢复已经整理完成的 News 栏目：新闻星图、时间线、详情页、sitemap、站内新闻检索与 4 篇已发布文章（2 篇示例、Anthropic Claude Sonnet 5.5、Google Private AI Compute）。OpenAI Dots 和另外两篇资料仍保留在 `content/zh/news-drafts/2026-10-01/`，状态为 `needs-review`，没有进入公开列表。Dots 采集 workflow 保持没有端点时不抓取的保护，未启用生产定时采集。

## 逐条提交与 review

| 词条 | 主要提交 | review |
| --- | --- | --- |
| `flexbox` | `5e12c99b`、`7b18fc6a`、`1e541e00`、`665c8c9f` | PASS |
| `css-grid` | `92d308b6`、`ed498c52` | PASS |
| `breakpoint` | `6bb25470`、`39946385` | PASS |
| `media-query` | `d9713f84`、`dad6a535` | PASS |
| `code-splitting` | `9e2efe30` | PASS |
| `lazy-loading` | `8a84b2ec`、`5f4060f0` | PASS |
| `dockerfile` | `069e83c7` | PASS |
| `infrastructure-as-code` | `24426b5c`、`aad69367` | PASS |
| `cdn` | `445be44e`、`90a38965` | PASS |
| `visual-regression-testing` | `90a38965`、`0e078615` | PASS |

## 验证

- `npm run typecheck`：通过。
- `npm run build`：通过，生成 320 个静态页面，包含 `/news` 与 4 个新闻详情路由。
- `npm run audit:terms`：通过；新增重复场景、相邻场景和近重复均为 0，保留既有 `timeline/4/5/4=13` 基线提示。
- `npm run news:validate`：`published=4,drafts=3,pending=1`。
- 新闻内容、交接、契约和 Xiaobei 引用定向测试：7/7 通过；`npm run news:smoke` 通过。
- 本地生产构建的新闻星图时间线选择、详情展开、详情路由和新闻关联词条通过真实浏览器。
- 生产 `https://vibe.chuansgu.top` 的首页、about、`/news`、4 篇新闻详情、10 条词条、sitemap、robots 均 HTTP 200；生产浏览器完成新闻星图选择和详情展开，容器日志无应用错误。

## Git、DP 与生产

- dev PR [#343](https://github.com/Gyschuaner/VibePolaris/pull/343) 已合入，提交 `48f239fe5c43780aaa51f8ccff33c2a80f6446ce`。
- main PR [#344](https://github.com/Gyschuaner/VibePolaris/pull/344) 已合入，生产源提交 `96ff6ca508e46182bc1f14874da1edfdf6901e9a`。
- DP dev deployment：`local-dev-20261005-vbp078-48f239fe`，地址 `http://127.0.0.1:3260`。
- DP production deployment：`deploy-vbp078-frontend-news-prod-20261005`，状态 `released`，地址 `https://vibe.chuansgu.top`。
- DP 需求 `VBP-078` 已置为 `released`，研发任务已置为 `done`；VBP-049 保持已发布状态。
- 生产镜像：`vibepolaris:96ff6ca508e46182bc1f14874da1edfdf6901e9a`（`linux/amd64`）。
- 生产 release：`/opt/vibepolaris/releases/20261005T035024Z-96ff6ca5`；`/opt/vibepolaris/current` 已指向该目录；`vibepolaris-web-1` 为 `running/healthy`。
- 回滚备份：`/opt/vibepolaris/backups/20261005T035024Z-from-fc46f561d7b14d82e3ee8f7e9d72be6eb978cde5`，上一版 release 为 `/opt/vibepolaris/releases/20261005T004842Z-fc46f561`，旧镜像为 `vibepolaris:fc46f561d7b14d82e3ee8f7e9d72be6eb978cde5`。

回滚时恢复备份中的 `deploy-docker-compose.yml` 与旧镜像，将 `current` 指回上一版 release，再启动同名 web 服务；保留 `vibepolaris_xiaobei_data` 数据卷，不覆盖上线后的对话和积分数据。

`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此没有创建空记录。
