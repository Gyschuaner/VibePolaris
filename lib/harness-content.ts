export const harnessPrompt = "请为这个任务设计 Harness：明确上下文来源、可用工具与权限、停止条件，并保留执行记录和验收结果。";

export const harnessSteps = [
  { title: "装入上下文", summary: "先装入任务目标、文件位置与验收标准，让模型知道要做什么、怎样才算完成。", evidence: "目标：归纳 3 类反馈；每类保留原文编号", note: "上下文包含任务规则与资料线索；文件正文还需要通过工具读取。" },
  { title: "开放工具", summary: "读取反馈文件，把实际内容交回模型。工具权限限定为只读，不能修改原始反馈。", evidence: "read_file /data/feedback.md → 返回 6 条反馈", note: "工具让模型获取外部信息；工具能做什么，由运行环境和权限共同决定。" },
  { title: "控制循环", summary: "模型归纳后，检查发现少了一个来源编号。将缺项反馈给模型，补齐后再检查。", evidence: "第 1 轮：缺少 #06 共同编辑 → 第 2 轮：补齐内容与引用", note: "最多 3 轮；达到验收标准就停止，超过预算或遇到无权操作则交回人处理。" },
  { title: "验收证据", summary: "检查 3 类要点、6 条反馈覆盖情况与原文编号，保留总结和执行轨迹。", evidence: "summary.md：3 类要点 · 6/6 覆盖 · 来源齐全", note: "示例检查通过，完成并可核对。真实项目仍需按任务标准判断内容是否正确。" },
] as const;

export const harnessSources = [
  { label: "Anthropic · 长任务的 Harness 设计", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
  { label: "Anthropic · 模型、Harness 与执行环境", url: "https://www.anthropic.com/engineering/managed-agents" },
];

export const harnessMarkdown = [
  "# Agent Harness", "## 智能体运行框架",
  "围绕模型组织上下文、工具权限、执行循环与验收的运行框架，让任务能持续执行，并留下可检查的结果。",
  "## 可以这样向 AI 表达", harnessPrompt,
  "## 同一个模型，接入 Harness 后改变什么？",
  "本地教学示例：同一模型、同一任务——汇总产品反馈。只给模型且不提供反馈正文或读取工具时，只能获得建议；接入 Harness 后可以读取资料、循环处理并留下验收证据。直接提供完整资料时，模型也能完成文本归纳。",
  ...harnessSteps.map((step, i) => `### ${i + 1}. ${step.title}\n${step.summary}\n\n${step.evidence}\n\n${step.note}`),
  "## 什么时候需要它", "任务涉及多次工具调用、长时间执行或失败重试，需要记录过程，并按明确标准检查交付。",
  "## 它的边界", "Harness 不等于模型本身，也不只是测试脚本。它约束工具权限、停止条件与验收规则，但不能保证模型每次判断都正确。",
  "## 继续理解", "- [上下文](/terms/context)\n- [工具调用](/terms/tools)\n- [智能体循环](/terms/agent-loop)",
  "## 参考来源", ...harnessSources.map(source => `- [${source.label}](${source.url})`),
].join("\n\n");
