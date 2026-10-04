# VBP-070：JSON Schema 与 Agent 控制词条复核升级

需求：`VBP-070` · `ae3f5911-aef6-48f3-9b52-72da41de57ad` · 第 050 批。研发任务：`f3694787-b95a-4f78-9d4c-ac5fcfa559e2`。

本批按 `vibepolaris-concept-pages` Skill 逐条完成并统一发布十条已有 AI/Agent 词条：

1. `json-schema`
2. `agent-loop`
3. `plan-and-execute`
4. `handoff`
5. `human-in-the-loop`
6. `guardrail`
7. `moderation`
8. `eval`
9. `benchmark`
10. `grader`

每条保留独立提交；批次完成后才合并发布。研究台账为每条提供 4–5 个公开来源、段落级 Cite 映射和可访问 URL。`json-schema`、`eval`、`benchmark`、`grader` 的研究来源均达到至少四份。演示按概念机制分别实现：Schema 字段校验、循环上限、计划失败重排、交接缺信息退回、人工审批、护栏 mask/block、审核阈值、评测回归、基准条件可比性和评分器未评分状态。

## 提交与审查

十条逐条提交：

- `4e0e1edd` JSON Schema research ledger
- `0076fbcb` agent loop demo ledger
- `81ccf92a` plan-and-execute demo ledger
- `735df443` handoff demo ledger
- `ce40be8e` human-in-the-loop demo ledger
- `40df2431` guardrail demo ledger
- `c26bfa29` moderation demo ledger
- `c74a8283` evaluation research ledger
- `fb0afc94` benchmark research ledger
- `af9702d0` grader research ledger

审查发现 batch 台账仍有三条旧演示描述，随后逐条修正：

- `51277819` 对齐 eval batch demo ledger
- `7833e1b1` 对齐 benchmark batch demo ledger
- `1baf44d6` 对齐 grader batch demo ledger

最后修正 handoff 研究描述与专属演示画面中的事实字段：

- `a0e38d7b` 对齐 handoff research ledger
- `3e5bf5fd` 删除画面不存在的“已确认金额”文案

唯一 review 子智能体 `/root/ai_stack_review` 基于 `3e5bf5fd` 最终 PASS：十条页面、published、term-batch、term-research、正文和演示一致；Cite 与来源一一对应，无 orphan/missing/duplicate；32 个唯一来源 URL HTTP 200。

功能 PR [#321](https://github.com/Gyschuaner/VibePolaris/pull/321) 已合入 `dev`，合并提交 `8371b902b7203c5cb6e5c460d474e9c1d42b08e2`。生产 PR [#322](https://github.com/Gyschuaner/VibePolaris/pull/322) 已合入 `main`，合并提交 `eae164c10780336044d32012d5bb768324f25d8b`。

## 验证

- `npm ci --ignore-scripts` 完成。
- `npm run typecheck` 通过。
- `npm run build` 通过，生成 255 个静态页面。
- `git diff --check` 通过。
- 本地 feature/dev 预览中十条路由均 HTTP 200，H1、参考资料可见；桌面 1280px 与移动 390px 的 `scrollWidth` 等于视口，无重复 ID。
- 十条专属交互及失败/边界分支通过：Schema enum/minimum、循环上限、计划锁定与修复、交接退回、人工拒绝、护栏阻断、审核阈值、评测关键失败、基准不可比和评分器未评分。
- DP 测试计划 `7db046f6-f62a-4f24-bd59-7390fe1585ec` 已完成，2/2 测试用例通过。
- dev 集成 deployment `local-dev-20261004-vbp070-8371b902`，DP 对象 `d9f23da6-e366-494d-b176-e9b054ca5d6f`，十条路由和关键交互通过。

## 生产发布与回滚

DP 生产 deployment：`deploy-vbp070-ai-controls-prod-20261004`，对象 `6f2abd19-b81d-4c33-a7a5-4a4088fcf043`，状态 `released`，关联 `VBP-070`。

- 地址：`https://vibe.chuansgu.top`
- 镜像：`vibepolaris:eae164c10780336044d32012d5bb768324f25d8b`
- 当前 release：`/opt/vibepolaris/releases/20261003T193556Z-eae164c1`
- 当前链接：`/opt/vibepolaris/current`
- 容器：`vibepolaris-web-1`，健康状态 `healthy`
- 回滚备份：`/opt/vibepolaris/backups/20261003T193556Z-from-4a9402dc`
- 回滚 release：`/opt/vibepolaris/releases/20261003T184652Z-4a9402dc`
- 回滚镜像：`vibepolaris:4a9402dc2632a44a0a4d8acdc0bf1c953e2e0054`

生产发布后，本批十条与 VBP-068、VBP-069 的二十条路由共 30 条均 HTTP 200，H1、参考资料和 ID 检查通过。生产浏览器实测 handoff 正常路径会转移回复权，移除订单号后会退回客服并保持未完成。回滚时恢复备份中的 Compose/旧镜像并将 `current` 指回旧 release；保留 `vibepolaris_xiaobei_data` 数据卷。

本机没有 `D:/Obsidian/gysnote`，未写入该库。
