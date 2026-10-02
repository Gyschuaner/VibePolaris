# 189–198 词条文案更新与上线记录 · VBP-057

本批按用户要求逐条修改、逐条提交，累计十条后统一加入公开清单并生产发布。每个词条都完成资料核对、子智能体 reader/language 审读、主助手取舍、单条构建和受影响页面浏览器验收；没有调用 ZCode CLI，子智能体只做审读和建议，不修改仓库。范围是已有词条的中文正文、边界、读者追问、机制演示、测验提示和来源映射，其他功能保持本地。

需求：`VBP-057` · `5d8ac78f-c463-4b58-9e69-293e243b8dc0` · 第038批：设计系统、无障碍与移动端基础词条升级。十个研发任务已完成，需求状态为 `released`。

## 词条与逐条提交

| 编号 | slug | DP 任务 | 逐条提交 |
| --- | --- | --- | --- |
| 189 | design-system | `16ec4275-9987-4172-badd-42fe3c7dfc0d` | `53057801` |
| 190 | a11y | `4879977a-093c-4312-a60c-56bcf4970cbe` | `dc99e2cc` |
| 191 | semantic-html | `783dbafe-c468-4f42-9754-00e71d3d47c9` | `ef6fea61` |
| 192 | deep-link | `bc87fb39-6c2d-4bf4-ab37-bfbe83216a81` | `61e90474` |
| 193 | app-manifest | `22554584-a3d6-44a4-b41c-d6110b463bf6` | `7a5c653c` |
| 194 | emulator | `c6527532-2c79-475b-a020-93b131470a4f` | `bb52782c` |
| 195 | code-signing | `728fe8b9-193e-4cdc-afb8-e94ef386af85` | `666f4b3a` |
| 196 | gesture | `db0e17af-db25-4204-b424-aff5727ed867` | `b9a084ac` |
| 197 | haptic-feedback | `82665c20-f85b-4390-a643-afabc5610c21` | `3ca02df4` |
| 198 | touch-target | `0f62580d-286c-4c64-bca7-f6bad2867a40` | `10cbbb76` |

十条内容提交保持独立。公开清单在单独提交 `b58bc206` 中从 175 条一次追加为 185 条，没有在任何单条内容提交中提前公开。

## 内容与资料

本批内容落在基础词条数据、数据驱动演示和研究映射中：

- `content/zh/term-batches/frontend-product.json`：semantic-html、deep-link、app-manifest、emulator、code-signing、gesture、haptic-feedback、touch-target 的正文和页面结构。
- `content/zh/term-experiences/base.json`：design-system、a11y 的演示、场景角色、逐帧状态、提示、测验和来源。
- `content/zh/term-experiences/frontend-product.json`：semantic-html、deep-link、app-manifest、emulator、code-signing、gesture、haptic-feedback、touch-target 的演示与来源。
- `content/zh/term-research/base.json`：design-system、a11y 的机制、误解边界、演示签名、来源和近邻词条映射。
- `content/zh/term-research/frontend-product.json`：其余八条的研究映射。
- `content/zh/published-terms.json`：发布阶段一次追加本批十个 slug。

资料以官方规范和平台文档为主，覆盖设计系统、WAI-ARIA 与 WCAG、WHATWG HTML、Android 与 Apple 平台文档、W3C Pointer Events 和 Vibration API。每条研究卡都保留正文论断、演示状态与来源 URL 的对应关系。

## 本地验证

- 每条修改后都单独提交，JSON 解析与 `git diff --check` 通过。
- 十条分别在真实浏览器打开 `/terms/<slug>`，检查标题、正文、独立演示各状态、测验和来源区；临时公开清单在每次验收后恢复，不提前上线。
- 内容发布提交后的 `npm run build` 通过，生成 197 个静态页面。
- `npm run audit:terms` 的重复场景、相邻同类型场景和近重复对均为 0；命令仍因 `origin/main` 已有的 `timeline/4/5/4` 粗结构 13 次而退出 1，基线分支复跑得到相同结果，本批没有新增该问题。
- 生产覆盖分支包含上一版新闻模块，`npm run news:validate` 通过；覆盖构建生成 200 个静态页面。
- 本机 `linux/amd64` 临时容器通过新闻 smoke、首页、新闻列表、两条已有新闻详情、sitemap、邀请制接口和十个词条路由检查。

## 生产发布记录

内容 PR [#283](https://github.com/Gyschuaner/VibePolaris/pull/283) 已合入 `main`，合并提交为 `011afbca83563d0eb3a38444dfbd5af36f10aa2e`。生产从上一版覆盖分支保留新闻模块，创建 `release/VBP-057-prod-overlay-20261002`；覆盖提交为 `46b7612c446eb687d616c868969aab75949b7829`。

- 镜像：`vibepolaris:46b7612c`，本机以 `linux/amd64` 构建并通过 Next 构建、TypeScript、新闻校验和临时容器检查。
- 当前发布目录：`/opt/vibepolaris/releases/20261002T093829Z-46b7612c`；`/opt/vibepolaris/current` 已指向该目录，容器 `vibepolaris-web-1` 使用新镜像并为 `running/healthy`。
- 回滚基线：`/opt/vibepolaris/releases/20261002T062511Z-15953dcb`，旧镜像 `vibepolaris:15953dcbf5d51417c481fe1b993dbffd505cc1f5` 保留；切换前的 Compose 与元数据备份在 `/opt/vibepolaris/backups/20261002T093829Z-15953dcbf5d51417c481fe1b993dbffd505cc1f5`；`vibepolaris_xiaobei_data` 持久化数据卷未改动。
- DP deployment：`deploy-vbp057-content-189-198-prod-20261002`，对象 ID `e922d019-fd4e-41f9-abb2-a9bc31341d66`，状态 `released`，关联需求 `VBP-057`。
- HTTPS 检查通过：首页、新闻列表、两条已有新闻详情、sitemap、邀请制接口和本批十个 `/terms/<slug>` 路由均返回 HTTP 200；容器仍为 `running/healthy`。

回滚时恢复备份的旧 Compose 与镜像 `vibepolaris:15953dcbf5d51417c481fe1b993dbffd505cc1f5`，将 `/opt/vibepolaris/current` 指回 `/opt/vibepolaris/releases/20261002T062511Z-15953dcb`；保留新版本产生的数据，不覆盖 `vibepolaris_xiaobei_data`。

`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此不创建空记录。
