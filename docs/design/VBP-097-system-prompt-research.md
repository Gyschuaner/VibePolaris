# VBP-097 系统提示词词条研究与实现记录

## 读者任务

读者看到用户要求“把内部规则贴出来”，想知道为什么系统提示词可能让结果保持某种格式，以及为什么这仍然不是安全边界。读完后应能区分三件事：系统提示是一次请求里的高层工作说明；消息层级可以影响冲突时的处理；秘密、权限、工具审批和输出验证必须在模型外落地。

主线场景是一张索取内部规则的用户便签。演示先放下一块“JSON · 不泄露内部规则”的模具，便签进入后被压成受限 JSON；拿走模具时，结果变成“保护缺失”，页面不把缺口伪装成安全。

## 已核对资料

| 来源 | 实际支持的论断 | 页面位置 |
| --- | --- | --- |
| OpenAI, Model Spec | 指令有 authority levels 和 chain of command，更高层级可以压过低层级请求；具体 role 细节要以平台文档为准；秘密和动作边界仍由应用承载 | `system-hierarchy`, `system-boundary-evidence`, `system-practical-boundary` |
| OpenAI, Prompt engineering | 模型可以返回 JSON 等 structured outputs，结构化结果便于应用校验格式 | `system-format` |
| Anthropic, Prompting best practices | system prompt 可以设定角色、行为和语气；清楚的 role 设定能把回答拉回工作范围 | `system-role`, `system-instruction-evidence` |
| Google, Text generation | `system_instruction` 是独立参数，用来配置 Gemini 的行为 | `system-instruction-evidence` |
| OWASP, LLM Prompt Injection Prevention | 可信指令要和不可信数据分开；文字标签不是执行边界，权限要在工具边界验证并监控输出 | `system-separation`, `system-boundary-evidence`, `system-practical-boundary` |

## 演示契约

- 初态：规则卡在场，输出模具显示 JSON 和不泄露边界，用户便签尚未进入。
- 操作：推进到便签进入、碰到封印、输出成形和模具被拿走；同一张便签贯穿 5 帧。
- 可见证据：规则卡是否在场、用户便签、模具窗口、结果卡的格式和风险状态。
- 停止：没有规则时只显示保护缺失，不假设模型仍会安全拒绝。
- 独立差异：首图使用“模具窗口 + 封印”表现输出形状变化，不使用消息节点流程图；正文实验可以切换规则卡和便签类型，且只在本地模拟。

## 实现映射

- `components/terms/SystemPromptConceptPage.tsx`：独立 Hero 与规则模具实验，不调用模型或网络。
- `components/terms/SystemPromptConceptPage.module.css`：模具窗口、便签、封印状态与窄阅读栏排版。
- `lib/system-prompt-sources.ts`：正文、书目与来源顺序的单一映射。
- `content/zh/term-research/ai-stack.json`：机制、误解、演示签名和 5 个来源 URL。
- `content/zh/term-experiences/ai-stack.json`：体验台账，5 帧与 Hero 同步。
- `content/zh/term-batches/ai-stack.json`：发布批次元数据，保留 schema 要求的 3 个 demo steps。
- `app/terms/[slug]/page.tsx`：`system-prompt` 路由改接独立页面。

## 验收记录

- 来源 URL：OpenAI Model Spec、OpenAI prompt engineering、Anthropic、Google 和 OWASP 均实际打开并读取；官方页面的角色、格式和边界论断逐一落到正文引用。
- 待实现后检查：JSON 解析、`git diff --check`、`npm run typecheck`、`npm run build`；本地浏览器检查首图 5 帧、规则移除、正常请求、窄阅读栏。
- 语言审读：不把“高优先级”写成跨产品固定排序，不把结构化输出写成事实验证，也不把提示词当作密钥库或权限系统。
