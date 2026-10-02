# 159–168 词条文案更新与上线记录 · VBP-054

本批按用户要求逐条修改，累计十条后统一发布。十个词条分别完成资料核对、真实 ZCode CLI 协作、主助手取舍、结构检查和独立提交；最后才把十个 slug 一次加入 `content/zh/published-terms.json`。范围是已有数据驱动词条的中文正文、边界、演示状态、测验提示和来源映射，其他功能继续留在本地分支。

需求：`VBP-054` · `7a2ddf20-10d6-4fe6-9152-99f107c3f848` · 第035批：函数控制流与数据结构词条升级。十个研发任务在 DP 中均为 `done`。

## 词条与逐条提交

| 编号 | slug | DP 任务 | 逐条提交 |
| --- | --- | --- | --- |
| 159 | return-value | `6b104b96-d0d0-4278-a685-53a8a2b4058f` | `09482804` |
| 160 | conditional-branch | `2f9dce3a-ced5-4609-83c2-4312fb1522ea` | `39e1c37d` |
| 161 | loop | `ba7353ad-6827-463f-91dc-a78786e98e97` | `6e7e2018` |
| 162 | object | `3ca4a2f4-6560-45e3-b8da-4398fe258771` | `4b4a3d46` |
| 163 | array | `a5af5135-9127-487c-ab78-29078cb37637` | `2c4c5a23` |
| 164 | client-server | `a03ed42f-4f04-4509-ad9b-883f3417782d` | `cbd539dc` |
| 165 | monolith | `9491fb87-b9e8-49b7-8e7a-2a0e40460f1d` | `346f33a1` |
| 166 | microservices | `a29d0067-4690-455c-922a-8b588174f37a` | `02cfa544` |
| 167 | serverless | `ef78c4e2-45ee-4ccf-86e7-9474765b06d7` | `d1894b46` |
| 168 | container | `2c2f5ba5-04f5-4423-b7c6-3d9c601f28e6` | `360537f2` |

`b9c16162` 是十条一起加入公开清单的批次提交；十条内容提交保持独立，公开清单没有在单条内容提交中提前放出。

## 内容与资料

正文、体验和研究记录分别映射在：

- `content/zh/term-batches/ai-stack.json`
- `content/zh/term-experiences/ai-stack.json`
- `content/zh/term-research/ai-stack.json`

本批的讲解主线按词条分别处理：返回值区分日志、外部状态和调用结果；条件分支展示条件求值后只走匹配路径；循环把索引、累计值和停止条件放进每轮状态；对象与数组分别解释键值结构和位置结构；客户端—服务器沿请求、处理、响应和状态码走一遍；单体架构与微服务用部署边界和网络协作区分；无服务器架构解释平台托管运行环境、冷启动、状态与扩缩；容器解释隔离进程、共享内核、文件视图和资源配额。

研究记录中的公开来源均已实际阅读，并映射到对应正文或演示：

- `return-value`：MDN `return`、ECMAScript Return Statement、Python return statement、TypeScript Functions。
- `conditional-branch`：MDN `if...else`、ECMAScript If Statement、Python if statement、TypeScript Narrowing、OWASP Authentication Cheat Sheet。
- `loop`：MDN Loops and iteration、ECMAScript Iteration Statements、Python for statement、Python while statement。
- `object`：MDN Working with objects、ECMAScript Object Type、RFC 8259、Python Dictionaries。
- `array`：MDN Indexed collections、ECMAScript Array Objects、Python Sequence Types、RFC 8259 Arrays。
- `client-server`：RFC 9110、MDN Overview of HTTP、MDN HTTP messages、WHATWG Fetch Standard。
- `monolith`：Microsoft Learn Common web application architectures、AWS Building Monoliths or Microservices、Google Cloud Microservices Architecture、Martin Fowler Monolith First。
- `microservices`：Microsoft Learn Microservices architecture style、NIST SP 800-204、AWS Well-Architected 服务拆分、Google Cloud Microservices Architecture、Martin Fowler Microservices Guide。
- `serverless`：Google Cloud serverless computing、AWS Lambda Runtime environment lifecycle、AWS Lambda Event-driven architectures、AWS Lambda Functions、CNCF serverless computing。
- `container`：Docker What is a container?、Docker What is an image?、Docker Running containers、Microsoft Learn Containers vs. virtual machines、NIST SP 800-190。

## ZCode CLI 协作证据

使用真实 ZCode CLI 入口 `/tmp/zcode-cli/zcode.cjs`，临时数据目录为 `/tmp/zcode-data`，模型配置为 `Qwen3.8-Flash-Next-FP8`。所有派发均使用当前仓库的 `vibepolaris-zcode-partner` 与 `humanizer-zh` 绝对路径；ZCode 只读词条材料，不修改仓库。

| slug | reader / language |
| --- | --- |
| return-value | `sess_7f3f37fe-955f-4ffe-89eb-0785217cf115` / `sess_3bd251a7-88e3-4ec6-8310-e1979a8b11b1` |
| conditional-branch | `sess_3300d5c6-16d4-453b-a973-e4303710837f` / `sess_a7734998-5381-4eee-a7be-663d17d40d22` |
| loop | `sess_a69938f2-120a-4500-87df-4fb12fb85df1` / `sess_f4d6208c-c116-4eec-bedb-109304fe3fb8`（language 仅返回加载确认） |
| object | `sess_fd2ddd27-4366-419e-9229-d2b1c2ccdac2` / `sess_a8fb632c-c81e-4440-b0ed-aa0b70fdd5da` |
| array | `sess_7ccc75b9-a165-46d4-a4c7-331e4680410d` / `sess_c92e6135-8533-45ed-b12f-e22c14536b80` |
| client-server | `sess_6bcf76a2-2df7-48e4-8c8e-6131db062f81` / `sess_96ec55c7-e89f-41bb-9935-126a6190faf5` |
| monolith | `sess_fbd9c7be-3245-4bde-a913-5ac0d0e306ce` / `sess_7e767ab0-42ee-4c90-a22a-4e6e9e821bea` |
| microservices | `sess_d1539614-6be2-444d-97b7-dfab40f3391c` / `sess_b4eb6dbb-e983-4c16-9fde-f7af50f1bac9` |
| serverless | 本轮未重复派发 reader；`sess_0a8d8b3b-b4ce-4a9f-8028-ef906e3dac15`（language） |
| container | `sess_24f0bf16-048d-402f-8867-643ecc152f2d` / `sess_bd11dceb-85c7-499f-bffa-5651ec4dab2a` |

reader 输入是当前词条的读者可见文案与按阶段配对的状态材料；language 输入是当前成稿与 `humanizer-zh`。ZCode 反馈只作为编辑线索，最终取舍由主助手按一手来源、schema 和页面状态完成；loop 的 language 会话只记录实际返回的加载确认，serverless 的 reader 未在本轮虚构会话记录。

## 本地验证

- 三份内容 JSON 和公开清单通过解析，`git diff --check` 通过。
- 十条内容分别提交后，才用 `b9c16162` 一次追加十个公开 slug；公开清单从 145 条增至 155 条。
- `npm run build` 通过，静态页面生成 `167/167`，TypeScript 通过。
- CUA 真实浏览器在本地 `3010` 端口打开十个 `/terms/<slug>` 路由，标题、正文、交互演示、判断题和来源区均可见；十个页面控制台 error 均为 0。
- 浏览器实际推进了单体架构“只改支付”帧；在 `390×844` 视口检查容器页，标题、问题卡片、正文和移动端操作入口均正常显示；验收后已恢复默认视口。

## 生产发布记录

内容 PR [#276](https://github.com/Gyschuaner/VibePolaris/pull/276) 已合入 `main`，合并提交为 `725b37fe01a3318e9dd333c43b0b82dc49a7698d`。生产从上一版覆盖分支切出 `release/VBP-054-prod-overlay-20261002`，只叠加本批十条内容、公开清单和研发记录，保留线上新闻模块；生产覆盖提交为 `9e4c51ce4002dd5ed2200233e1ffb0182e6a0313`。

- 镜像：`vibepolaris:9e4c51ce4002dd5ed2200233e1ffb0182e6a0313`，本机 `linux/amd64` 构建通过；容器内保留线上新闻校验并生成 `170/170` 静态页面。
- 当前发布目录：`/opt/vibepolaris/releases/20261002T004723Z-9e4c51ce`；`/opt/vibepolaris/current` 已指向该目录，容器 `vibepolaris-web-1` 为 `healthy`。
- 回滚目录：`/opt/vibepolaris/releases/20261001T223056Z-c0f5def8`，旧镜像 `vibepolaris:c0f5def8` 保留；持久化数据卷未改动。
- DP deployment：`deploy-vbp054-content-159-168-prod-20261002`，对象 ID `406fd0e2-9394-4ae0-80cf-b0bbb0cda0f0`，状态 `released`，关联需求 `VBP-054`。
- HTTPS 线上检查通过：十个 `/terms/<slug>` 路由、首页、`/news` 和新闻详情页均返回 200；CUA 真实浏览器打开线上 `monolith`，推进到“只改支付”帧，控制台 error 为 0。

当前功能分支为 `feat/VBP-054-control-architecture-159-168`，十条内容分别提交、十条公开清单一次提交；生产记录单独补入本文，其他功能没有随本批进入生产。`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此不创建空记录。
