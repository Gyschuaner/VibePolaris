# VBP-069：提示注入与旧 AI 词条研究台账补齐

父需求：VBP-012「全站概念词条分批升级与补全」  
需求：VBP-069「第049批：提示注入与旧 AI 词条研究台账补齐」  
范围：按 `vibepolaris-concept-pages` Skill 逐条复核十条 AI/Agent 词条；每条独立完成资料研究、读者追问、段落级引用、概念专属演示与失败/边界分支，十条完成后统一合入和生产发布。没有调用 ZCode CLI；只使用唯一 review 子智能体 `/root/ai_stack_review`。

## 词条范围

| # | slug | 本轮处理 |
|---:|---|---|
| 1 | `prompt-injection` | 从通用体验页升级为独立正文、5 份公开来源、段落级 Cite 映射，以及“按资料处理/当成指令”的工具权限闸门演示 |
| 2 | `agent-harness` | 研究台账改为页面实际使用的 5 份 Harness 资料 |
| 3 | `tools` | 研究台账改为页面实际使用的 5 份工具调用资料 |
| 4 | `context` | 研究台账改为页面实际使用的 5 份上下文资料 |
| 5 | `prompt` | 研究台账改为页面实际使用的 5 份提示词资料 |
| 6 | `token` | 研究台账改为页面实际使用的 4 份 token 资料 |
| 7 | `agent` | 研究台账改为页面实际使用的 4 份 Agent 资料 |
| 8 | `rag` | 研究台账改为页面实际使用的 4 份 RAG 资料 |
| 9 | `citation` | 研究台账改为页面实际使用的 4 份引用资料 |
| 10 | `grounding` | 研究台账改为页面实际使用的 4 份 grounding 资料 |

## 逐条提交

| slug | commit |
|---|---|
| `prompt-injection` | `ee11fcdb` |
| `agent-harness` | `1b4d4176` |
| `tools` | `2c6b83c5` |
| `context` | `e4fcf7c0` |
| `prompt` | `379a13b7` |
| `token` | `e30e58eb` |
| `agent` | `f107b440` |
| `rag` | `07045634` |
| `citation` | `e19fcd4e` |
| `grounding` | `9da5da57` |

提示注入页的引用映射修复另保留为独立修复提交：`c869f4d0`、`7bb4dcb3`、`e6305b96`。十条没有合并成一个编辑提交。

## 研究与演示审查

- `prompt-injection` 正文区分用户目标、外部资料和工具权限；演示展示资料标记、模型误判后的 `send_secret` 请求和工具闸门拒绝；正常分支保留原摘要任务。
- OWASP、OpenAI、Anthropic、NIST 的公开资料用于提示注入定义、外部内容隔离、工具边界、确认和治理说明。
- 其他九条的 `term-research` 来源 URL 与当前页面机制对齐，`demoSignature` 与实现保持一致。
- 唯一 review 子智能体 `/root/ai_stack_review` 对 VBP-069 最终树给出 PASS：页面专属、来源集合和 Cite ID 无 orphan/missing；提示注入页 9 个正文 Cite ID 与 5 个来源的映射完整。
- VBP-068（上一批十条）此前已由同一 review 子智能体给出 PASS；本轮回顾继续检查其正文、引用、演示和响应式布局。

## 验证

- `npm ci --ignore-scripts`：完成。
- `npm run typecheck`：通过。
- `npm run build`：通过，生成 255 个静态页面。
- `git diff --check`：通过。
- 本地真实浏览器桌面（1280px）：十条路由均 HTTP 200、H1/参考资料可见，无横向溢出；提示注入正常与错误分支均可操作。
- 本地真实浏览器窄屏（390px）：十条路由 `body.scrollWidth === viewport`，无横向溢出。
- DP 测试计划 `4c5e9dc3-867e-468a-83c6-fabaf0edcd56`：2/2 用例通过；执行记录 `a9243f35-9ac4-42c8-a888-dd92596553fc`、`bd5969b6-7124-452a-b46a-967125d533f5`。
- dev 部署 `local-dev-20261004-vbp069-c71bea5c`（对象 `f8acab6e-8baf-4a10-88fc-57dbf08373f3`）已发布并验收。
- 生产公网十条路由均 HTTP 200、H1 和参考资料可见；提示注入真实浏览器的错误分支被拒绝，正常分支保留资料处理路径。

## Git、DP 与生产发布

- 功能分支：`feat/VBP-069-prompt-injection-ledger`，从 `origin/main` 切出。
- dev PR [#318](https://github.com/Gyschuaner/VibePolaris/pull/318) 已合入，提交 `c71bea5c2ed4b485e1eb4c96f05b921dfa1c947c`。
- 生产 PR [#319](https://github.com/Gyschuaner/VibePolaris/pull/319) 已合入 `main`，生产源提交 `4a9402dc2632a44a0a4d8acdc0bf1c953e2e0054`。
- DP 生产部署：`deploy-vbp069-prompt-injection-ledger-prod-20261004`，对象 `57c10707-dc0a-4beb-a557-a8424138cb87`，地址 `https://vibe.chuansgu.top`；VBP-069 已推进为 `released`，研发任务已完成，质量门禁通过且无开放 Bug。
- 当前生产 release：`/opt/vibepolaris/releases/20261003T184652Z-4a9402dc`；`/opt/vibepolaris/current` 已指向该目录；`vibepolaris-web-1` 使用 `vibepolaris:4a9402dc2632a44a0a4d8acdc0bf1c953e2e0054` 且为 `healthy`。
- 回滚备份：`/opt/vibepolaris/backups/20261003T184652Z-from-a5dcd949`（实际快照目录为同时间戳的 `from-vibepola`，前者为便于引用的符号链接）；旧 release `/opt/vibepolaris/releases/20261003T175929Z-a5dcd949` 与旧镜像 `vibepolaris:a5dcd9495d19ad1397f90268046c3cd66a9987b8` 保留。回滚时恢复旧 Compose、旧镜像并将 `current` 指回旧 release，保留 `vibepolaris_xiaobei_data` 数据卷。
- 生产主机根分区部署后约 4.2GB 可用；未删除旧镜像、release 或数据卷。

## 本地范围与后续

用户主工作区 `/Users/guyisheng/Documents/VibePolaris` 的 icon 设计及三个未跟踪脚本仍留在 `feat/VBP-064-term-icons`，没有进入本批分支、dev、main 或生产。规则指定的 Obsidian 库 `D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此未同步。下一批继续按“一条一条修改和审核，十条统一发布”的规则处理剩余词条。
