# VBP-093 下一批词条机制差异表

本批从 `origin/main` 的 VBP-092 生产记录之后开始。正文沿用已核对的段落、锚点和引用关系；首图逐条替换旧的流程演示。每一条先独立实现和验证，十条完成后才统一发布。

| slug | 读者遇到的任务 | 首图的独立机制 | 改变条件 | 可见证据 | 边界/失败 |
| --- | --- | --- | --- | --- | --- |
| ssr | 判断个性化首屏为什么还没到 | 请求像一卷正在打印的票据，服务器把数据写成 HTML 纸带，流式开关改变纸带何时离开打印头 | 慢数据、流式外壳 | 外壳先出或整卷等待；可见与可交互分开 | 慢依赖仍会等，水合不是 SSR 本身 |
| ssg | 解释改了文档为何刷新仍是旧页 | 源稿、构建印章、CDN 货架和访客取件，版本卡在货架直到重新盖章 | 内容版本、是否重建 | 访客拿到 v1/v2；未重建状态保留旧件 | 不适合强实时或强个性化数据 |
| routing | 找到 `/products/42` 会落到哪一页 | URL 被拆成车厢，在铁路道岔上选择参数、授权和 404 轨道 | 路径段、登录状态、查询串 | 车厢转向目标页或死轨；历史栈保留 | 匹配不等于授权或数据成功 |
| local-storage | 判断两个标签页能否共享偏好 | 两个标签页把钥匙放入按 origin 分隔的玻璃罐，写入时只有同源另一页收到铃声 | origin、字符串化、写入动作 | B 页收到/收不到 storage 通知；对象变成字符串 | 同步、容量、敏感数据限制 |
| focus-management | 对话框打开后键盘下一步去哪 | 一束聚光灯代表焦点，从触发按钮进入对话框，沿可操作点移动，再回到原按钮 | 打开、Tab、Escape/关闭 | `activeElement` 的位置和返回点可观察 | outline 不是全部；背景不能继续抢焦点 |
| preview-deployment | 合并前确认某次提交实际长什么样 | 提交芯片沿着 PR 传送带进入预览码头，推送新芯片换预览，生产码头不动 | F4/F5、关闭 PR | URL 固定到提交；预览回收，生产仍是 M9 | 数据、凭据和生产冒烟隔离 |
| rollback | 线上故障时怎样恢复且不抹掉证据 | 流量转盘从 v42 转回保留的 v41，错误仪表下降，副作用票据仍留在旁边 | 故障确认、流量指针、健康检查 | 稳定制品接流量，v42 保留调查 | 不撤销数据库写入或外部调用 |
| user-story | 把“加导出按钮”变成可交付需要 | 空白卡片吸附角色、任务、原因，翻面后出现可检查验收清单 | 补角色/任务/结果 | 句子从功能名变成用户目标；验收项可打勾 | 不替代研究、规则和异常设计 |
| problem-statement | 从预设方案退回可验证问题 | 方案便签放进证据镜，拆成用户、行为、影响，旁边保留多条候选方案 | 加观察记录、分离推断 | 事实和推断分层；方案不再锁死 | 不能把主观痛点当事实 |
| target-user | 决定本期优先服务哪组人 | 人口标签散成点，按任务、频率、权限落入不同托盘，范围框只圈本期对象 | 分组维度、范围选择 | 目标组与下一期组可见；证据标签跟随 | 不等于永久排除其他人 |

## 资料核对

本批每条至少保留四份实际打开的公开资料，并把论断绑定到段落 ID。已打开的原始资料包括 React、Next.js、web.dev、WHATWG、MDN、W3C WAI、Vercel、Netlify、Kubernetes、Amazon ECS、Git、GOV.UK Service Manual、Scrum Guide 和 Design Council；各条具体 URL 仍以对应 `lib/*-sources.ts` 为准。

## 发布记录

- 实现分支：`feat/VBP-093-next-concept-signatures`，从 `origin/main` 的 `3d10e2bb` 创建；十条逐条提交，最后状态修复提交为 `295d8d8`。
- 唯一 review 子智能体逐条结论：`ssr`、`ssg`、`routing`、`local-storage`、`focus-management`、`preview-deployment`、`rollback`、`user-story`、`problem-statement`、`target-user` 全部 PASS。review 发现的来源台账、重播状态泄漏、target-user 分镜漂移和焦点 Tab 顺序问题均已修复。
- 来源与台账：十条的 helper/research/experience URL 逐条同序，数量为 `4/4/4/4/4/4/6/4/4/4`；Cite targets 无 missing、orphan、duplicate。
- 验证：`npm run typecheck`、`npm run audit:terms`、`npm run build` 通过；audit 结果为 322 条、322 个唯一场景、`sourceCoverage=322`、重复/相邻重复/近重复均为 0；build 生成 1064 页。CUA 桌面和 390px 移动视口均检查了十条路由的唯一 H1、无横向溢出和控制台错误；步进、重播状态、焦点对话框背景控件 `tabIndex=-1` 均实测通过。
- 合并：feature→dev PR #403，merge SHA `fdb62eee56eeae89d777c8e1cd051b21b5f80d68`；dev→main PR #404，merge SHA `09a7245840d7cfe1bdd694618314ed251d3fbf91`。
- 生产镜像：从 main SHA `09a7245840d7cfe1bdd694618314ed251d3fbf91` 的独立 worktree 构建 `vibepolaris:09a7245840d7cfe1bdd694618314ed251d3fbf91`，manifest digest 为 `sha256:96603288c637463e9d4b8e535aaa7289af70ee5c093bf6da0dc94987e012e471`。
- 生产发布：`/opt/vibepolaris/releases/20261007T060000Z-09a72458` 已切为 `/opt/vibepolaris/current`，`vibepolaris-web-1` 使用新镜像并保持 `healthy`。服务器容器和服务器公网入口对十条新路由均返回 HTTP 200。回滚脚本保留上一稳定 release `/opt/vibepolaris/releases/20261006T212659Z-428c1fca-corrected` 的 image tag `428c1fca4870bf94ae9b940918b9c7064b6413a4`；更早的安全回滚目标仍为 `/opt/vibepolaris/releases/20261006T203945Z-1d37bf09`。
- 限制：本机直连公网域名时出现一次 `SSL_ERROR_SYSCALL`，因此公网冒烟以服务器本机结果为准；DP CLI 当前仍因 TLS EOF 无法重新查询，本次未伪造 DP 写入。
