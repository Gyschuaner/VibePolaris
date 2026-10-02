# 099–108 词条文案更新与上线记录 · VBP-038 / VBP-039 / VBP-040

本批从最新 `origin/main`（`4be7a88`）切出 `feat/VBP-038-quality-content-audit`，一次处理十条已存在词条。目标是上线正文文字；Lessons、注册表、来源数组和互动逻辑留在本地实现，不作为本批生产改动。

## 范围与 DP

| 编号 | slug | 需求 | DP 研发任务 |
| --- | --- | --- | --- |
| 099 | citation | VBP-038 | `6b16ae4e-cd3d-41e8-bff1-07614738333b` |
| 100 | grounding | VBP-038 | `0149308b-19ce-49f6-a5ae-172616faf2c7` |
| 101 | hallucination | VBP-038 | `ef761222-d4b7-4a4c-9c5f-a192fae872fb` |
| 102 | eval | VBP-038 | `1c68fd8e-34a8-4887-b349-b38f773b70d2` |
| 103 | benchmark | VBP-039 | `a2b052d5-3f92-4697-892c-606b2d08f4c3` |
| 104 | grader | VBP-039 | `af5ef265-9c8f-4bc9-9c84-96e343916e65` |
| 105 | evaluation-dataset | VBP-039 | `d2811c81-584a-492d-9492-dc74bcf01bbd` |
| 106 | model-routing | VBP-040 | `01993703-86c7-4e51-8475-d73ae7a35fb8` |
| 107 | model-fallback | VBP-040 | `f3dfafcb-d426-4109-b8a4-b70f89946fa8` |
| 108 | prompt-caching | VBP-040 | `799ec913-ac43-4315-a32e-dec22a425710` |

三项需求均为既有词条升级：VBP-038 `29f3c85d-7020-4231-8c25-b465c9e1a0e2`，VBP-039 `8483e5c0-0a5e-4161-83ac-b8b68eefb1c8`，VBP-040 `467b3885-4d0e-414c-a81d-eb92b921faa8`。开始时三项均为 `ready_for_release`；发布前按 DP 允许流转重新查询并推进。

## 机制差异与正文合同

| slug | 读者应观察到的机制 | 本批正文边界 |
| --- | --- | --- |
| citation | 主张 → 材料 → 具体片段；支持为完整、部分或缺少依据 | 引用建立回查指针；链接/DOI 只解决入口，不保证主张正确 |
| grounding | 适用资料 → 权限/版本过滤 → 放入本轮输入 → 核对输出 | Grounding 改变可用证据；RAG 是一种实现；资料进入上下文不等于事实保证 |
| hallucination | 来源支持轴 × 当前事实轴 | 流畅、自信、一致或有引用都不等于真实；语义熵只覆盖部分随采样变化的错误 |
| eval | 案例 + 判据 + 运行记录 + 评分器 → 版本比较 | 分数只说明已覆盖案例和判据；单次成功、平均分、模型评分都需限定 |
| benchmark | 固定题集、协议、硬件/软件、指标 → 可比成绩 | 榜单成绩只覆盖题集与协议；中位数不代表尾延迟或失败率，公开分数不等于业务适配 |
| grader | 判据 + 输出/环境证据 → 通过、分数或未评分 | 评分器是程序、模型或人；关键词不证明实际动作；未评分不等于通过或失败 |
| evaluation-dataset | 案例、背景、预期行为、分组、留出、版本 | 数量不等于覆盖；关联样本不能跨组泄漏；留出集参与调试后不再是未见测试 |
| model-routing | 请求特征/策略 → 模型或实例选择 | 请求前质量路由、级联和负载均衡目标不同；选择不是答案正确保证 |
| model-fallback | 主调用错误 → 条件/兼容性/预算 → 有界接替 | 重试不等于换目标；超时可能已有副作用；429、401、格式不兼容要分开处理 |
| prompt-caching | 相同前缀 → 中间状态复用 → 新后缀重新生成 | 命中不是旧答案或记忆；模型、工具、前缀、TTL、淘汰和隔离由实现决定 |

互动组件中的退款规则、模型、成绩、调用收据、缓存分段均为本地教学数据。本批只上线上述正文改动；互动仍作为本地实现保留。

## 资料研究

每页保留四份当前来源并将正文锚点映射到来源数组：

- citation：Chicago Manual [citation-location](https://www.chicagomanualofstyle.org/tools_citationguide/citation-guide-1.html)、W3C Web Annotation [text quote selector](https://www.w3.org/TR/annotation-model/#text-quote-selector)、ALCE [论文](https://arxiv.org/abs/2305.14627)、Crossref [DOI display](https://www.crossref.org/display-guidelines#display-guidelines-for-crossref-dois)。
- grounding：Microsoft Copilot [工作资料](https://support.microsoft.com/en-us/microsoft-365-copilot/what-information-does-copilot-use-to-answer-my-prompt)、Azure [grounding data design](https://learn.microsoft.com/en-us/azure/well-architected/ai/grounding-data-design#types-of-data)、Lewis RAG [论文](https://arxiv.org/abs/2005.11401)、Anthropic [reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations#basic-hallucination-minimization-strategies)。
- hallucination：Ji [综述](https://arxiv.org/abs/2202.03629)、Maynez [摘要研究](https://arxiv.org/abs/2005.00661)、TruthfulQA [论文](https://arxiv.org/abs/2109.07958)、Farquhar [semantic entropy](https://doi.org/10.1038/s41586-024-07421-0)；NIST GenAI Profile [confabulation](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=958388#page=9)用于定义边界。
- eval：Anthropic [agent evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)、HELM [论文](https://arxiv.org/abs/2211.09110)、CheckList [论文](https://arxiv.org/abs/2005.04118)、NIST CAISI [evaluation cheating](https://www.nist.gov/caissi/cheating-ai-agent-evaluations)。
- benchmark：GLUE [论文](https://arxiv.org/abs/1804.07461)、MLPerf [submission guide](https://docs.mlcommons.org/inference/submission/#2-overview-of-mlperf-inference-benchmarking)、HELM [论文](https://arxiv.org/abs/2211.09110)、Dynabench [论文](https://arxiv.org/abs/2104.14337)。
- grader：Inspect [scoring](https://inspect.aisi.org.uk/scoring.html)、Anthropic [grader types](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents#types-of-graders-for-agents)、G-Eval [论文](https://arxiv.org/abs/2303.16634)、MT-Bench/Chatbot Arena [论文](https://arxiv.org/abs/2306.05685)。
- evaluation-dataset：Anthropic [eval structure](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents#the-structure-of-an-evaluation)、Datasheets [论文](https://arxiv.org/abs/1803.09010)、Google [dataset splits](https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets#training-validation-and-test-sets)、scikit-learn [GroupKFold](https://scikit-learn.org/stable/modules/cross_validation.html#group-k-fold)。
- model-routing：RouteLLM [论文](https://arxiv.org/pdf/2406.18665)、AWS [prompt routing](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-routing.html)、FrugalGPT [论文](https://arxiv.org/pdf/2305.05176)、LiteLLM [routing](https://docs.litellm.ai/docs/routing)。
- model-fallback：LiteLLM [routing reliability](https://docs.litellm.ai/docs/routing)、RFC 6585 [429](https://www.rfc-editor.org/rfc/rfc6585#section-4)、Portkey [archived fallback cookbook](https://github.com/Portkey-AI/portkey-cookbook/blob/main/ai-gateway/how-to-setup-fallback-from-openai-to-azure-openai.md)、AWS [retry/backoff](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html)。
- prompt-caching：OpenAI [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)、vLLM [prefix caching](https://docs.vllm.ai/en/latest/design/prefix_caching/)、Anthropic [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)、SGLang [RadixAttention paper](https://papers.nips.cc/paper_files/paper/2024/file/724be4472168f31ba1c9ac630f15dec8-Paper-Conference.pdf)。

## ZCode 协作证据

实际使用 `/Applications/ZCode.app/Contents/Resources/glm/zcode.cjs` 对十条各启动一个 `reader` 和一个 `language` 会话，模型为 `Qwen3.8-Flash-Next-FP8`，`xhigh`。所有提示先要求读取 `vibepolaris-zcode-partner/SKILL.md`；language 会话同时读取 `humanizer-zh/SKILL.md`。ZCode 只读工作区，未写入代码。

| slug | reader session | language session |
| --- | --- | --- |
| citation | `sess_112f4852-add3-4eeb-ad69-264bebdaa64e` | `sess_f44f6530-4a4b-4d0f-a09d-7f060223ff15` |
| grounding | `sess_05ea414b-37a8-443f-8694-1d2030240da4` | `sess_429de042-1978-4bbb-b0c8-23d617b1f099` |
| hallucination | `sess_d545b8d6-d09b-4516-b85e-27d81008a0cf` | `sess_b6938bf0-ee0e-4d58-a950-d776f700191b` |
| eval | `sess_33c16659-8e20-4d83-9fde-0bdd634fc31c` | `sess_4757378e-61cc-4ba5-9c17-794dba32a233` |
| benchmark | `sess_a1ba1fc6-c103-48dd-91cc-1130db449b04` | `sess_585cf4fe-3ee4-46e6-a7b2-c8b7db5e93f1` |
| grader | `sess_e8134ad5-4650-4a26-a01d-ce076741edf6` | `sess_a412bfd4-c5ef-48f1-af9c-eeda885c538e` |
| evaluation-dataset | `sess_faceec76-f980-4878-801b-c6f2292c98ec` | `sess_b0eb0bf7-4aaa-495a-92ad-e98c25d85f04` |
| model-routing | `sess_ec7f0190-2213-4129-805b-6463696a9a41` | `sess_3e814e09-12d6-4a2c-93d2-a776a9a45c92` |
| model-fallback | `sess_b1c42944-47b0-44c4-9005-d24152baec11` | `sess_b6879ee1-b053-465f-94ed-a7d6a49cab18` |
| prompt-caching | `sess_9d6e01bc-2649-443a-90da-881694b2b3a6` | `sess_4b704e73-ff65-4002-8b21-235e87b024e8` |

读者审读结论已吸收：补足普通读者的主语、入口/定位/支持三层、Grounding 与 RAG 的边界、幻觉两条独立检查轴、评测/评分器/留出集的角色、路由与负载均衡区别、fallback 错误与副作用、缓存前缀和命中条件。语言审读已吸收：减少裸缩写与翻译腔，统一“评分器/判据”等称呼，显式写出限定方向；未接受会改变机制或扩大交互范围的建议。

## 实现与验证计划

- 代码范围：`components/terms/EvidenceConceptPages.tsx`、`QualityConceptPages.tsx`、`AssessmentConceptPages.tsx`、`ModelDeliveryPages.tsx`；Lessons、registry、source arrays保持不变。
- 本地检查：`git diff --check`、`npm ci`、`npm run build`；随后启动本地服务，用真实浏览器逐条访问十个路由并各操作一次现有 Lesson。
- 生产发布：功能分支提交后，从最新 `origin/main` 建 release 分支；主干合并十条正文后，生产 overlay 以部署时真实线上提交为基底叠加这十条 source commit，保留已有 news 内容。部署完成记录镜像、release 目录、健康检查、十条 HTTP 200、浏览器代表交互和回滚目录。
- 记录：DP 任务逐项 done，VBP-038/039/040 按允许状态推进并写 deployment record；Windows 路径 `D:/Obsidian/gysnote` 在本机不存在，跳过。

## 本地验证结果

- `git diff --check` 通过。
- `npm ci` 完成；npm 报告 2 个已有依赖漏洞（1 high、1 critical），本批未升级依赖。
- `npm run build` 通过：117/117 静态页生成，TypeScript 检查通过。
- 使用真实浏览器同源地址 `http://localhost:3236` 逐页检查十条路由的更新关键词，10/10 命中。
- 真实浏览器逐条操作现有 Lesson：citation 完成“标记出处 → 核对”并显示“原文支持”；grounding、hallucination、eval、benchmark、grader、evaluation-dataset、model-routing、model-fallback、prompt-caching 均完成一次主流程并显示状态结果。浏览器 `error/warn` 日志为空。
- 首次使用 `127.0.0.1` 时 Next 开发资源被 `allowedDevOrigins` 拦截，且磁盘空间不足；清理其他 worktree 的可再生缓存后改用同源 `localhost` 复验通过。该环境问题未改入产品配置。

本地工作树改动只在四个概念正文组件与本记录、索引文件；Lessons、registry、source arrays没有改动。生产发布证据、PR、回滚和 DP 结果在合批上线后继续补记。


## 批量上线结果（2026-10-01）

- PR [#262](https://github.com/Gyschuaner/VibePolaris/pull/262) 已合入 `main`，合并提交为 `840340480974f0bbda52ca4f030639897bdd02fb`。
- 生产叠加分支为 `release/VBP-038-prod-overlay-20261001`，从线上 `release/VBP-049-news-fix-20261001`（`1ea5c652469acb7bfa3753064f6ce442d7fb9333`）切出，只叠加本批四个正文组件；提交 `10914cce053471e27c33a117ebcc496784507f13` 已推送。
- 生产镜像为 `vibepolaris:10914cce053471e27c33a117ebcc496784507f13`，发布目录为 `/opt/vibepolaris/releases/20261001T123129Z-10914cce0534`，当前容器 `healthy`。回滚基线保留在 `/opt/vibepolaris/releases/20261001T115904Z-1ea5c652469a`，旧镜像为 `vibepolaris:1ea5c652469acb7bfa3753064f6ce442d7fb9333`；小北数据库卷未改动。
- 生产验收：`/terms/citation`、`grounding`、`hallucination`、`eval`、`benchmark`、`grader`、`evaluation-dataset`、`model-routing`、`model-fallback`、`prompt-caching` 和 `/news` 均返回 HTTP 200，十条正文关键词均命中；生产浏览器完成 citation “标记出处 → 核对这条引用”，显示“原文支持”。
- DP 研发任务十条均已 `done`；VBP-038、VBP-039、VBP-040 均已按允许流转进入 `released`。部署记录：`deploy-vbp038-040-content-099-108-prod-20261001`。
- 生产 PR 的 Codex artifact attachment 因当前线程附件数量超过 100 被拒绝（`thread attachment identity count exceeds 100`），不影响 GitHub 合并、生产部署或 DP 记录；PR URL 已保留在本记录。
