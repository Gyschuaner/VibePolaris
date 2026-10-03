# VBP-065 · 第 045 批 Git 集成与交付词条更新及发布记录

## 范围

本批按“逐条修改、逐条审核、十条合批发布”完成：`push`、`merge`、`rebase`、`merge-conflict`、`revert`、`stash`、`pull-request`、`code-review`、`ci`、`cd`。用户要求逐条实现、十条完成后统一上线；其他开发分支内容没有进入生产 overlay。

每条词条均按 `vibepolaris-concept-pages` 完成资料研究、面向零基础读者的追问式正文、段落级来源映射、概念专属可观察演示、边界与失败分支、真实浏览器验收和独立提交。按用户最新规则未调用 ZCode CLI，只使用唯一 review 子智能体 `/root/ai_stack_review`。

## 逐条实现与审查

功能分支：`feat/VBP-065-git-integration-259-268`，从 `origin/main` `527805be` 创建。

| slug | 独立提交 |
| --- | --- |
| push | `002af08b` |
| merge | `adb18314` |
| rebase | `f84c7ec1` |
| merge-conflict | `534d95f4` |
| revert | `9e4e06d5` |
| stash | `2a61fba4` |
| pull-request | `d11c85f8` |
| code-review | `dafcd634` |
| ci | `97ebdeb6` |
| cd | `45abd3e2` |

共享开场修正提交为 `78cefd6`，`cd` 文案校正提交为 `8c8ab8a0`。十条完成后才一次性加入 `content/zh/published-terms.json`。

review 结论：十条的 page、lesson、batch、research、route、published 数据齐全；官方来源 URL 全部 HTTP 200；引用无 orphan/missing，section/paragraph ID 唯一；共享 `MechanismHero` 桌面与 390px 无截断或重叠；旧 `agent-loop` 词条桌面与 390px 回归通过，无 blocker。

## 本地与 dev 验收

- `npm run typecheck`：通过。
- `npm run build`：通过，生成 235 个静态页。
- `git diff --check`：通过。
- `docker build --platform linux/amd64 -t vibepolaris:4055ea95 .`：通过。
- dev PR [#306](https://github.com/Gyschuaner/VibePolaris/pull/306) 合入 `dev`，合并提交 `b8792e784a0bc28caf5371ce002fcc912c4d991d`。
- DP dev 部署：`local-dev-20261003-vbp065-b8792e78`，对象 ID `6747e6d1-2e4d-490b-8fab-8c38cb85b1aa`，地址 `http://127.0.0.1:3222`。
- 根路径和十条词条在合入树均 HTTP 200；真实浏览器复核 `push` 的对象/远程闸门状态和 `cd` 的三步制品状态。

## 生产发布

- 生产 overlay：`release/VBP-065-prod-overlay-20261003`，从 `origin/main` 单独建立，只 cherry-pick 本批十条与共享 Hero/CSS/路由及公开清单改动。
- 生产 PR [#307](https://github.com/Gyschuaner/VibePolaris/pull/307) 合入 `main`，最终提交 `529786b2002bd33230c26c5dd66d4e0dc87a1ef4`。
- 生产镜像：`vibepolaris:529786b2002bd33230c26c5dd66d4e0dc87a1ef4`（linux/amd64）。
- DP 生产部署：`deploy-vbp065-git-integration-259-268-prod-20261003`，对象 ID `06beb48d-a254-4ac6-bdf1-cbd7d44615e6`，环境 `production`，地址 `https://vibe.chuansgu.top`。
- 当前 release：`/opt/vibepolaris/releases/20261003T120347Z-529786b2`；`vibepolaris-web-1` 第四次健康检查为 `healthy`。
- 公网根路径和十条词条均 HTTP 200；公网 `cd` 页面真实浏览器验收通过，Hero 和三态演示文案可见。

## 回滚

- 切换前 release：`/opt/vibepolaris/releases/20261003T083508Z-3abf12df`。
- 切换前镜像：`vibepolaris:3abf12df`。
- 备份目录：`/opt/vibepolaris/backups/20261003T120347Z-from-3abf12df`，包含旧 Compose、当前 release 和镜像标识。
- 回滚时用备份中的 Compose 和旧镜像重新启动同名 `web` 服务，再把 `/opt/vibepolaris/current` 指回旧 release；保留 `xiaobei_data` 数据卷，不覆盖上线后的用户数据。

DP 中 VBP-065 已从研发、测试、待发布推进为 `released`，十个研发任务均为 `done`。当前机器不存在规则指定的 `D:/Obsidian/gysnote`，未创建空记录。
