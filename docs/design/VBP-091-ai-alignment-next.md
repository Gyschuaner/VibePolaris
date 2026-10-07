# VBP-091 AI 对齐与 Agent 工作模式词条批次 · 2026-10-08

本批逐条重写并复核十个 AI 对齐与 Agent 工作模式词条：`chain-of-thought`、`self-consistency`、`constitutional-ai`、`rlhf`、`direct-preference-optimization`、`red-teaming`、`jailbreak`、`model-spec`、`prompt-chaining`、`evaluator-optimizer`。目标是让零基础读者先看到机制如何改变，再读定义、边界、资料和可执行提示；演示按概念选择对象变化，流程图只保留给真正表达有序交接的少数概念。

## 设计与内容决定

- 每条词条都有独立的 `teaching` 段落（3 段），每段用 `sourceIndices` 连接到本页来源卡片；段落解释输入、关键中间状态、适用边界和验证方式，不用模板化三步说明。
- 十个特色 hero 不共享流程图骨架：思维链是可删减的退款账本；自洽性采样是多路径票数与共同误读；宪法式 AI 是原则卡—批评—改写；RLHF 是人类比较转成代理奖励；DPO 是 chosen/rejected 与参考策略的相对概率；红队测试是授权范围、证据和复测；越狱提示是压力类别与安全边界；模型规范是指令层和独立权限闸门；提示链是中间产物和 schema 闸门；评估器—优化器是评分 rubric、定向反馈和未解决证据。
- `demoSteps` 不再被固定为三步。现有数据契约允许 1–8 个步骤，十个新 hero 使用各自需要的 4 个控制节点；步骤只是交互入口，信息主体由场景对象变化表达。
- 只对确实表达顺序交接的内容使用 flow visual。`npm run audit:terms` 的全库结果为 50/352、14.2%，并且重复场景、相邻同类场景和近似重复对均为 0；这批十个特色 hero 不依赖 flow visual 占位图。

## 资料与引用核对

| 词条 | 主要依据 |
| --- | --- |
| 思维链 | Wei et al. Chain-of-Thought；Kojima et al. Zero-shot-CoT；OpenAI Reasoning models；Prompt engineering；NIST AI RMF |
| 自洽性采样 | Wang et al. Self-Consistency；Wei et al. Chain-of-Thought；OpenAI Reasoning models；NIST AI RMF |
| 宪法式 AI | Bai et al. Constitutional AI；Anthropic Constitutional Classifiers；NIST AI RMF；OpenAI Model Spec；OpenAI evals |
| RLHF | Hugging Face RLHF；InstructGPT；TRL PPO；Attention Is All You Need；NIST AI RMF |
| DPO | DPO 论文；TRL DPO Trainer；Hugging Face DPO；InstructGPT；NIST AI RMF |
| 红队测试 | OpenAI Red Teaming；NIST adversarial ML taxonomy；NIST AI RMF；OpenAI safety best practices；红队研究论文 |
| 越狱提示 | Jailbroken 论文；OpenAI Red Teaming；Anthropic Constitutional Classifiers；OWASP Prompt Injection；NIST adversarial ML taxonomy |
| 模型规范 | OpenAI Model Spec；Model Spec CDN/GitHub；OpenAI alignment evals；NIST AI RMF |
| 提示链 | Anthropic building effective agents；Anthropic agent patterns；OpenAI evals；OpenAI prompt engineering；NIST AI RMF |
| 评估器—优化器 | Anthropic building effective agents；Anthropic evaluator-optimizer pattern；OpenAI evals；OpenAI prompt engineering；NIST AI RMF |

本批体验数据与研究数据的来源顺序已同步；发布前脚本逐一以 `curl` 检查 50 个来源，结果 `ERRORS 0`。引用链接落在每个教学段落末尾和来源卡片，不把参考资料堆在段末之外。

## 验证记录

- `npm run typecheck`：通过。
- `npm run audit:terms`：通过；`experienceCount=352`、`sourceCoverage=352`、`flowVisualCount=50`、`flowVisualRatio=0.142`、`duplicateSceneCount=0`、`adjacentSceneKindCount=0`、`nearDuplicatePairCount=0`。
- `npm run build`：通过；静态页面 1091 个。构建只报告仓库既有的新闻 gapDays/实验性警告，没有构建错误。
- 浏览器：本地 `http://127.0.0.1:3420` 逐条打开十页；390×844 下十页 `scrollWidth=390`、`bodyWidth=390`，无横向溢出；每页有 1 个机制演示区域和 3 个教学卡片；键盘 Space 可推进演示，边界题可选并返回反馈；代表页 console error 为空；演示单步截图已在验收中查看。
- reduced-motion：`useScene` 在 `prefers-reduced-motion` 下停止自动播放并保留可手动跳转，hero CSS 在 reduce 媒体查询中关闭过渡和动画；浏览器当前环境媒体查询为 false，因此未声称在系统 reduce 设置下做了实机切换。

## 发布状态

当前文档记录的是 feature 分支验收结果。DP 需求 `VBP-091`、研发任务和部署对象将在最终 review PASS 后按真实状态更新；Git 合并、生产镜像、发布目录、健康检查和回滚指针只填写实际执行结果。
