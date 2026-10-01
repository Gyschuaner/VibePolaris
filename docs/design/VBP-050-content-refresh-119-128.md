# 119–128 词条文案更新与上线记录 · VBP-050

本批按用户要求逐条修改，累计十条后作为一个批次发布。范围是已有数据驱动词条的中文正文、边界、演示文案、测验提示和来源映射；没有新增独立交互功能。公开入口使用现有 `TermExperiencePage`，十条一起加入 `content/zh/published-terms.json`。

## 词条与逐条提交

| 编号 | slug | DP 任务 | 逐条提交 |
| --- | --- | --- | --- |
| 119 | generative-ai | `c1440a9d-866f-4fb3-8647-15682233699c` | `d8f69de` |
| 120 | multimodal | `bb1a8de4-1cf5-4f30-b956-99047ac3240f` | `615e58f` |
| 121 | reasoning-model | `f5dfd308-04f8-46c9-b1d3-790249220b47` | `4e0c265` |
| 122 | system-prompt | `f5fd79e5-6cf9-437f-a42f-92a67670d65b` | `40a9a8b` |
| 123 | few-shot-prompting | `27e5d7fb-dd09-4e43-9bff-652f8d06112a` | `01c6b53` |
| 124 | zero-shot-prompting | `c5afcb04-4ff7-449d-a6e4-b890cede528f` | `02ff6fe` |
| 125 | temperature | `1becce2a-9086-4086-8c12-c8acd7893b66` | `b29bf87` |
| 126 | tokenization | `ecd472e9-6bee-4481-838d-a3ec324adb18` | `3583456` |
| 127 | tool-choice | `e03400dd-b0ea-4ae6-ac05-5799278ed4e4` | `7855839`, `0e2f230`, `dd4bea6` |
| 128 | tool-result | `e891f70a-e6bb-420b-a9b1-58ee89be9344` | `cf48049`, `a2d3c10` |

`f28cb55` 是本批十条一起加入公开清单的批次提交；`ea3f690` 将来源校验上限从 3 调到 5，以容纳每条 4–5 份已读来源。工具选择和工具结果各有一次构建前 schema 对齐提交，把批次演示压回项目要求的 3 步。

## 内容与资料

正文统一补齐零基础读者需要的中间步骤和边界：生成与检索、多模态输入/输出和材料权限、公开可复核检查与私有思维过程、系统提示词与权限控制、少样本/零样本的上下文差异、温度与候选概率、token 与目标 tokenizer、工具选择与执行授权、工具结果与业务字段。每条体验数据保留独立场景，来源数组为 4–5 条；URL、标题和正文映射保存在 `content/zh/term-experiences/ai-stack.json`。

资料覆盖包括 NIST AI 600-1、Transformer、GPT-3、Holtzman；GPT-4、CLIP、Flamingo、Gemini；OpenAI reasoning 与 best practices、CoT、DeepSeek-R1、test-time compute；OpenAI Model Spec、Google、Anthropic、OWASP；少样本/零样本论文及官方提示文档；OpenAI/Hugging Face/Google 解码参数；tiktoken、BPE、SentencePiece、Hugging Face、Anthropic token 计数；OpenAI function calling、Anthropic tool use、MCP、Toolformer、ReAct 与 RFC 9110。具体映射以 JSON 的 `sources` 为准。

## ZCode CLI 协作证据

每条先做 reader，再做 language；使用真实入口 `/Applications/ZCode.app/Contents/Resources/glm/zcode.cjs`，模型配置为 `Qwen3.8-Flash-Next-FP8` 的临时 CLI 数据目录。只读审读，不让 ZCode 修改仓库。

- 119 reader `sess_3e70bfbe-9acf-4beb-8da3-eb13f7c16d82`；language `sess_1e49a3e4-8a7f-43f2-ab59-5fc04bf21aeb`。
- 120 reader `sess_3b5421b3-a20f-41ae-9725-128896042a66`；language `sess_040bc9b4-d91e-4833-b241-f1cff6adeedc`。
- 121 reader `sess_fc33b305-f167-426c-84a3-e1421e2620fd`；language `sess_b938bc04-8087-4b38-8195-a0a4e38106e8`。
- 122 reader `sess_c8a966c6-04c4-400a-972d-67948ad291cc`；language `sess_ad9cc54e-ca5a-48ed-856a-9a244277ceca`。
- 123 reader `sess_1149f605-eea1-4524-a5ed-3bf76fed9799`；language `sess_946b2c8e-ccc2-404d-84e5-569b82efcc65`。
- 124 reader `sess_5ece73ec-9ff4-4690-9462-7cf19ba64179`；language 请求连续遇到 `relay_database_unavailable`/HTTP 503，未将失败写成通过，随后按 humanizer-zh 由主助手完成本地复核。
- 125 reader/language 请求遇到同一 relay HTTP 503，未将失败写成通过，随后按 humanizer-zh 由主助手完成本地复核。
- 126 reader `sess_387469f3-86e1-421e-a50c-08a8eda206cd`；language `sess_b18ab209-90fe-4351-88d6-ab6b1771de2c`。
- 127 reader `sess_6a7ce76d-ed30-4e82-9b52-a7adebebecf9`；language `sess_ec37bb32-bab4-4d03-8d24-ef4ba601be3d`。
- 128 reader `sess_64997972-6308-46b0-8e38-1a81f73d538f`；language `sess_9abbefbf-cdd0-4e82-a827-e7eb3bc65169`。

## 本地验证

- `npm run build`：最终通过；TypeScript 通过，静态页 `127/127` 生成。
- 本分支启动 `http://127.0.0.1:3101`，十条 `/terms/<slug>` 均 HTTP 200；关键文案和 `call_id`/候选概率/tokenizer 等字段存在。
- CUA 真实浏览器抽查：`generative-ai` 切换到“三路生成”并显示候选片段与采样说明；`tool-result` 切换到“结果返回”并显示 `call_id=inv-7`、`HTTP 200` 与 `stock=0`；`tool-choice` 页面显示四种策略入口和审批边界。
- 浏览器验收只覆盖本批新增路由、演示切换和内容可见性；没有扩大为全站回归。未执行真实目标读者测试，模拟 reader 反馈不作为用户验收。

## 发布边界

本批公开清单和现有数据驱动词条入口随十条一起发布；没有把额外功能、独立组件或实验性代码带入本批。十条词条是逐条完成、逐条审读和逐条提交，公开上线按一个十条批次执行。

- PR #268 已合并到 `main`，合并提交为 `69db765d2f378d4b313221012d89ffc486ecf108`。
- 生产使用 `release/VBP-050-prod-overlay-20261001` 覆盖分支，基于当时生产新闻版本 `85b7b0f979502fc71e490db7250e84fe85bda1b8`，部署提交为 `0662c3429667371a90f23d5348d064bc27a1c064`。该覆盖保留既有 `/news`，只叠加本批内容、公开清单、来源 schema 和研发记录。
- DP deployment：`deploy-vbp050-content-119-128-prod-20261001`，ID `8f3fc6dc-936e-4c43-b6d1-c2b0369cca14`，状态 `released`，目标为 `prod`。
- 当前生产发布为 `/opt/vibepolaris/releases/20261001T155220Z-0662c342`，镜像为 `vibepolaris:0662c3429667371a90f23d5348d064bc27a1c064`；容器健康检查通过。
- 生产复核：十条 `/terms/<slug>` 和 `/news` 均返回 HTTP 200；十条关键正文标记均可检出；CUA 抽查 `generative-ai` 和 `tool-result` 的真实页面可见内容，其中后者显示 `call_id=inv-7`、`HTTP 200` 和 `stock=0`。
- 部署中曾发现直接使用 `main` 会覆盖生产已有 `/news` 的风险，已立即回滚到 `/opt/vibepolaris/releases/20261001T151627Z-85b7b0f` 并确认 `/news` 恢复，再改用上述生产覆盖分支部署；数据库卷未改动。
- 回滚目标为 `/opt/vibepolaris/releases/20261001T151627Z-85b7b0f`。`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此未写入 Obsidian，已保留在本记录中。
