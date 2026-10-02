# VBP-049 新闻栏目交付记录

状态：本地实现和回归已完成，等待受保护的 `dev` Draft PR 审核。当前分支为 `feat/VBP-049-news-column`，代码提交 `dbb21e2`（此前的 `c668a73` 是基线，已被平滑动画和关系线收尾修复取代）。未推送、未合并、未部署生产。

## DP 记录

- 项目：`8c243d4c-cf5e-4eca-a682-0a12cc0660b0`
- 需求：`VBP-049`，ID `4dee283c-31a0-4944-bcf8-082f9512586e`；当前状态为测试中。
- 实现任务：`8616601c-b175-4396-ae1f-8d2ab9d0cf9e`，已完成。
- 交互与验收任务：`576d7a7a-6fc3-4a8c-99b1-280c4e9dd0e0`，已完成。
- 测试计划：`92552865-c1ed-444d-aa48-227b157e136f`（`local-docker`），已完成，3/3 用例通过。
- 测试用例：桌面 `8350d3e0-c47c-4f70-aec6-7dd8c596dec6`、移动 `50be4e8d-91a2-4f10-884b-ba74e0aae04d`、契约/检索 `3bfcd106-a936-4bc3-9d5f-7dd252eb690c`。

DP 测试执行包含本地新闻页面与 sitemap URL 证据；浏览器的详细状态、截图和过渡采样保留在 `/tmp/vbp-news-physical-dbb21e2.json` 及 `/tmp/vbp-news-*-dbb21e2.png`。

## 交付内容

News 页面初始不选中文章，不绘制关系线。点击新闻星点或时间线条目后，画布通过 `transform .55s cubic-bezier(.2,.75,.2,1)` 平滑定位，详情栏展开，且只绘制当前文章已确认的关联线。再次点击当前星点或当前已选时间线条目会取消选中、平滑收回详情并清零关系线；三角按钮可折叠/重开详情，切换另一颗星点会更新详情。详情折叠时使用 `aria-hidden` 和 `inert`，桌面鼠标、移动触摸和键盘路径均已验收。

本轮移除了地图周围和时间线的无意义灰色结构线，保留选中状态的品牌色关系线。移动端使用横向日期选择和单列星图，选中后详情自动滚入视口。

新闻内容仍遵循已发布/草稿边界：`content/zh/news.json` 只保存已发布文章；`content/zh/news-drafts/YYYY-MM-DD/<slug>.json` 保存 Dots 交接草稿。`news:validate`、幂等去重、sourceHash、canonical URL、证据/风险/关系门槛和 `news:auto-publish` 保持在仓库侧。Xiaobei 仅检索已发布文章并返回 `/news/<slug>` 站内引用。

## 本地验证

- `npm run typecheck`：通过。
- `npx eslint components/NewsAtlas.tsx`：通过。
- News、pipeline、ingest、Xiaobei 定向测试：7/7 通过。
- `git diff --check`：通过。
- Docker 镜像：`vibepolaris-news:dbb21e2`；Next 静态页面 120/120 生成，`news:validate` 为 `published=2,drafts=0`。
- 容器：`vibepolaris-news-local`，`http://127.0.0.1:3001`。`/`、`/news`、新闻详情、`/sitemap.xml` 均 HTTP 200，`npm run news:smoke -- http://127.0.0.1:3001` 通过。
- 浏览器验收覆盖：桌面初始/打开/重复星点取消/时间线重复取消/三角关闭重开；移动横向时间线、触摸打开与自动滚动、重复触摸取消、三角关闭重开；过渡采样确认 transform 在 0.55 秒内连续变化。

## 真实新闻草稿批次

2026-10-01 从 [OpenAI](https://openai.com/index/introducing-dots/)、[Anthropic](https://www.anthropic.com/claude-sonnet-5-5) 和 [Google DeepMind](https://deepmind.google/blog/advancing-private-ai-compute-with-secure-server-side-memory/) 官方页面核对了 3 篇真实 AI 行业新闻，写入 `content/zh/news-drafts/2026-10-01/`。三篇均带 canonical URL、sourceHash、证据摘录、人工 verification、routine 风险和确认词条关系，状态为 `needs-review`。详细来源、事实边界和校验记录见 [`docs/development/news-evidence/2026-10-01-official-sources.md`](../news-evidence/2026-10-01-official-sources.md)。

本批次已完成 `news:validate`、`news:publish` dry-run 和 `news:auto-publish` dry-run；自动提升结果为空，因草稿仍有编辑复核原因。它们尚未进入 `news.json`、sitemap 或 Xiaobei 检索。

发布路径也在临时 Git feature 分支中完成了一次隔离演练：复制 3 篇草稿后执行 `news:publish --approve`，临时仓库得到 `published=5,drafts=3,pending=0`。当前分支没有写入 `news.json`，这次演练没有改变本地预览或生产环境。

## Draft PR 材料

建议标题：

```text
feat(VBP-049): add published news atlas and Dots handoff pipeline
```

建议目标分支：`dev`。PR 正文：

```markdown
## What changed
- add published News schema, `/news` list/detail routes, sitemap entries, and Xiaobei published-only retrieval
- add Dots draft handoff, canonical/sourceHash validation, idempotent ingest, relation/evidence/risk gates, and routine-only auto-publish
- make the News Atlas readable on desktop and mobile: star/timeline selection, smooth framing, selected relation lines only, repeat-click cancellation, and accessible detail rail

## Validation
- typecheck, targeted ESLint, and 7 News/pipeline/ingest/Xiaobei tests pass
- Docker `vibepolaris-news:dbb21e2` builds 120/120 pages; local smoke and HTTP routes pass
- DP testplan `92552865-c1ed-444d-aa48-227b157e136f` completed with 3/3 cases passed

## Release boundary
- branch: `feat/VBP-049-news-column`
- code commit: `dbb21e2`
- Dots six-hour workflow is present as a protected `dev` PR entry, but has not been merged or activated
- no production deployment or main/dev direct write was performed
```

## 阻塞项

远端 Draft PR 尚未创建，因为本地分支尚未推送，也没有得到推送/合并/部署授权。要启用云端 Dots 更新，还需要在仓库侧配置 `NEWS_DOTS_ENDPOINT`、`NEWS_DOTS_TOKEN`、`dev` 分支保护和审核者；启用前应先手动跑通一批真实来源的交接、校验、构建和回滚演练。当前六小时 workflow 文件只作为候选入口留在 feature 分支，不会在本地容器或生产环境自动运行。

真实来源的自动发布判断和 endpoint/token 的最小权限说明见 [`docs/development/news-evidence/2026-10-01-official-sources.md`](../news-evidence/2026-10-01-official-sources.md)。
