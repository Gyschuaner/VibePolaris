# VBP-097 零样本提示词条研究与实现记录

## 读者任务

读者听到“零样本”时，容易把它理解成空提示，或以为模型会在没有信息时自动补全规则。读完后应能说清：零样本只表示当前请求没有输入—输出示例；任务目标、允许范围、拒答条件和输出格式仍要写明；输入证据不足时，停下来补信息比猜一个标签更可靠。

主线场景是一只没有校样的指南针。示例盒始终标为 0，任务牌逐步亮起，允许标签和拒答条件装入罗盘；具体的支付故障让指针落到“前端”，模糊的“突然不工作了”让它停在“补充信息”。

## 已核对资料

| 来源 | 实际支持的论断 | 页面位置 |
| --- | --- | --- |
| Brown et al., *Language Models are Few-Shot Learners* | zero-shot 不提供 demonstration，只给自然语言任务描述；它省去示例但更难，仍属于测试时推断而非参数更新 | `zeroshot-definition-evidence`, `zeroshot-limit-evidence` |
| OpenAI, Reasoning best practices | 直接、清楚的提示更适合推理模型；可先试 zero-shot，再按复杂要求增加 few-shot；目标和约束要明确 | `zeroshot-instruction-evidence`, `zeroshot-limit-evidence` |
| Google, Prompt design strategies | zero-shot 与 few-shot 的区别在示例有无；约束和响应格式要写明，提示设计需要迭代 | `zeroshot-instruction-evidence`, `zeroshot-constraint-evidence` |
| Kojima et al., *Large Language Models are Zero-Shot Reasoners* | 简短的推理提示会影响部分复杂任务表现，但属于提示条件，不能当作通用保证 | `zeroshot-reasoning` |
| Wei et al., *Finetuned Language Models Are Zero-Shot Learners* | instruction tuning 会影响模型执行自然语言任务的零样本能力，能力结论依赖模型训练与任务 | `zeroshot-limit-evidence` |

## 演示契约

- 初态：示例盒为空，任务牌和罗盘不亮，输出停在“没有任务说明”。
- 操作：依次亮起任务牌、约束转盘、具体输入；示例数量从头到尾都是 0。
- 可见证据：示例数量、允许标签、拒答条件、当前输入、罗盘指针和输出状态。
- 成功分支：具体输入“支付按钮无响应”让指针落到“前端”，输出保持单标签格式。
- 停止分支：模糊输入“突然不工作了”让指针停下并要求补充信息，不用空白替模型盖章。
- 独立差异：首图使用罗盘和空样本盒表达“无示例但有任务定义”，不使用流程节点或少样本校样台。

## 实现映射

- `components/terms/ZeroShotPromptingConceptPage.tsx`：罗盘 Hero、清晰/模糊输入本地实验和三节正文。
- `components/terms/ZeroShotPromptingConceptPage.module.css`：空样本盒、指针、任务牌、停下状态与响应式/reduced-motion 样式。
- `lib/zero-shot-prompting-sources.ts`：正文、书目和来源顺序的单一映射。
- `content/zh/term-research/ai-stack.json`：机制、误解、罗盘演示签名和五个来源 URL。
- `content/zh/term-experiences/ai-stack.json`：体验台账，五帧、五个对象、四条关系与无示例边界。
- `content/zh/term-batches/ai-stack.json`：发布批次元数据，保留三步 demo steps 并同步任务牌主线。
- `app/terms/[slug]/page.tsx`：`zero-shot-prompting` 路由改接独立页面。

## 验收记录

- 已实际打开并阅读 Brown 论文、OpenAI reasoning best practices、Google prompt design strategies、Kojima 论文和 FLAN 论文；五个来源 URL 在复审时均返回 200。
- 已通过 JSON 解析、`git diff --check`、`npm run typecheck`、`npm run audit:terms`；本地浏览器检查初态、清晰输入落位、模糊输入停下和 Lab 的 `NO MODEL CALL` 状态。
- 语言审读：不把零样本写成空提示，不把约束写成事实来源，不把一次答对写成通用能力；正文明确提示、输入证据和独立评估的分工。
