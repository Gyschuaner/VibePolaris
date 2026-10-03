# VBP-062 · 生成式 AI、提示控制与权限边界词条 239–248

本批按 `vibepolaris-concept-pages` 逐条重做十个已有词条。每条独立完成资料研究、面向零基础读者的正文、段落级来源映射、概念专属演示、边界与失败分支、TypeScript/build 和真实浏览器验收，并保留独立提交；十条完成后才作为一个批次合入和发布。用户明确不调用 ZCode CLI，本批未调用 ZCode。审读只复用唯一 review 子智能体 `/root/ai_stack_review`，没有创建其他协作者。

需求：`VBP-062`（DP ID `66f6fe5f-1669-4855-a27e-859e3d80335a`）
父需求：`VBP-012`（全站概念词条分批升级与补全）
功能分支：`feat/VBP-062-ai-model-prompt-boundaries-239-248`，从 `origin/main` `1e33757b` 建立。

## 范围、机制与资料

研究底稿统一在 `content/zh/term-research/ai-stack.json`，十条每条恰好 5 个已实际打开的官方、论文或规范来源；引用模块在 `lib/ai-stack-concept-sources/`，每条引用 ID 与正文段落锚点一一对应。批次演示元数据在 `content/zh/term-batches/ai-stack.json`，每条 3 个步骤。十条原本已经在 `content/zh/published-terms.json`，本批不重复修改公开清单，只刷新已公开路由的正文、研究底稿和演示实现。

| 词条 | 读者任务 | 机制变量 | 页面证据 / 失败分支 |
| --- | --- | --- | --- |
| `generative-ai` | 区分生成和查找 | 提示条件、候选分布、逐步采样 | 两种采样文本；清空提示后只剩无任务候选 |
| `multimodal` | 判断缺少哪种输入 | 文字与图片是否同时进入请求 | 加图后能读票面；移除图片则拒答 |
| `reasoning-model` | 判断答案是否经过检查 | 推理预算 | 预算充足完成条件核对；预算紧张标记未完成 |
| `system-prompt` | 判断规则层级 | 系统规则是否存在 | 规则保留 JSON 且拒绝泄露；移除后标记不安全 |
| `few-shot-prompting` | 看懂示例怎样约束格式 | 示例是否一致 | 一致示例得到稳定标签；冲突示例显示不稳定 |
| `zero-shot-prompting` | 分清无示例和无提示 | 任务约束是否清楚 | 同一个“支付按钮无响应”在补充边界后更可复核 |
| `temperature` | 解释采样差异 | 候选概率的拉伸 | 滑块连续改变概率柱；不声称改变事实正确性 |
| `tokenization` | 判断 token 数的前提 | 编码器词表 | 原始字符串、token 片段、编号序列；BPE 与按词示意数量不同 |
| `tool-approval` | 只批准本次高影响动作 | 待审批调用与决定范围 | A/B 逐项选择后执行；C 策略拒绝且无副作用 |
| `permission-boundary` | 识别资源访问处的强制校验 | token scope 与策略匹配 | `read:sales` 放行；`read:salary` 返回 0 行并审计；加 scope 后才 allow |

## 逐条提交与 DP 任务

| 词条 | 主要提交 | 纠偏提交 | DP 任务 | 状态 |
| --- | --- | --- | --- | --- |
| `generative-ai` | `82033a61` | `71710e25` | `57a43d7f-a722-4598-8a80-b3af3d280801` | done |
| `multimodal` | `4dc47921` | `759359b8` | `b81e5555-f249-4090-8afd-daa0342aeb80` | done |
| `reasoning-model` | `6fef4fd6` | `c821ac1c` | `19b98fec-a8da-4ca6-aaf5-43f152dd2240` | done |
| `system-prompt` | `89ebe258` | `66bafd60` | `d825226e-f632-4627-a2d2-d2fd5d1d79eb` | done |
| `few-shot-prompting` | `b3ce8d87` | `08998ecf` | `f471c4c6-1cd7-40e7-bdfa-c1574ea4295e` | done |
| `zero-shot-prompting` | `cb317f7e` | `2c463d73` | `e7aad7d8-7745-48fd-a47d-1286a433a131` | done |
| `temperature` | `fbf792b1` | `40d9bcbd` | `5a4162ed-0049-4b77-9a9d-82272ed911c9` | done |
| `tokenization` | `455b4724` | `40d9bcbd` | `4ed2b521-4283-4350-8bfb-78d11037c846` | done |
| `tool-approval` | `fa2bd2b6` | `a10c318d` | `7f4f1583-2083-412a-9d96-0ce48361364f` | done |
| `permission-boundary` | `81b9f56f` | `a10c318d` | `a2ddc458-30d5-490b-a246-2dbc66c9104d` | done |

## 验收证据

- 唯一 review 子智能体 `/root/ai_stack_review` 对十条逐条给出 reader/language 通过；最终复审明确“十条最终通过”，关键分支、回退/reset、机制差异和 Cite 映射均无 blocker。
- `npm run typecheck` 通过；`npm run build` 通过，Next 编译、TypeScript 和 217 个静态页生成成功。`git diff --check` 通过。
- 10 条本地路由均 HTTP 200：`generative-ai`、`multimodal`、`reasoning-model`、`system-prompt`、`few-shot-prompting`、`zero-shot-prompting`、`temperature`、`tokenization`、`tool-approval`、`permission-boundary`。服务端 HTML 检查共 314 个演示/引用 ID，无重复 ID。
- 十条研究记录各 5 个 `sourceUrls`，批次数据各 3 个 `demoSteps`，十条均在公开清单中。全量来源校验临时结果为 564 个唯一 URL、562 个已验证或受控访问、0 个 404/410、2 个网络不可验证；该临时全量报告未覆盖写历史审计文件。
- 真实浏览器验收使用 `mcp__cua_repl` 在 `http://127.0.0.1:3221` 完成：生成条件清空、多模态图片增删、推理预算充足/紧张、系统规则移除、少样本冲突、零样本约束、温度滑块、BPE/按词、工具 A/B 审批与权限 scope 切换均观察到预期结果。
- `npm run check` 未通过全仓门禁：lint 在仓库既有文件中报告约 964 个错误；独立 `npm test` 为 79 passed、11 failed，失败集中在既有 CSS/原型/词库覆盖断言（公开词条与历史完成清单数量、`prompt-caching` 关联以及 CSS 教程来源）。本批受影响代码的 typecheck/build 和浏览器路径均已通过；未扩大范围修复既有门禁。

## 合入与生产发布

- dev PR [#300](https://github.com/Gyschuaner/VibePolaris/pull/300) 已合并，合并提交：`5b711108f930989fc4212a91ef110125846e080d`。本机 dev 预览 `http://127.0.0.1:3221` 十条路由均返回 HTTP 200；DP 部署记录为 `local-dev-20261003-vbp062-5b711108`（ID `14a608f2-a3a8-4ced-ab39-56c04fdcdfef`）。
- main 生产 overlay 分支 `release/VBP-062-prod-overlay-20261003` 只从 `origin/main` 引入本批 47 个逐条提交；PR [#301](https://github.com/Gyschuaner/VibePolaris/pull/301) 已合并，最终 main 提交：`52f4e3ab047d24405aa94752ad4ed864adefb910`。dev 中其他功能没有进入这个 overlay。
- 生产镜像：`vibepolaris:52f4e3ab047d24405aa94752ad4ed864adefb910`；发布目录：`/opt/vibepolaris/releases/20261003T061740Z-52f4e3ab`；切换后 `vibepolaris-web-1` 为 `running/healthy`，`current` 指向该目录。
- DP 生产部署记录：`deploy-vbp062-ai-model-prompt-boundaries-239-248-prod-20261003`（ID `a4177def-b827-4711-9dea-398efa4f2f8e`），环境 `production`，状态 `released`，地址 `https://vibe.chuansgu.top`。DP 需求 VBP-062 已从 `ready_for_release` 推进为 `released`，十条研发任务均为 done。
- 发布后根路径和十条公网词条均 HTTP 200；真实浏览器在公网 `reasoning-model` 页完成“候选结论 → 展开检查 → 3/3 预算完成”的状态门控复核。生产 Docker build 使用 `linux/amd64`，Next build 生成 217 个静态页。
- 回滚备份：`/opt/vibepolaris/backups/20261003T061740Z-from-be71d284`；旧镜像：`vibepolaris:be71d284ea650eb232dbbaaa28ee535fae70d4a5`。回滚时恢复备份中的 compose、旧镜像和 `current` 目标，保留 `vibepolaris_xiaobei_data` 数据卷。

本批遵守“逐条修改、十条统一发布”；没有逐条上线，也没有把其他 dev 功能带进生产。当前机器不存在 `D:/Obsidian/gysnote`，未创建空的 Obsidian 记录。
