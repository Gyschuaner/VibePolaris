# VBP-096：十条概念词条特色演示批量发布记录

本批从 `origin/main` 的 `3735308c33fb0bf2d6ded1f76ca69a32e9b2dd24` 切出 `feat/VBP-096-next-concepts`，按 concept-pages Skill 逐条完成十个已有词条。每条都独立研究、独立实现、独立提交并交给唯一 reviewer `/root/ai_stack_review` 复核；完成十条后才合批进入 `dev`、`main` 和生产。

## 发布范围

| 词条 | 独立实现提交 | 演示机制 |
| --- | --- | --- |
| debounce | `d8d24d25` | 安静窗口向后推，最后一次输入才提交 |
| optimistic-update | `f7397f9c` | 先改本地账本，失败时沿同一条记录回滚 |
| circuit-breaker | `e2eae59a` | 失败计数越过阈值后断路，冷却探针成功才闭合 |
| data-contract | `2079e160` | 字段契约经过兼容闸门，破坏性改名在下游前停下 |
| context-compaction | `306ecd4f` | 长对话保留目标、证据和未完成动作，旧材料折入摘要 |
| tool-schema | `9547878e` | 工具请求先过参数形状闸门，再进入授权与执行 |
| latency-budget | `18ec28b3` | 一次请求沿时间账本消耗预算，尾延迟显示实际超支段 |
| column | `ebcd6fd2` | 同一组输入穿过 TEXT 与 NUMERIC 镜片，类型改变比较与求和 |
| acid | `12b18f3f` | 原子性、一致性、隔离性、持久性分别遇到自己的失败条件 |
| encryption-in-transit | `2a21c63b` | 同一份订单包裹经过三枚 TLS 封条，明文、重加密与 SAN 阻断可见 |

本批还将 encryption-in-transit 的研究台账、experience 五帧和引用 helper 收敛为同一组来源与状态；未把下一批词条或其他本地功能带入发布。

## 资料与审查

- 每条页面按读者追问组织正文，段落级 citation 与 research/experience 来源顺序保持一致。
- 唯一 reviewer `/root/ai_stack_review` 对十条逐条 PASS，覆盖来源可访问性、段落映射、概念边界、独特演示、失败分支、暂停/逐帧/重播、`IntersectionObserver`、后台暂停、`prefers-reduced-motion`、ARIA 与移动布局。
- Encryption-in-transit 的五个来源（RFC 8446、RFC 9525、NIST SP 800-52、OWASP TLS、MDN TLS）实现前逐一返回 HTTP 200；其 15 个正文目标与 helper 映射无 orphan/missing/duplicate。

## 验证

- `npm run typecheck`：通过。
- `npm run build`：通过，生成 1071 个静态页面；Docker linux/amd64 构建也通过。
- `git diff --check`：通过；三份 JSON 可解析。
- 本地真实浏览器逐条检查十个路由；每个演示都完成非默认状态、末步与重播回到默认状态的回归。Encryption-in-transit 三个实验分支实测为 `PASS · 3 / 3`、`LEAK · CDN → LB 明文`、`BLOCKED · SAN ≠ lb.internal`。
- 生产机通过 HTTPS server-local smoke：`/`、`/news`、`/about`、`/sitemap.xml` 及十条词条均返回 200；十条页面标题/内容 marker 均命中。容器健康状态为 `healthy`，最近 5 分钟日志只有正常启动信息。
- 本机到公网的真实浏览器请求仍返回 `ERR_CONNECTION_CLOSED`，因此没有把本地浏览器访问生产写成通过；生产机自身 HTTPS 路由检查已通过。

## Git、合并与生产

- dev PR [#415](https://github.com/Gyschuaner/VibePolaris/pull/415) 已合入，提交 `723bf59dddcc36005b3dd27271350f999a75ec05`。
- main PR [#416](https://github.com/Gyschuaner/VibePolaris/pull/416) 已合入，生产源提交 `8381386f9849b4dff64cfa72d7d9e358aa087b77`。
- 生产镜像：`vibepolaris:8381386f9849b4dff64cfa72d7d9e358aa087b77`，本机构建目标为 `linux/amd64`。
- 生产 release：`/opt/vibepolaris/releases/20261007T003614Z-8381386f`；`/opt/vibepolaris/current` 已原子切换到该目录；`vibepolaris-web-1` 为 `running/healthy`。
- 切换前备份：`/opt/vibepolaris/backups/20261007T003313Z-from-465ebd1d`，保留旧 release、旧镜像检查信息和 Compose 文件；`vibepolaris_xiaobei_data` 数据卷未改动。

DP CLI 在发布前后按规则查询 VBP-096 和记录 deployment，均返回 `SSL: UNEXPECTED_EOF_WHILE_READING`。本批未创建或伪造需求、部署、测试计划或状态 ID；网络恢复后应补录真实 deployment `deploy-vbp096-ai-stack-concepts-prod-20261007`，使用生产提交、环境、URL 与备份 ID，并重新查询确认状态。

回滚时恢复备份中的 Compose 与旧镜像 `vibepolaris:465ebd1df35831946dd54ad9225d2ea680b5131d`，重新启动同名 web 服务，再将 `/opt/vibepolaris/current` 指回旧 release `/opt/vibepolaris/releases/20261006T231925Z-465ebd1d`；保留新版本产生的数据，不覆盖 Xiaobei 数据卷。

`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，本批未写入 Obsidian。
