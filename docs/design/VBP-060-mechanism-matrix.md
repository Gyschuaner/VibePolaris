# VBP-060 机制差异表 · 219–228

本表先于实现建立，避免十页只换词名。每页共用阅读壳、引用组件和播放控制，但首图、主体对象、操作和失败证据不同。来源 URL 已实际打开正文；网页厂商接口只在对应实现边界内引用，教学数字均标为固定示意。

| slug | 读者要判断的问题 | 初始对象 → 操作 → 可见证据 | 停止/失败分支 | 资料组 |
| --- | --- | --- | --- | --- |
| `tool-choice` | 选中工具是否等于已经调用？ | 请求与三个候选工具 → 切换 `auto`/`required`/`none` → 候选保留/禁用，写工具停在审批闸门 | `none` 不调用；参数或权限不合规时停在校验 | OpenAI function calling；MCP Tools；Anthropic tool use；OpenAI Agents tools；OpenAI Agents HITL |
| `tool-result` | 为什么 `status=200` 仍可能不能说“成功”？ | `call_id` 与原始 JSON → 修改 `stock`/错误字段 → 业务状态和下一句同步变化 | 空结果、业务失败、关联 ID 不匹配都不生成成功回答 | OpenAI function calling；MCP Tools；Anthropic tool use；OpenAI Agents tools；OpenAI Agents running |
| `plan-and-execute` | 一步失败时，为什么后续步骤不应照跑？ | 构建→测试→部署依赖图 → 让一项测试失败 → 部署锁定、修复步骤插入 | 失败节点阻塞后继；重排后仍需重新验收 | OpenAI Agents orchestration；OpenAI Agents running；ReAct；Anthropic effective agents；LangChain planning |
| `agent-orchestration` | 并行任务谁等谁、谁合并？ | 检索/核对/撰写三条任务线 → 切串行/并行或制造冲突 → 依赖图显示等待与合并 | 冲突证据阻塞撰写；超时结果不伪装成完成 | OpenAI Agents orchestration；running agents；Anthropic effective agents；AutoGen；OpenAI Agents handoffs |
| `handoff` | 换智能体后如何从正确步骤继续？ | 客服持有回复权与订单事实 → 检查并交接最小信息包 → 回复权和接手步骤移到退款智能体 | 缺订单号或接手者拒绝时退回客服，不能声称已退款 | OpenAI Agents handoffs；multi-agent；Anthropic effective agents；AutoGen；OpenAI Agents running |
| `subagent` | 为什么只分出可验收的小任务？ | 主报告与价格核对支线 → 重跑价格支线 → 结果带状态回主线并由主智能体合并 | 子任务失败/缺价格保留缺口，主线不能把它写成已核实 | OpenAI Agents multi-agent；Agents tools；Anthropic effective agents；AutoGen；Agents running |
| `human-in-the-loop` | 人在哪里真正改变了结果？ | 退款请求与上限 → 人查看预览后批准/修改/拒绝 → 执行或保持未执行并留痕 | 拒绝、超时、参数变更都不执行旧决定 | OpenAI Agents HITL；Agents guardrails；NIST AI RMF Playbook；NIST AI RMF；OpenAI Agents tools |
| `guardrail` | 命中规则后系统具体做什么？ | 含手机号的导出数据 → 输出检查 → 识别、脱敏、放行/拦截 | 检查器不可用或命中禁止规则时转人工/阻断，不等于有权限 | OpenAI Agents guardrails；HITL；NIST AI 600-1；NIST AI RMF Playbook；OpenAI safety best practices |
| `moderation` | 风险分数怎样进入产品处置？ | 三条评论与风险分 → 拖动产品阈值 → 展示/复核/隐藏队列变化 | 分数缺失或低置信进入人工；分数不是法律结论 | OpenAI moderation；Agents guardrails；NIST AI 600-1；NIST AI RMF Playbook；OpenAI safety best practices |
| `fine-tuning` | 训练变好是否代表新数据也变好？ | 训练集与独立验证集 → 改训练轮数 → 损失下降、验证准确率先升后降 | 验证回落表示过拟合，停止继续训练并回到数据/配置检查 | OpenAI model optimization；OpenAI supervised fine-tuning；Hugging Face training；Hugging Face PEFT；LoRA |
