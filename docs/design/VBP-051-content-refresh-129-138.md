# 129–138 词条文案更新与上线记录 · VBP-051

本批按用户要求逐条修改，累计十条后统一发布。每个词条单独修改、审读和提交；最后才把十个 slug 一次加入 `content/zh/published-terms.json`。范围是已有数据驱动词条的中文正文、边界、演示状态、测验提示和来源映射，没有新增独立交互组件。

## 词条与逐条提交

| 编号 | slug | DP 任务 | 逐条提交 |
| --- | --- | --- | --- |
| 129 | plan-and-execute | `6866ace2-091c-4763-b900-43794d5c1c3e` | `ab29101` |
| 130 | agent-orchestration | `8189bf1a-9737-4cd8-84c1-496c1702d0b3` | `02d607b` |
| 131 | handoff | `2261962f-5809-4133-832e-2a03fd9d65f3` | `533f3b5` |
| 132 | subagent | `b7adc365-8336-47fe-93fe-b5819e1d9944` | `9e89605` |
| 133 | human-in-the-loop | `0b24d5a4-6642-4dff-9a15-eeb9cf8ad306` | `a873887` |
| 134 | guardrail | `c36cc00f-af4a-47b1-a58f-2c0f44da1403` | `4da9804` |
| 135 | moderation | `76ad7fa9-f832-432b-bd3a-d7b1d2cafee9` | `15b78b0` |
| 136 | fine-tuning | `4fe5b5ec-9059-414f-9e87-70cd60b1afd9` | `36a1e61` |
| 137 | agent-memory | `5e03fc22-aa7e-4904-a4d1-b92bb5f9a287` | `000d777` |
| 138 | working-memory | `ec1b4bd7-f1d6-4e1f-8a7e-b3c62cec3fc9` | `3d82594`, `d24b879` |

`4e5b28e` 是十条一起加入公开清单的批次提交。`d24b879` 只把工作记忆的旧版批次演示从四步压回项目 `termSchema` 要求的三步；体验演示保留四步，继续展示预算筛选、库存筛选和清理状态。

## 内容与资料

本批的教学主线按相邻机制拆开：规划与执行关注失败结果怎样改写后续计划；编排和子智能体分别解释中心控制与受限委派；交接关注上下文和回复权的转移；人在回路、护栏和内容审核分别解释审批、规则检查和内容分类；微调用独立验证集对照训练表现；智能体记忆展示跨会话偏好的取回、纠正和删除；工作记忆展示当前任务状态、工具结果和清理时机。

十条体验数据均保留独立场景，来源数组为 4 份已实际阅读的公开来源。主要资料覆盖 OpenAI Agents SDK 的 handoffs、tools、guardrails、human-in-the-loop、moderation、model optimization 和 supervised fine-tuning 文档；Anthropic 的 Building effective agents 与 context engineering；LangGraph memory；NIST AI 600-1 与 AI RMF Playbook；AutoGen、ReAct、Generative Agents、MemGPT、LoRA、Hugging Face Transformers training 等原始论文或项目文档。逐条 URL、标签与正文映射保存在 `content/zh/term-experiences/ai-stack.json` 和 `content/zh/term-research/ai-stack.json`。

## ZCode CLI 协作证据

使用真实 ZCode CLI 入口 `/tmp/zcode-cli/zcode.cjs`，临时数据目录为 `/tmp/zcode-data`，模型配置为 `Qwen3.8-Flash-Next-FP8`。reader 和 language 会话均按当前仓库的 `vibepolaris-zcode-partner` 与 `humanizer-zh` 绝对路径派发，只读当前词条材料，不让 ZCode 修改仓库。

| slug | reader / language / final |
| --- | --- |
| plan-and-execute | `sess_5ef2d559-7d4e-4e1a-a358-d24ebe700ac8` / `sess_21fc09a6-e99d-4e2a-bfe3-8b453a0c1677` / `sess_4a93f401-697a-42ea-9efc-cf67e5447a63` |
| agent-orchestration | `sess_26a39d66-b10b-4fd5-b9e0-2448ca596300` / `sess_35fd5dc8-bbd2-4be8-99a0-145b1f6ee4a8` / `sess_31ded6df-e309-4572-8404-92ff528257ba` |
| handoff | `sess_783fc183-0b7d-4d59-a0f9-1a83b415cb53` / `sess_c4b68183-21a9-44e1-8d5d-b1fdbe9b3c93` / `sess_7d1c5c99-6711-4de9-abc4-ec03b3074f42` |
| subagent | `sess_bde4c454-8a06-465b-994c-62a716703706` / `sess_1bf4242e-2395-4bc6-8f9a-e6e48bb26268` / `sess_fd9200ec-93ef-4f91-ab14-9f62e886060c` |
| human-in-the-loop | `sess_e3d3235a-9b38-4278-bfa8-77e44fab46b6` / 主助手按 humanizer-zh 本地复核 / `sess_6d6620f3-31ae-42ed-a9a3-bde1b4f00c0d` |
| guardrail | `sess_ca3f676e-3782-4bf7-a53e-c71adb55e74e` / `sess_bd091e92-53db-48d6-bfc0-442adb2c0e1e` / `sess_2dfd2a5f-4a2a-4a3b-8bbb-133504054a0b` |
| moderation | `sess_82f6a0a0-ea96-4b21-b242-baaf00ad2d3a` / `sess_3a46cd23-73d4-4b3b-9a5a-6f4d7bae092b` / `sess_857b3ff8-e8f5-4dbb-b3ec-8609368871ee` |
| fine-tuning | `sess_d716e808-d5b6-4518-ac7c-500ef3b34d80` / `sess_9d6d75e3-812e-408d-9ec7-46683bda15bd` / `sess_06316b2b-1fa4-4e45-b516-085ea9a07cac` |
| agent-memory | `sess_78c1c16d-9711-46ab-a130-522a04b85b19` / `sess_159fd527-e5bb-4b61-a020-88ab09024ed7` / `sess_0471a7b0-2711-46f7-a8b4-77ee738b3c08` |
| working-memory | `sess_c612055e-fe15-415a-8d06-1892735549a0` / `sess_3fd85d01-d96e-41d9-ab65-7f081852591a` / `sess_b21bb864-650c-4715-9e71-d919e8a01ebf` |

reader 和 language 的输入是当前词条的读者可见文案与按阶段配对的状态材料，不是源码、研究资料或作者预期。人机协作的模拟反馈只作为编辑线索；最终取舍由主助手按已核对来源、schema 和页面状态完成。

## 本地验证

- `npm run build`：最终通过；TypeScript 通过，静态页 `137/137` 生成。第一次构建发现工作记忆批次演示多于 `termSchema` 要求的三步，已用 `d24b879` 修复并重新构建通过。
- 十条路由通过 HTTP 200：`plan-and-execute`、`agent-orchestration`、`handoff`、`subagent`、`human-in-the-loop`、`guardrail`、`moderation`、`fine-tuning`、`agent-memory`、`working-memory`。
- CUA 真实浏览器抽查：规划与执行点击“模拟一项测试失败”后显示测试未全过、部署阻塞并出现修复入口；智能体记忆切到第 6 帧显示 `2 → 1`、既有 TypeScript 输出保持原样；工作记忆切到第 4 帧显示候选和调用次数清空、2 个结果已交付；微调切到第 4 帧显示验证准确率回落到 `80%` 和过拟合信号。
- 使用 390px 视口抽查工作记忆页面，标题、问题、正文、演示和窄屏导航均可见，没有发现横向溢出；验收后已恢复默认视口。
- `/news` 不在本地 `main` 内容分支，返回 404；生产发布会基于现有 `release/VBP-050-prod-overlay-20261001` 保留 `/news`，在发布后再做线上健康检查。
- 未执行真实目标读者测试；ZCode reader 是模拟审读，不能替代用户验收。

## 发布边界

本批已经完成本地内容、公开清单、构建和受影响页面验收；生产合并和部署需在生产叠加分支上保留现有 `/news` 后执行。生产提交、DP deployment、线上十条路由和 `/news` 健康检查、版本镜像与回滚位置在发布完成后补录。

- PR #270 已合并到 `main`，合并提交为 `978f1604ac39b668898da75003b3e0f3fd535776`。
- 生产使用 `release/VBP-051-prod-overlay-20261002` 叠加 `release/VBP-050-prod-overlay-20261001` 的新闻版本 `0662c3429667371a90f23d5348d064bc27a1c064`，部署提交为 `1bd2aa2968839a2afd44eb0bbefb0d3784116e88`；该分支保留 `/news`，只叠加本批内容、公开清单和研发记录。
- DP deployment：`deploy-vbp051-content-129-138-prod-20261002`，ID `d04163c3-b818-4de4-820e-267a439cc6e1`，状态 `released`，目标为 `prod`，关联需求 VBP-051。
- 当前生产发布为 `/opt/vibepolaris/releases/20261001T190755Z-1bd2aa29`，镜像为 `vibepolaris:1bd2aa2968839a2afd44eb0bbefb0d3784116e88`；容器健康检查通过，数据卷 `vibepolaris_xiaobei_data` 未改动。
- 生产复核：十条 `/terms/<slug>`、`/news` 和一篇新闻详情均返回 HTTP 200；CUA 抽查 `/news` 和 `working-memory` 的“交付后清理”状态，页面内容与交互可见。
- 回滚目标为 `/opt/vibepolaris/releases/20261001T155220Z-0662c342`，切换前版本和镜像健康；`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此未同步 Obsidian。
