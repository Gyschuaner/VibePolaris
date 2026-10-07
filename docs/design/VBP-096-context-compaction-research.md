# VBP-096 上下文压缩资料笔记

| 正文论断 | 已读资料 | 限定与用法 | 段落锚点 |
| --- | --- | --- | --- |
| 上下文窗口会计入系统提示、消息、工具结果、文件和输出；接近上限时可以用 compaction 继续长会话 | [Anthropic · Context windows](https://docs.anthropic.com/en/docs/build-with-claude/context-windows) | Claude API 的上下文管理说明；本文用来解释窗口边界和 server-side compaction，不把它当作所有模型的默认实现 | `context-window`, `context-overflow`, `context-compaction`, `context-recovery` |
| 长历史会分散注意力，短期记忆需要在 thread state 中管理并可由 checkpointer 恢复 | [LangChain · Short-term memory](https://docs.langchain.com/oss/python/langchain/short-term-memory) | LangChain/LangGraph 的实现方式；本文抽取短期与长期记忆的边界 | `context-window`, `context-overflow`, `context-state`, `context-boundary` |
| context engineering 追求有限 attention budget 下最小的高信号信息集合 | [Anthropic · Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Anthropic 工程文章的设计原则；目标/证据/动作是本文的教学清单，不声称是唯一字段集合 | `context-selection`, `context-compaction` |
| ChatHistory 按角色保存消息，工具调用和结果需要匹配的 id，历史可被检查 | [Microsoft Semantic Kernel · Chat history](https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/chat-history) | Semantic Kernel 的对象和工具消息规则；用来说明工具回执不能和闲聊一样随意丢弃 | `context-tools`, `context-state`, `context-recovery` |

## 写作和验收记录

- 读者场景：长任务接近窗口上限，历史里混有订单证据、工具回执和大量闲聊；下一步仍要继续发起退款。
- 首图用工作台、折叠摘要胶囊和三张固定卡片表现“堆满→标记→折叠→可继续”，不复用横向流程节点。
- 交互实验要求用户勾选目标、关键证据和未完成动作；缺一项就警告，齐全才生成本地“可继续摘要”。
- `8k/24k`、`26k/24k`、`11k/24k` 是教学数值，不是模型性能或实际 token 计量；页面明确摘要有损、原文要可回查。
