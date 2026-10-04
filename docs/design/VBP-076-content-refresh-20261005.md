# VBP-076：AI Agent 核心词条一致性复核与补正记录

本批对应 DP 需求 `VBP-076`，范围是十条已经存在的 AI Agent 词条：`agent-harness`、`prompt`、`context`、`tools`、`memory`、`mcp`、`context-window`、`agent-loop`、`agent-memory`、`working-memory`。

用户要求按 Skill 逐条检查旧 AI Agent 词条，保持每页自己的机制、故事和动画，不把十页压成一个模板；每条完成后独立提交和 review，十条完成后再统一发布。本批只修正研究、体验和活动页面之间的来源台账与映射，不改页面组件、正文、路由或动效实现。没有使用 ZCode CLI；review 只使用唯一子智能体 `/root/ai_stack_review`。

## 逐条变更与 review

| 词条 | 最终提交 | 资料台账 | 页面机制核对 | review |
| --- | --- | --- | --- | --- |
| `agent-harness` | `416dad99` | 新增专属体验数据；experience/research 与 `lib/harness-references.ts` 的 15 个来源一致；schema 上限从 5 调到 15 以保留完整研究记录 | 模型建议、Harness 调度、工具执行、结果回传、反馈修复、停止/权限分支仍由原页面展示 | `/root/ai_stack_review` PASS |
| `prompt` | `9b25e2ca` | 5 个来源与 `promptSources` 一致 | 原有补齐目标、材料、输出格式、真实任务检查和提示注入边界保持不变 | PASS |
| `context` | `15db7dc1` | 5 个来源与活动 `contextSources` 一致 | 原有本轮输入、资料选择、压缩和跨会话交接演示保持不变 | PASS |
| `tools` | `90e8140f` | 5 个来源与活动 `toolCallingSources` 一致 | 工具定义、参数、执行、返回、失败和不可信结果分支保持不变 | PASS |
| `memory` | `1b94567a` | 5 个来源与活动 `memorySources` 一致 | 记录范围、取回、更新、删除和历史回答边界保持不变 | PASS |
| `mcp` | `dc505323` | 7 个 MCP 公共规范/官方来源与活动 `mcpSources` 一致 | 协商、发现、工具/资源/提示、传输和协议边界保持不变 | PASS |
| `context-window` | `ee0683cf`（修正前 `ddc53a0c`） | 按活动 AI Stack helper 补齐为 7 个来源，并与 experience/research 同序一致；移除不属于该活动路由的 RFC 来源 | 输入/输出共用容量、token、溢出、压缩、位置利用和旅行场景保持不变 | PASS |
| `agent-loop` | `7c1de355`（修正前 `24d6dc79`） | 按活动 helper 恢复 5 个来源；活动页面使用 OpenAI Agents SDK、ReAct、Anthropic、multi-agent、LangGraph 这组来源 | 读取状态→动作→回执→写回→停止/上限，以及 2/3 轮边界保持不变 | PASS |
| `agent-memory` | `a87e9f73` | 补齐 OpenAI Agents SDK 来源，5 个来源与 helper/research 一致 | 请求同意→写入→取回→带入本轮→纠正→删除，删除不倒写历史回答 | PASS |
| `working-memory` | `3a4b86b7`（中间修正 `a1e06193`） | 恢复 OpenAI Agents SDK 来源并清理误插入 `agent-memory` 的重复项；最终 5 个来源三层同序一致 | 5→3→库存未返停在 3→回执排除 E→交付后清理，未知不当作有货 | PASS |

每条最终状态都满足：活动页面实际 helper、`content/zh/term-experiences` 的 `sources`、`content/zh/term-research` 的 `sourceUrls` 逐项同序一致；来源数分别为 15、5、5、5、5、7、7、5、5、5，均无重复。所有来源均为已阅读且可访问的官方文档、规范、原始论文或作者资料；唯一 review 子智能体逐条检查了 Cite 映射、活动路由、失败/边界状态、有限播放、暂停/重播、visibility 和 `prefers-reduced-motion`。

## 代码与台账范围

最终功能分支为 `feat/VBP-076-ai-agent-ledger`，从 `origin/main` 创建。批次只触及：

- `content/zh/term-experiences/base.json`
- `content/zh/term-experiences/ai-stack.json`
- `content/zh/term-research/agent-harness.json`
- `content/zh/term-research/base.json`
- `content/zh/term-research/ai-stack.json`
- `lib/term-experiences.ts`（允许 Harness 保留 15 个来源）

没有把其他本地功能、图标或未授权改动带入本批。

## 验证

- 十条来源台账机器校验：experience / research / 活动 helper 逐项同序一致，无重复；JSON 解析通过。
- 唯一 review 子智能体逐条 PASS，最终复核覆盖十条词条。
- `npm run typecheck`：通过。
- `npm run build`：通过，生成 280 个静态页面。
- `git diff --check`：通过。
- feature 本地真实浏览器逐条打开十条路由：H1、正文引用节点、参考资料链接和 1280px 横向尺寸通过。
- dev 合并 checkout（端口 `3241`，原 `3238` 已被旧进程占用）逐条打开十条路由通过。
- 生产 `https://vibe.chuansgu.top` 十条路由、`/`、`/about`、`/sitemap.xml`、`/robots.txt` 均 HTTP 200；生产浏览器逐条检查 H1、Cite、参考资料和 1280px 横向尺寸。
- 生产 headless Chrome 通过 390×844 视口验收：十条路由的 `innerWidth=390`、`scrollWidth=clientWidth=390`，H1 和引用节点均存在。
- 生产容器近 5 分钟日志没有应用错误。

本批没有修改 UI 组件，因此演示状态与既有 AI Agent 页面实现保持一致；本批验收重点是来源台账和页面绑定不再漂移。

## Git、DP、发布与回滚

- dev PR [#338](https://github.com/Gyschuaner/VibePolaris/pull/338) 已合入，提交 `207f579f1b34b1aca5cd56102facc25ba7c3fd96`。
- DP dev deployment：`local-dev-20261005-vbp076-207f579f`，对象 `f2a981b6-4a7b-43a3-accc-0f7ade2c1aef`，地址 `http://127.0.0.1:3241`，状态 `released`。
- main PR [#339](https://github.com/Gyschuaner/VibePolaris/pull/339) 已合入，生产源提交 `f188562ad2237f61b656473fed974126e8b39459`。
- DP 生产 deployment：`deploy-vbp076-ai-agent-ledger-prod-20261005`，对象 `5a7b763f-83b3-4832-88a5-ca3dce3270d0`，状态 `released`。
- DP 需求 `VBP-076` 已置为 `released`；研发任务 `f932d0da-9cae-4f54-ab98-85b83f312888` 已置为 `done`。
- 生产镜像：`vibepolaris:f188562ad2237f61b656473fed974126e8b39459`（`linux/amd64`）。
- 生产 release：`/opt/vibepolaris/releases/20261004T171108Z-f188562a`；`/opt/vibepolaris/current` 已切换到该目录；`vibepolaris-web-1` 为 `running/healthy`。
- 回滚备份：`/opt/vibepolaris/backups/20261004T171108Z-from-c17654b4b47154f8942b8000b05aa6cff163e1ab`，上一版 release 为 `/opt/vibepolaris/releases/20261004T155510Z-c17654b4`，旧镜像为 `vibepolaris:c17654b4b47154f8942b8000b05aa6cff163e1ab`。

回滚时恢复备份中的 `deploy-docker-compose.yml` 与上一版镜像，重新启动同名 `vibepolaris-web-1`，再将 `/opt/vibepolaris/current` 指回上一版 release；保留 `vibepolaris_xiaobei_data` 数据卷，不覆盖上线后的用户数据。

`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此没有创建空记录。
