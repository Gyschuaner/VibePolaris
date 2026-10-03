# VBP-068：AI 与 Agent 历史词条复核及演示台账对齐

父需求：VBP-012「全站概念词条分批升级与补全」  
需求：VBP-068「第048批：AI 与 Agent 历史词条复核及演示台账对齐」  
范围：复核十条已完成的 AI/Agent 词条，按 `vibepolaris-concept-pages` Skill 对照正文、段落来源、交互状态、失败分支、可访问性和研究台账；每条独立提交，十条完成后统一合入和发布。没有调用 ZCode CLI；只使用唯一 review 子智能体 `/root/ai_stack_review`。

## 词条范围

| # | slug | 本轮处理 |
|---:|---|---|
| 1 | `evaluation-dataset` | 将旧的数量/分数演示改为当前三组关联工单、逐行拆分与按工单分组；研究来源同步为四份当前资料 |
| 2 | `model-routing` | 对齐 A/B 能力、门槛、费用和“无候选”分支；研究来源同步为 RouteLLM、Bedrock、FrugalGPT、LiteLLM |
| 3 | `model-fallback` | 对齐 429/超时/401、备用能力和总尝试上限；同步四份当前来源 |
| 4 | `prompt-caching` | 对齐四段输入、连续前缀复用和缓存失效条件；同步 OpenAI、vLLM、Anthropic、SGLang 来源 |
| 5 | `structured-output` | 对齐 amount schema、候选筛选、截断/拒绝/空输出和事实核对；同步四份当前来源 |
| 6 | `function-calling` | 对齐 `call_01`、`get_order(order_id)`、注册/参数/权限检查和执行回执；同步四份当前来源 |
| 7 | `tool-choice` | 将研究台账中不存在的相关性数值条改为当前候选卡、策略和待校验闸门证据 |
| 8 | `tool-result` | 修复 stock/timeout 按钮初始 `aria-pressed` 与“尚未返回”状态不一致 |
| 9 | `agent-orchestration` | 修复无冲突 step 2 的状态文案，区分等待、冲突、清除冲突和直接合并路径 |
| 10 | `subagent` | 给 `subagent-run` 段补稳定的段落级引用锚点 |

四条已有实现与台账已经一致（工具结果、编排、子智能体等的必要小修均在本批完成），没有为了制造提交重复改动。

## 逐条提交

| slug | commit |
|---|---|
| `evaluation-dataset` | `624ab90f` |
| `model-routing` | `dc0c863e` |
| `model-fallback` | `aa5a6cf9` |
| `prompt-caching` | `ef493a93` |
| `structured-output` | `714966ec` |
| `function-calling` | `595cb0a6` |
| `tool-choice` | `74c3ce33` |
| `tool-result` | `71d47b92` |
| `agent-orchestration` | `51d117a4` |
| `subagent` | `cc1371f0` |

没有修改 `published-terms.json`：十条原本已经公开，本轮是已发布页面的实现/研究台账校正。

## 审查与验证

唯一 review 子智能体对最终树 `cc1371f0` 给出 PASS：十条均有专属正文、可观察机制、失败或边界分支、来源数组和段落引用映射；四处额外状态/锚点问题已修复。`prompt-injection` 的通用页缺少独立正文和段落级引用，作为下一批 P0 继续处理；其他旧页面研究台账的来源数量同步也列入后续批次，没有冒充本批已完成。

- `npm ci --ignore-scripts`：完成。
- `npm run typecheck`：通过。
- `npm run build`：通过，生成 255 个静态页面。
- `git diff --check`：通过。
- 本地真实浏览器桌面（1280px）：十条路由均有 H1、参考资料、唯一 ID、无横向溢出；逐条操作正常路径或关键失败分支。
- 本地真实浏览器窄屏（390×844）：十条路由 `body.scrollWidth === viewport`，无横向溢出，ID 唯一；抽查机制首屏视觉正常。
- 合并后本地 dev 预览：`http://127.0.0.1:3223`，十条路由 HTTP 200，H1/参考资料/引用标记可见。
- 生产浏览器：十条公网路由均可打开、无横向溢出、ID 唯一；`tool-result` 的 timeout 失败路径与 `structured-output` 的格式/事实检查路径通过。

## Git、DP 与发布

- 功能分支：`feat/VBP-068-ai-agent-audit-289-298`，从 `origin/main` 切出。
- dev PR [#315](https://github.com/Gyschuaner/VibePolaris/pull/315) 已合入，提交 `bd3b7ec94e08f21df359278f61db52c90a3747c2`。
- DP dev 部署：`local-dev-20261004-vbp068-bd3b7ec9`，对象 ID `a9fae2d5-f3af-434f-9d91-72a853bce3d5`，地址 `http://127.0.0.1:3223`。
- 生产 PR [#316](https://github.com/Gyschuaner/VibePolaris/pull/316) 已合入 `main`，生产源提交 `a5dcd9495d19ad1397f90268046c3cd66a9987b8`。
- DP 生产部署：`deploy-vbp068-ai-agent-audit-289-298-prod-20261004`，对象 ID `2f7c9904-985b-4b07-9e7a-83a0f1fc7935`，地址 `https://vibe.chuansgu.top`；VBP-068 已推进为 `released`，研发任务已完成，质量门禁通过且无开放 Bug。
- 生产 release：`/opt/vibepolaris/releases/20261003T175929Z-a5dcd949`；`/opt/vibepolaris/current` 已指向该目录。
- 回滚备份：`/opt/vibepolaris/backups/20261003T175929Z-from-8f17b4d0`，保留旧 release 与旧镜像 `vibepolaris:8f17b4d064979ab2c7e41e47af9a84d213cd413d`；当前镜像为 `vibepolaris:a5dcd9495d19ad1397f90268046c3cd66a9987b8`。
- 生产 `vibepolaris-web-1` 为 `running/healthy`，`vibepolaris_xiaobei_data` 数据卷未改动；根分区部署后约 4.9GB 可用。
- Docker Registry 拉取 `node:22-alpine` 仍不稳定，本次沿用已验证的 amd64 VibePolaris 运行时基底，在本机完成当前提交的构建后生成并传输新镜像；远端未删除旧镜像或数据卷。

## 本地范围与后续

用户主工作区 `/Users/guyisheng/Documents/VibePolaris` 的 icon 设计及三个未跟踪脚本仍留在 `feat/VBP-064-term-icons`，没有进入本批分支、dev、main 或生产。规则指定的 Obsidian 库 `D:/Obsidian/gysnote` 在当前 Mac 环境不存在，跳过同步。下一批优先补 `prompt-injection` 专属正文/来源/失败演示，并继续同步其余旧词条研究台账来源。
