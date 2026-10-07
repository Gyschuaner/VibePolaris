# VBP-097 上下文窗口词条研究与实现记录

## 研究结论

| 来源 | 读取要点 | 页面落点 |
| --- | --- | --- |
| [OpenAI Conversation state](https://developers.openai.com/api/docs/guides/conversation-state) | 单次 context window 的上限同时约束输入、输出和部分推理 token；超出可能截断输出；可用 tokenizer 估算 | “窗口到底装的是什么”、超限边界 |
| [OpenAI Agents SDK · Running agents](https://openai.github.io/openai-agents-python/running_agents/) | 历史可由应用、session 或服务端 conversation 管理；混用策略可能重复上下文 | “超出之后怎样整理”、避免复制历史 |
| [Anthropic · Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | 上下文应保持 informative yet tight；按需检索、渐进披露和 compaction 支撑长任务 | 摘要折页与按需取回 |
| [Anthropic · Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) | 系统提示、历史、工具结果、媒体、输出和 thinking 都计入窗口；更多 token 不自动更好，可能出现 context rot | 卡片进入旅行箱、窗口边界 |
| [Google · Understand and count tokens](https://ai.google.dev/gemini-api/docs/tokens) | 输入和输出都按 token 计量，支持发送前 count_tokens；模型分别声明输入/输出上限，二者合成上下文窗口 | token 计数说明 |
| [Vaswani 等 · Attention Is All You Need](https://arxiv.org/abs/1706.03762) | self-attention 让序列位置互相交换信息，但不意味着每个位置获得同样关注 | “装进去就一定找得到吗” |
| [Liu 等 · Lost in the Middle](https://arxiv.org/abs/2307.03172) | 相关信息位于输入中间时，多个模型的取回表现常低于开头或结尾；长上下文仍需位置与检索策略 | 重点回到可见处、位置实验 |

## 演示决策

- 首图区别于流程图：用一只“16k 旅行箱”承载卡片，卡片变多、箱盖被顶开、旧闲聊折成摘要；容量条只表达一次请求的 token 预算。
- 五帧保持同一批内容：返程约束、民宿地址、旧天气闲聊、工具结果、摘要折页。第 3 帧只制造超出，第 4 帧整理，第 5 帧提醒位置影响，不虚构模型的隐藏注意力。
- 所有数字是教学示意，页面和台账采用同一组 2/16k、13/16k、17/16k、14/16k；首图和实验都标注本地演示、不调用模型。
- 实验允许塞入工具结果、折成摘要、重置，并单独切换重要信息放在开头/中间/结尾，解释“装得下”和“找得到”的区别。

## 交互与验收

- 默认停在“先锁住返程”，不自动滚动；SceneControls 支持播放、暂停、逐帧、重播。
- `ContextWindowLab` 只在本地改变卡片和状态；溢出状态给出 `17 / 16k` 与“先别继续塞”，压缩后给出“重新计算”。
- 使用语义按钮、`aria-pressed`、`aria-live` 和 `role=region`；窄屏改为单列；`prefers-reduced-motion` 移除位移和过渡。
- 正文说明上下文窗口不是长期记忆、不是事实证据，也不保证模型均匀使用每个位置；摘要后需要重新核对关键约束。
