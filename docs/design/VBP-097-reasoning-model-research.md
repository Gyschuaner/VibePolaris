# VBP-097 推理模型词条研究与实现记录

## 读者任务

读者遇到一个有多个条件的退款判断，想知道“模型为什么会多花时间”。读完后应能区分三件事：额外计算给了模型更多拆条件、比较路径的机会；推理预算到边界时结果可能尚未完成；模型内部的计算不是外部事实或正确性证明。

主线场景是一件下单 12 天、发货状态待确认、包装状况未知的商品。演示不画私有思维链，而把可复算的公开记录做成条件账本：问题先落下，条件逐项展开，预算消耗，三项都完成才让天平平衡；预算耗尽时保留“未完成 · 不能盖章”。

## 已核对资料

| 来源 | 实际支持的论断 | 页面位置 |
| --- | --- | --- |
| OpenAI, Reasoning models | reasoning tokens 占用上下文和输出预算；effort 会影响推理用量、延迟与完成质量，预算可能在可见答案前耗尽 | `reasoning-effort`, `reasoning-budget` |
| OpenAI, Reasoning best practices | 应使用清楚的约束组织请求，不要求模型暴露私有思维链 | `reasoning-boundary` |
| Wei et al., Chain-of-Thought | 中间推理步骤能改善部分算术、常识和符号任务，但研究对象是任务表现，不是外部事实来源 | `reasoning-chain` |
| Yao et al., Tree of Thoughts | 候选思路可以被保留、评估、回看或换路，额外计算也可能意味着搜索 | `reasoning-tree` |
| DeepSeek-AI et al., DeepSeek-R1 | 强化学习路线可形成自我反思、验证和动态调整等推理模式，这是特定模型家族的训练结果 | `reasoning-training` |
| NIST, Generative AI Profile | 生成结果仍需用已知事实、人工监督或自动评估检查准确性、可靠性和安全风险 | `reasoning-boundary` |

## 演示契约

- 初态：问题和订单摘要在场，结论卡显示“可以退款”，但天平明显未平衡。
- 操作：推进到条件摊开、逐项配对、结论带条件和预算耗尽；五帧使用同一个退款问题与同一组条件。
- 可见证据：条件账本的 0/3、2/3、3/3，天平状态和预算停止状态。
- 停止：预算耗尽只显示“未完成 · 不能盖章”，不自动补全包装条件。
- 独立差异：首图使用“天平 + 条件账本”表现结论重量，不使用节点连线或库存数字流程；正文实验可以切换退款/发货判断和预算紧张/充足，且只在本地模拟。

## 实现映射

- `components/terms/ReasoningModelConceptPage.tsx`：独立 Hero 与条件账本实验，不调用模型或网络。
- `components/terms/ReasoningModelConceptPage.module.css`：紧凑天平、账本状态、停止状态与窄阅读栏排版。
- `lib/reasoning-model-sources.ts`：正文、书目与来源顺序的单一映射。
- `content/zh/term-research/ai-stack.json`：机制、误解、演示签名和 6 个来源 URL。
- `content/zh/term-experiences/ai-stack.json`：体验台账，5 帧与 Hero 同步。
- `content/zh/term-batches/ai-stack.json`：发布批次元数据，保留 schema 要求的 3 个 demo steps。
- `app/terms/[slug]/page.tsx`：`reasoning-model` 路由改接独立页面。

## 验收记录

- 来源 URL：OpenAI 两篇指南、CoT、ToT、DeepSeek-R1、NIST 均实际打开并读取；论文摘要和官方文档只用于对应论断。
- 待实现后检查：JSON 解析、`git diff --check`、`npm run typecheck`、`npm run build`；本地浏览器检查首图、预算停止帧、实验切换和窄阅读栏。
- 语言审读：把“更会想”改写为额外检查机会，避免把隐藏思维过程写成可审计事实；所有演示数字均为本地叙事状态，不是模型测量。
