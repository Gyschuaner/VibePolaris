# VBP-073：AI Agent 核心词条逐条复核与十条发布

父需求：VBP-012「全站概念词条分批升级与补全」  
需求：VBP-073「第053批：AI Agent 核心概念复核升级」  
研发任务：逐条复核 AI Agent 核心词条并完成十条统一发布（DP 已完成）

本批按 vibepolaris-concept-pages、humanizer-zh 与 ponytail Skill 执行。旧的 AI Agent 词条只作为质量参照；每一条都重新确认读者追问、资料、正文锚点和专属机制。没有使用 ZCode CLI；协作范围内只保留唯一 review 子智能体 /root/ai_stack_review。

## 词条与专属机制

| # | slug | 本条要让读者看见的机制 |
|---:|---|---|
| 1 | agent-harness | 把上下文、工具、权限、停止条件和执行回执收进一个可核对的运行框架，读者能区分“模型提出了什么”和“程序实际做了什么”。 |
| 2 | prompt | 从一份模糊的网页改动要求开始，逐层补齐目标、材料、约束和验收，展示提示如何缩小任务歧义，而不是把提示词当咒语。 |
| 3 | context | 以服务 /health 返回 500 的排错任务贯穿输入、检索、摘要、交接和结果证据，区分聊天记录、外部记录与本轮真正发送的材料。 |
| 4 | tools | 用 read_file 展示工具契约、参数校验、真实执行、成功/错误/不可信返回和下一轮上下文，明确“生成工具名”不等于工具已运行。 |
| 5 | memory | 用服务修复交接记录展示保存、按任务取回、更新、删除和范围边界，区分短期任务状态、长期记录与模型参数。 |
| 6 | mcp | 用虚构图书馆借阅指南展示 Host、Client、Server 的能力发现、tools/call、资源与提示模板，以及协议不等于权限和可信度。 |
| 7 | context-window | 用周末出游安排展示输入、工具结果和输出预留如何争夺 16k 空间，整理后保留返程约束，并解释窗口容量与上下文选择的区别。 |
| 8 | agent-loop | 用发布前 /health → 200 OK 的任务单展示读状态、动作、回执、修正、失败、超时和 max_turns 停止；停止不被冒充成成功。 |
| 9 | agent-memory | 用“以后代码示例优先用 TypeScript”展示征得同意、写入、按范围取回、送进本轮、纠正和删除；已生成的旧答案不会被擦除。 |
| 10 | working-memory | 用五副耳机的预算和库存任务板展示候选过滤、工具未回时的未知状态、回执写回、A/C 交付以及临时清单清理。 |

每条页面的演示均先保证状态和边界正确，再加入有限的播放、暂停/继续、逐步推进、重播和 reduced-motion 支持；关键结果同时以正文和可读状态呈现，动画不是唯一解释。

## 逐条提交与审查

本批没有把十条编辑压成一个提交。当前树保留逐条实现和后续校正记录；核心四条的主要独立提交如下：

| slug | 主要提交 |
|---|---|
| context-window | 9463cc0c, 35b8051c, 6148b65b |
| agent-loop | 300acb5e, 6e524edb, 9ee7545b |
| agent-memory | fe468231, c37fa232, 28ebfda4, 4f980c40 |
| working-memory | 9f802485, cfc6570e, 764a8dd1, 5cd74f1a |

agent-harness、prompt、context、tools、memory、mcp 保留此前已通过的独立页面与提交历史，本批逐条复核其正文、演示、研究台账和引用映射，没有用统一模板替换。

唯一 review 子智能体 /root/ai_stack_review 对最终树逐条给出 PASS。最后一轮还专门复核了 working-memory：库存未返回时只保留 A/C/E 的“待查”状态，不能交付或清理；回执返回后才交付 A/C 并清掉临时状态；lesson 演示的按钮在前置条件不满足时保持禁用且 ARIA 状态诚实。

## 资料与引用

十条均有独立 source ledger 和页面引用锚点。当前四条页面使用的公开原始资料包括：

- OpenAI Agents SDK：运行器、session 与多智能体编排
- LangChain：memory 与线程状态
- Anthropic：context engineering、长任务压缩与选择
- ReAct：行动与观察交替
- MemGPT：分层记忆与外部存储
- Transformer / Lost in the Middle 等论文与模型文档：窗口容量、注意力利用和位置影响

每个正文段落的 Cite ID 都能在页面资料区找到来源；检查了 source URL 的可访问性、page-to-source 映射、无 orphan/duplicate 引用。演示中的教学数字（例如 16k）标明是说明先后关系的模型，不冒充所有线上模型的固定上限。

## 验证

- npm run typecheck：通过。
- npm run build：通过，生成 265 个静态页面。
- git diff --check：通过。
- 本地真实浏览器桌面与 390px：十条路由均有 H1/main，scrollWidth 等于 viewport，无横向溢出；逐条检查专属演示正常/边界分支和 reduced-motion。
- 生产 HTTPS：agent-harness、prompt、context、tools、memory、mcp、context-window、agent-loop、agent-memory、working-memory 均返回 HTTP 200 且有 H1。
- 生产真实浏览器：working-memory 首图推进到“预算先筛”后，库存未回分支保持待查；切换库存回执后推进到“交付并清理”，页面显示 A/C 交付和临时清单清理。
- 没有新增 DP 空测试计划；本批验收证据来自构建、路由、真实浏览器和 review 记录。

## Git、DP 与生产发布

- 功能分支：feat/VBP-073-ai-core。
- dev PR #329（https://github.com/Gyschuaner/VibePolaris/pull/329）已合入 dev，合并提交 b10338a45b2c54907aeec6ab00292632c0b64e68。
- DP dev 部署：local-dev-20261004-vbp073-b10338a4，对象 8615e7a3-0e29-464d-897a-75e70b4a4faa，来源为 dev 合并提交。
- main PR #330（https://github.com/Gyschuaner/VibePolaris/pull/330）已合入 main，合并提交 ddad1da30f4e7c2ef28870dc3369fa2043f8d572。
- 生产 DP 部署：prod-20261004-vbp073-ddad1da3，对象 dfdffbe7-551a-47b3-b9f7-85701003519c，状态 released，地址 https://vibe.chuansgu.top。
- 当前生产 release：/opt/vibepolaris/releases/20261004T082603Z-ddad1da3；/opt/vibepolaris/current 已指向该目录；vibepolaris-web-1 使用 vibepolaris:ddad1da30f4e7c2ef28870dc3369fa2043f8d572 且为 healthy。
- 回滚备份：/opt/vibepolaris/backups/20261004T082603Z-from-0ea36fb2；旧 release /opt/vibepolaris/releases/20261004T052352Z-0ea36fb2、旧镜像 vibepolaris:0ea36fb272daa1313f17b16b4e01081384849159 和 vibepolaris_xiaobei_data 数据卷保留。回滚时恢复备份的 Compose 与旧镜像，并将 current 指回旧 release，不覆盖持久数据。

## 范围与后续

本批十条已统一进入 dev、main 和生产；本地未参与本批的用户工作区修改没有被带入发布。规则指定的 Obsidian 库 D:/Obsidian/gysnote 在当前 Mac 环境不存在，因此未同步。总 goal 继续保持 active，下一批仍按“一条一条修改和 review，十条统一发布”的节奏推进。
