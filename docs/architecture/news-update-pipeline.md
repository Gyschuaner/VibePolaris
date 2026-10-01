# 新闻更新管线设计

状态：仓库侧实现与交接设计，2026-10-01。关联需求：VBP-049（DP ID `4dee283c-31a0-4944-bcf8-082f9512586e`）；结构化文章和模型首轮直发改版由 DP 任务 `4fd618eb-43f5-41f1-905a-8f74cd4421e2` 跟踪，当前只在功能分支验证。交付记录见 [`docs/development/VBP-049-news.md`](../development/VBP-049-news.md)。

这套方案把新闻分成“按天发现、草稿、发布、检索”四个边界。每个事件发生日先写一份 `content/zh/news-daily/YYYY-MM-DD.json`，记录候选检索、一手来源、`eventDate`/`publishedAt`、去重结果和空档日；通过核对的候选再进入完整草稿。模型完成首轮自判后，结构完整且通过机械契约的候选由受保护的 `dev` PR 自动提升；模型明确暂缓或机械字段不完整的候选停在草稿目录。公开站点仍然是可复现的静态构建，不把一个运行中的容器当作内容数据库。

## 一次更新的完整路径

```text
按事件发生日建立记录（本阶段先试跑 2021-01-01 至 2021-01-07）
  ↓
候选检索：官方公告/博客、论文原文、监管文件
  ↓
核对事件发生日与来源发布日期，日期不同则分别写入 `eventDate` / `publishedAt`
  ↓
按 canonical URL + 内容指纹去重；没有合格候选就记录空档日和下一步动作
  ↓
每 6 小时（北京时间 00:00 / 06:00 / 12:00 / 18:00）继续处理已授权的新增日期
  ↓
读取允许的 RSS / Atom / 官方 API
  ↓
规范化 URL、标题、时间、摘要和来源
  ↓
生成关联词条和关联文章建议（带依据和置信度）
  ↓
写入 `news-auto/<run-id>` 分支的新闻草稿
  ↓
模型首轮自判 + 机械完整性校验；通过的候选直接提升，其余保持草稿
  ↓
构建 Docker 候选并检查页面、sitemap 和 Xiaobei 邀请制状态
  ↓
创建/更新面向 `dev` 的受保护 PR，合并后进入部署入口
  ↓
新闻页面、日期星图和 Xiaobei 同步看到已发布内容
```

抓取失败、来源暂时不可用或关系判断不确定时，保留上一次已发布版本，不删除既有文章，也不把不完整候选自动公开。

## 数据放在哪里

### 已发布内容

继续使用版本库中的 `content/zh/news.json`。它是公开页面和构建时 Xiaobei 检索的唯一来源。只有状态为 `published` 的文章才进入这个文件；正文、结构版式、来源、发布时间和已确认的站内关系一起提交，便于回滚和审计。

### 草稿内容

六小时任务把候选文章写到：

```text
content/zh/news-drafts/YYYY-MM-DD/<slug>.json
```

草稿跟着 feature 分支和 PR 保存，不进入 `news.json`，也不进入公开 sitemap。PR 是机械结果和代码变更的合并入口，不再承担人工改写新闻正文的步骤。草稿目录不应被页面或 Xiaobei 直接导入。

### 原始抓取材料和运行记录

原始 RSS / API 响应、抓取时间、失败原因和去重指纹不放进公开内容目录。CI 可以把它们作为保留期有限的 workflow artifact；若将来需要长期运营面板，再放进独立的 `news_ingest` SQLite 表或对象存储。第一版不把原始响应写进主站镜像，也不把密钥写入仓库。

## 草稿字段

草稿沿用已发布文章字段，并补充模型首轮自判和机械状态字段：

```json
{
  "slug": "source-slug",
  "title": "候选标题",
  "summary": "候选摘要",
  "body": "候选正文，保留来源事实和明确的推断边界。",
  "hero": {
    "url": "/images/news/source.svg",
    "alt": "头图替代文本",
    "sourceUrl": "/images/news/source.svg",
    "license": "图片来源与许可说明"
  },
  "sections": [
    { "id": "release", "title": "这次更新发生了什么", "kind": "narrative", "body": "按文章需要组织的详细解释。" },
    { "id": "boundary", "title": "怎样理解它的边界", "kind": "boundary", "body": "把官方事实、例子和限制放在同一条叙事里。" }
  ],
  "explainer": {
    "variant": "benchmark",
    "title": "把机制走一遍",
    "question": "读者想知道的一个具体问题。",
    "steps": [{ "label": "输入", "detail": "第一步发生什么。" }, { "label": "结果", "detail": "下一步怎样变化。" }]
  },
  "publishedAt": "2026-09-30",
  "source": {
    "name": "来源名称",
    "url": "https://example.com/article"
  },
  "canonicalUrl": "https://example.com/article",
  "sourceHash": "sha256:...",
  "status": "draft",
  "discoveredAt": "2026-09-30T12:00:00Z",
  "relatedSlugs": [],
  "relationSuggestions": [
    {
      "kind": "term",
      "slug": "grounding",
      "score": 0.86,
      "evidence": ["标题命中别名", "摘要命中术语定义"],
      "method": "lexical",
      "status": "suggested"
    }
  ],
  "relatedArticleSlugs": [],
  "sources": [
    { "url": "https://example.com/article", "claim": "可核验事实", "excerpt": "来源摘录" }
  ],
  "modelReview": {
    "decision": "publish",
    "checkedAt": "2026-09-30T12:00:00Z"
  },
  "mechanicalErrors": [],
  "isExample": false
}
```

`status` 支持 `discovered`、`draft`、`ready`、`needs-review`、`published`、`rejected` 和 `archived`。`ready` 表示模型自判为发布且机械检查已通过；`needs-review` 仅表示模型暂缓或存在待修复字段，不代表再次做人工作文审查。提升后保留 `published` 草稿供审计与幂等重试。公开 `news.json` 不含状态、审核记录或机器建议字段。`isExample` 只能由人工明确设置，自动抓取不得把真实来源伪装成示例。

仓库侧的交接契约在 `content/zh/news-drafts/README.md`，校验和提升入口是：

```bash
npm run news:validate
npm run news:publish -- content/zh/news-drafts/2026-09-30/<slug>.json
npm run news:publish -- content/zh/news-drafts/2026-09-30/<slug>.json --approve
```

默认提升命令只做 dry-run。只有在 feature 分支上明确加入 `--approve` 才会写入 `content/zh/news.json`；这一步是文件写入保护，不是额外的内容审查。`news:auto-publish` 只接受 `modelReview.decision=publish` 且 `mechanicalErrors` 为空的 `ready` 候选，并继续检查 canonical URL、sourceHash、结构版式、头图来源/许可、可用链接、去重、非空正文和已发布词条/文章关系。模型暂缓或字段不完整的候选保持草稿。`npm run build` 会先自动执行 `news:validate`，所以不完整候选不会进入构建。

云端采集只需要交付这个目录中的 JSON：它负责来源抓取、规范化、事实核对、写作和关系建议；仓库脚本负责字段、日期路径、HTTPS、canonical URL、sourceHash、已发布词条/文章存在性和确认状态的最后一道校验。工作流声明北京时间四次调度，但在 GitHub 仓库合并工作流、配置 `NEWS_DOTS_ENDPOINT`/`NEWS_DOTS_TOKEN`、保护 `dev` 分支前不会产生有效生产内容。生产部署仍是单独的环境步骤；工作流只构建候选镜像并运行 `scripts/news-smoke.mjs`，不会通过 SSH 直接改生产机。

## 去重和关系判定

### 去重

按以下顺序判断同一篇文章：

1. 规范化后的 `canonicalUrl` 完全相同。
2. 来源、发布日期和规范化标题相同。
3. 内容指纹相同或高度相似。

重复候选更新原草稿的来源快照和 `lastSeenAt`，不生成第二个 slug。标题相似但来源不同的文章保留为两篇，并生成“可能相关”的建议，不能直接合并。

### 文章到词条

关系分两层：

- `relatedSlugs` 是已确认的公开关系，页面和 Xiaobei 只使用这一层；模型可以在首轮生成后给出关系建议。
- `relationSuggestions` 是机器建议，必须携带 `score`、`evidence`、`method` 和 `status`，只能在 PR 中供编辑确认。

第一版用可解释的词面规则：标题、摘要和正文分别匹配词条中文名、英文名、slug 与 aliases，标题权重最高，摘要其次，正文最低；低于阈值不建议关系。后续可以加入 embedding 或模型复核，仓库只检查最终关系目标确实存在，不因风格或建议状态阻塞正文直发。

### 文章到文章

文章关系使用 canonical URL、共享已确认词条和标题/摘要相似度生成候选。公共星图默认只画已发布关系；草稿预览可以用虚线显示建议关系，避免把未经确认的推断混入公开内容。

## 日期星图怎么展示

页面的时间线只列有文章的日期，不为没有内容的日期占位。选中某一天后：

- 当天每篇文章是一个新闻星节点；同一天的多个节点围绕当天的日期锚点分布。
- 共享词条只渲染一个词条星，连接到当天所有相关文章，形成当天的局部星群。
- 文章到词条使用实线；文章到文章使用更淡的线；关系建议只在草稿预览显示。
- 节点大小由已确认关系数和文章是否选中决定，不能由模型任意决定视觉权重。
- 日期范围仍然可以扩展，但首屏只聚焦选中日期及其邻近上下文，避免稀疏数据把空白误认为内容。

当前 `NewsAtlas` 已有物理布局、选中、高亮、拖拽和平移缩放；下一步只需把 graph data 从“全部文章 + 词条”改成按日期分组的 published graph，并从已确认关系生成 edges。

## Xiaobei 的检索边界

小北不能读取草稿目录，也不能把抓取源 URL 当作任意联网工具。发布后，`lib/xiaobei/knowledge.ts` 增加两类只读能力：

- `search_news(query)`：按标题、摘要、来源、关联词条和事件日期搜索已发布新闻，返回 slug、标题、摘要、`eventDate`、`publishedAt`、来源和 `/news/<slug>`。
- `read_news(slug, offset)`：分页读取已发布正文、来源、`eventDate`、`publishedAt` 和关联词条，返回 `truncated` / `nextOffset`，和 `read_term` 的行为一致。

这两类工具已经接入当前实现：新闻目录、页面上下文和意图分类都只读取 `newsArticles`（也就是版本库中已发布的 `content/zh/news.json`）。工具返回 `/news/<slug>` 站内链接、发布日期和来源；草稿目录没有导入路径，也没有外部联网工具可以绕过发布边界。

系统提示中的已发布目录只放短目录，不把全部正文塞进每轮上下文。只有模型调用工具读取到的正文才进入回答上下文。回答中涉及新闻时必须给出站内新闻链接和来源日期；无法从已发布文章确认的“最新”信息要明确说明当前知识范围，不能假装实时联网。

意图分类也要把“站内新闻、某条进展、某天更新、文章和词条关系”判为 `related`。引用转换器同时允许 `/news/<slug>`，但仍拒绝外部和未发布路径。

## 六小时任务的最小实现

当前职责已对齐：主助手 Dots 在云端 shell 负责采集、去重、事实核对、写作和关系建议；仓库侧负责接收草稿、验证、提升、构建、星图和 Xiaobei。Dots 是主助手本身，无需新增同名子任务或外部应用。

云端任务先取得 `news:catalog` 快照，只访问来源清单中的 HTTPS 地址；每次运行用稳定的 `runId`、canonical URL 和 sourceHash 保证幂等。交付物是草稿文件，由同一轮 workflow 的机械检查和自动提升写入已发布目录，不再等待人工内容校验。

一次手动端到端运行需要验证：云端批次交接 → 本地校验 → 模型首轮自判 → 机械完整性校验 → 自动提升 → 构建 Docker → 核对新闻页面、sitemap 与 Xiaobei → 通过受保护 PR 合并 → 再由现有部署入口发布。当前不直接执行生产部署。

## 需要确认的产品决策

1. 第一批允许抓取哪些来源：官方博客/RSS、研究机构、开发者工具 changelog，还是已有的具体 URL 清单？这份清单仍由云端 Dots 管理，不写入公开页面。
2. 哪些来源交给模型首轮自判为 `publish`？仓库默认只按结构化字段、链接、去重、非空正文和关系目标存在性自动提升；模型明确暂缓的候选不会公开。
3. Xiaobei 只回答已经合并发布的新闻，保持公开页面、站内链接和回答事实一致；邀请制入口继续隐藏，工作流的 smoke test 会检查 session 默认未激活。
