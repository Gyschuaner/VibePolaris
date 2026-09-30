export const toolCallingSources = [
  { publisher: "Anthropic · Claude Docs", title: "Tool use with Claude", date: "", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview", citations: ["tools-contract", "tools-execution"] },
  { publisher: "Anthropic · Claude Docs", title: "Define tools", date: "", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools", citations: ["tools-definition"] },
  { publisher: "Anthropic · Claude Docs", title: "Handle tool calls", date: "", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls", citations: ["tools-result", "tools-errors"] },
  { publisher: "Hugging Face · Agents Course", title: "Actions: Enabling the Agent to Engage with Its Environment", date: "", url: "https://huggingface.co/learn/agents-course/unit1/actions", citations: ["tools-handoff"] },
  { publisher: "Hugging Face · smolagents", title: "Secure code execution", date: "", url: "https://huggingface.co/docs/smolagents/tutorials/secure_code_execution", citations: ["tools-untrusted"] },
];

export const contextSources = [
  { publisher: "Anthropic · Claude Docs", title: "Context windows", date: "", url: "https://platform.claude.com/docs/en/build-with-claude/context-windows", citations: ["context-input", "context-budget"] },
  { publisher: "Prithvi Rajasekaran 等 · Anthropic", title: "Effective context engineering for AI agents", date: "2025-09-29", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", citations: ["context-selection", "context-retrieval", "context-summary"] },
  { publisher: "Justin Young · Anthropic", title: "Effective harnesses for long-running agents", date: "2025-11-26", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents", citations: ["context-handoff"] },
  { publisher: "The LangChain Team", title: "Context Engineering", date: "2025-07-02", url: "https://www.langchain.com/blog/context-engineering-for-agents", citations: ["context-strategies"] },
  { publisher: "IETF · RFC 9110", title: "HTTP Semantics · Status Codes", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes", citations: ["context-health", "context-check-result"] },
];

export const agentLoopSources = [
  { publisher: "Erik S.、Barry Zhang · Anthropic", title: "Building effective agents", date: "2024-12-19", url: "https://www.anthropic.com/engineering/building-effective-agents", citations: ["loop-feedback", "loop-stop", "loop-workflow"] },
  { publisher: "Shunyu Yao 等 · ICLR 2023", title: "ReAct: Synergizing Reasoning and Acting in Language Models", date: "2023-03-10", url: "https://arxiv.org/abs/2210.03629", citations: ["loop-observation", "loop-react"] },
  { publisher: "Hugging Face · Agents Course", title: "Observe: Integrating Feedback to Reflect and Adapt", date: "", url: "https://huggingface.co/learn/agents-course/unit1/observations", citations: ["loop-evidence"] },
  { publisher: "IETF · RFC 9110", title: "HTTP Semantics · Status Codes", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes", citations: ["loop-check-codes"] },
  { publisher: "Anthropic · Claude Docs", title: "Tool use with Claude", date: "", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview", citations: ["loop-round"] },
];
