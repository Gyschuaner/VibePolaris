# VBP-063 · 第 044 批 Git 工作流词条更新与发布记录

## 范围

本批按“逐条修改、逐条审核、十条合批发布”完成以下词条：`repo-commit`、`branch`、`working-tree`、`staging-area`、`diff`、`checkout-switch`、`remote`、`clone`、`pull`、`fetch`。

每条词条均按 `vibepolaris-concept-pages` 完成读者任务、正文追问、Git 官方资料、段落级 `Cite` 映射、概念专属可观察演示、边界与失败分支和独立提交；review 只使用 `/root/ai_stack_review`，未调用 ZCode CLI。

## 实现与逐条验收

- 功能分支：`feat/VBP-063-git-workflow-249-258`，从 `origin/main` `01b09a6d` 创建。
- 十条独立提交：`8683e2a6`、`a275463b`、`84cd6eff`、`13ef4623`、`40285f45`、`8b91eef3`、`b988f2e7`、`131f3fbb`、`25ee53be`、`2a1200ce`。
- 合批公开清单提交：`74b5b583`，一次性加入后八条；`repo-commit` 与 `branch` 已在基线公开清单中，十条按一个批次发布。
- 每条均有 5 个已核对来源、3 个 schema 允许的演示阶段；50 个 `Cite` 目标唯一映射。
- `/root/ai_stack_review` 对十条逐条给出通过意见，未留下 blocker。
- `npm run typecheck`：通过。
- `npm run build`：通过，公开清单加入后生成 225 个静态页面。
- `npm run audit:terms`：覆盖 296/296、重复场景 0、相邻同类 0、近重复 0；脚本仍因仓库既有最大粗结构计数 13 超过阈值 12 返回非零，该项不是本批新增。

## dev 集成与验收

- dev PR [#303](https://github.com/Gyschuaner/VibePolaris/pull/303) 已合并，合并提交 `73833cab010ba7e7ee0ec34cb83c8b780054df1a`。
- DP dev 部署：`local-dev-20261003-vbp063-73833cab`，对象 ID `952846fa-d4b1-4b67-a487-8a4fa1c09822`，环境 `dev`，地址 `http://127.0.0.1:3221`。
- 合入后的十条路由逐条返回 HTTP 200；真实浏览器逐条看到对应 H1、演示步骤和参考资料。
- VBP-063 按 DP 允许流转从 `in_development` → `ready_for_test` → `testing` → `ready_for_release`。

## 生产发布

- 生产 overlay 分支：`release/VBP-063-prod-overlay-20261003`，从当前 `origin/main` 建立，只合入 VBP-063 功能分支；没有把 dev 上的其他功能带入生产。
- PR [#304](https://github.com/Gyschuaner/VibePolaris/pull/304) 已合并，最终 main 提交：`3abf12df2aea73cb9c911740b99d0c12bc74615c`。
- 本机 `npm run typecheck`、`npm run build` 通过；Next 生成 225 个静态页面。`docker build --platform linux/amd64 -t vibepolaris:f059f30a .` 通过，部署时按最终 main 提交标记为 `vibepolaris:3abf12df`。
- DP 生产部署：`deploy-vbp063-git-workflow-249-258-prod-20261003`，对象 ID `6c958ecf-2877-4a16-8e4e-3f2acbc5186b`，状态 `released`，环境 `production`，地址 `https://vibe.chuansgu.top`。
- 发布目录：`/opt/vibepolaris/releases/20261003T083508Z-3abf12df`；切换后 `vibepolaris-web-1` 使用 `vibepolaris:3abf12df` 且为 `running/healthy`。
- 公网根路径和十条词条均 HTTP 200；真实浏览器逐条看到对应 H1、演示步骤和参考资料。
- 回滚备份：`/opt/vibepolaris/backups/20261003T083508Z-from-52f4e3ab`；旧 release 为 `/opt/vibepolaris/releases/20261003T061740Z-52f4e3ab`，旧镜像为 `vibepolaris:52f4e3ab047d24405aa94752ad4ed864adefb910`。回滚时恢复备份中的 `current`、Compose 和旧镜像，保留 `xiaobei_data` 数据卷。

本批遵守“逐条修改、十条统一发布”；没有逐条上线，也没有把其他 dev 功能带进生产。当前机器不存在 `D:/Obsidian/gysnote`，未创建空的 Obsidian 记录。
