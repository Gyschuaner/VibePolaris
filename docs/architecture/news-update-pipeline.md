# 新闻更新管线设计

状态：仓库侧实现基线，2026-10-01。关联需求：VBP-049（DP 当前未找到对应记录，因此不写入虚构的需求状态）。

这套方案把新闻分成“发现、草稿、发布、检索”四个边界。六小时任务负责发现和整理候选内容，证据门槛通过的常规候选可由受保护的 `dev` PR 自动提升；重大、证据不足、风险不确定或关系未确认的候选始终进入人工复核。公开站点仍然是可复现的静态构建，不把一个运行中的容器当作内容数据库。

## 一次更新的完整路径

```text
每 6 小时（北京时间 00:00 / 06:00 / 12:00 / 18:00）
  ↓
读取允许的 RSS / Atom / 官方 API
  ↓
规范化 URL、标题、时间、摘要和来源
  ↓
按 canonical URL + 内容指纹去重
  ↓
生成关联词条和关联文章建议（带依据和置信度）
  ↓
写入 `news-auto/<run-id>` 分支的新闻草稿
  ↓
常规且证据充分的候选自动提升；其余保持 `needs-review`
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

继续使用版本库中的 `content/zh/news.json`。它是公开页面和构建时 Xiaobei 检索的唯一来源。只有状态为 `published` 的文章才进入这个文件；正文、来源、发布时间和人工确认后的关系一起提交，便于回滚和审计。

### 草稿内容

六小时任务把候选文章写到：

```text
content/zh/news-drafts/YYYY-MM-DD/<slug>.json
```

草稿跟着 feature 分支和 PR 保存，不进入 `news.json`，也不进入公开 sitemap。PR 是审核入口，合并即表示这批文章可以发布。草稿目录不应被页面或 Xiaobei 直接导入。

### 原始抓取材料和运行记录

原始 RSS / API 响应、抓取时间、失败原因和去重指纹不放进公开内容目录。CI 可以把它们作为保留期有限的 workflow artifact；若将来需要长期运营面板，再放进独立的 `news_ingest` SQLite 表或对象存储。第一版不把原始响应写进主站镜像，也不把密钥写入仓库。

## 草稿字段

草稿沿用已发布文章字段，并补充审核所需的机器字段：

```json
{
  "slug": "source-slug",
  "title": "候选标题",
  "summary": "候选摘要",
  "body": "候选正文，保留来源事实和明确的推断边界。",
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
  "isExample": false
}
```

`status` 支持 `discovered`、`draft`、`needs-review`、`published`、`rejected` 和 `archived`。只有 `needs-review` 草稿可以被显式提升为公开文章；提升后保留 `published` 草稿供审计与幂等重试。公开 `news.json` 不含状态、审核记录或机器建议字段。`isExample` 只能由人工明确设置，自动抓取不得把真实来源伪装成示例。

仓库侧的交接契约在 `content/zh/news-drafts/README.md`，校验和提升入口是：

```bash
npm run news:validate
npm run news:publish -- content/zh/news-drafts/2026-09-30/<slug>.json
npm run news:publish -- content/zh/news-drafts/2026-09-30/<slug>.json --approve
```

默认提升命令只做 dry-run。只有在 feature 分支上明确加入 `--approve` 才会写入 `content/zh/news.json`；原草稿保留为 `status: "published"` 的审计记录。`news:auto-publish` 只接受同时满足以下条件的候选：至少一条 HTTPS 证据、`verification.status=verified`、`riskLevel=routine`、至少一个已确认公开词条且所有关系建议已确认。重大消息、证据不足、关系未确认或风险不确定的候选保留 `needs-review`，不会自动公开。`npm run build` 会先自动执行 `news:validate`，所以未通过草稿契约或关系校验的变更不会进入构建。

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

- `relatedSlugs` 是人工确认的公开关系，页面和 Xiaobei 只使用这一层。
- `relationSuggestions` 是机器建议，必须携带 `score`、`evidence`、`method` 和 `status`，只能在 PR 中供编辑确认。

第一版用可解释的词面规则：标题、摘要和正文分别匹配词条中文名、英文名、slug 与 aliases，标题权重最高，摘要其次，正文最低；低于阈值不建议关系。后续可以加入 embedding 或模型复核，但模型只能给建议，不能绕过审核直接发布关系。

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

- `search_news(query)`：按标题、摘要、来源、关联词条和日期搜索已发布新闻，返回 slug、标题、摘要、日期、来源和 `/news/<slug>`。
- `read_news(slug, offset)`：分页读取已发布正文、来源和关联词条，返回 `truncated` / `nextOffset`，和 `read_term` 的行为一致。

这两类工具已经接入当前实现：新闻目录、页面上下文和意图分类都只读取 `newsArticles`（也就是版本库中已发布的 `content/zh/news.json`）。工具返回 `/news/<slug>` 站内链接、发布日期和来源；草稿目录没有导入路径，也没有外部联网工具可以绕过发布边界。

系统提示中的已发布目录只放短目录，不把全部正文塞进每轮上下文。只有模型调用工具读取到的正文才进入回答上下文。回答中涉及新闻时必须给出站内新闻链接和来源日期；无法从已发布文章确认的“最新”信息要明确说明当前知识范围，不能假装实时联网。

意图分类也要把“站内新闻、某条进展、某天更新、文章和词条关系”判为 `related`。引用转换器同时允许 `/news/<slug>`，但仍拒绝外部和未发布路径。

## 六小时任务的最小实现

当前职责已对齐：主助手 Dots 在云端 shell 负责采集、去重、事实核对、写作和关系建议；仓库侧负责接收草稿、验证、提升、构建、星图和 Xiaobei。Dots 是主助手本身，无需新增同名子任务或外部应用。

云端任务先取得 `news:catalog` 快照，只访问来源清单中的 HTTPS 地址；每次运行用稳定的 `runId`、canonical URL 和 sourceHash 保证幂等。交付物是草稿文件，不能直接写已发布 `news.json`。

一次手动端到端运行需要验证：云端批次交接 → 本地校验 → 证据/关系门槛 → dry-run → 自动提升 → 构建 Docker → 核对新闻页面、sitemap 与 Xiaobei → 通过受保护 PR 合并 → 再由现有部署入口发布。当前不直接执行生产部署。

## 需要确认的产品决策

1. 第一批允许抓取哪些来源：官方博客/RSS、研究机构、开发者工具 changelog，还是已有的具体 URL 清单？这份清单仍由云端 Dots 管理，不写入公开页面。
2. 可信来源是否可以进入 `routine + verified + evidence + confirmed relation` 门槛？仓库默认只按结构化门槛自动提升，重大消息与不确定候选永不自动公开。
3. Xiaobei 只回答已经合并发布的新闻，保持公开页面、站内链接和回答事实一致；邀请制入口继续隐藏，工作流的 smoke test 会检查 session 默认未激活。
