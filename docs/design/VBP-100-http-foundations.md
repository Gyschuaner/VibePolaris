# VBP-100：HTTP 基础十条的内容与演示重做

本批处理后端基础词条 `server`、`request`、`response`、`http-method`、`status-code`、`http-header`、`query-parameter`、`path-parameter`、`request-body`、`json`。目标是让零基础读者能够从一条真实网络任务出发，解释消息的组成、数据的位置和失败发生在哪一层。每条先补足定义、过程、边界和误解，再按概念选择紧凑的观察型演示。

## 机制差异表

| 词条 | 读者要看懂的关系 | 演示的主要对象与动作 | 关键证据 | 形式 | 不采用通用流程图的原因 |
| --- | --- | --- | --- | --- | --- |
| 服务器 | 主机、进程、端口和路径错误不是一回事 | 在同一主机卡片上开关 8000/8001，切换 `/books` 与 `/missing` | 连接失败、404、200 分别停在不同边界 | 监听台 | 重点是同一地址上的可用入口与错误归属 |
| 请求 | 方法、目标、头、体各自说明什么 | 编辑一张 HTTP 消息纸，切换 GET/POST 和查询/正文位置 | 构造成功不代表已经发送或完成 | 消息剖面 | 重点是结构与责任，不是传递路径 |
| 响应 | 状态、头、体如何共同描述结果 | 在同一份回执上切换 201/204/422，单独应用到页面 | 页面变化由客户端处理决定，空体也有结果 | 回执台 | 重点是结果证据和空体边界 |
| HTTP 方法 | 方法语义与目标资源一起读，幂等不等于安全 | 在便笺架上重复 PUT/POST/DELETE，观察资源与计数 | 重试可能覆盖同一资源，也可能新增记录 | 资源架 | 重点是同一请求重复后的对象差异 |
| 状态码 | 1xx–5xx 类别提供处理线索，不是业务详情 | 在导出回执、任务查询、输入检查和服务开关之间切换 | 202 停在 pending，422 要改输入，503 要等待；任务状态和 HTTP 状态各自独立 | 分诊台 | 重点是分类和下一步，不是线性状态流 |
| HTTP 头 | 字段是带名字的元数据，消费方和信任边界各不相同 | 在同一 `/books/42` 资源上切换 Accept、Content-Type，并观察 Vary | 请求偏好、正文类型和缓存选择分别变化；字段声明不等于内容事实 | 字段透镜 | 重点是字段在不同层的用途与风险 |
| 查询参数 | query 的语法由 URI 定义，键的业务意义由应用定义 | 切换重复键、空值、编码和值类型，比较两种解析表 | `tag=a&tag=b` 可以变数组或取一个值 | 解析对照 | 重点是同一字符串的解释差异 |
| 路径参数 | 路由模板与实际 URL 值是两件事，匹配后仍要校验授权 | 将 `/users/42`、`/users/me`、`a%2Fb` 放入路由树 | 静态路由优先级、解码结果和对象访问检查分别可见 | 路由树 | 重点是匹配规则与权限边界，不是请求流水线 |
| 请求体 | body 是按 Content-Type 解释的表示，不等于 JSON | 在编码器台切换 JSON、表单、multipart 与坏类型 | 同一字段在不同编码器中变成不同字节，错配可停在 415 | 编码工作台 | 重点是表示格式和解析边界 |
| JSON | 文本语法、运行时值和字段语义有三层边界 | 在解析器台逐个修正注释、尾逗号、重复键和大整数 | 语法可通过不代表跨实现结果一致 | 解析器台 | 重点是语法与互操作陷阱 |

本批不新增 `pipeline`、`route` 或 `loop` 场景。全站审计以 `scripts/audit-term-distinctiveness.mjs` 为准；当前 352 条体验中 44 条属于这三类（12.5%），后续只在概念确实表达有序交接时保留它们。

## 资料边界

正文按段落映射到已阅读的规范和官方文档：HTTP 语义与状态码使用 [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)，URI 语法使用 [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986.html)，消息结构和字段说明使用 [MDN HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)、[MDN HTTP reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference) 与 Fetch API 文档。JSON 的语法和互操作边界使用 [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259.html) 与 MDN JSON 文档。框架路由、日志脱敏和对象授权只作为实现例子，不能写成 HTTP 标准。

研究台账、正文体验台账和专属页的 `lib/*-sources.ts` helper 现在使用同一组 URL 与顺序；页面里的 Cite target 只挂到能支持该段话的来源。服务器案例统一为页面实际演示的 `127.0.0.1:8000`、`8001`、`/books` 与 `/missing`，状态码案例统一为导出任务的 202、422、503，头字段案例统一为内容协商和 `Vary: Accept`。批次目录中的 `demoSteps` 只是索引摘要，步数按概念需要选择；真正的专属演示按概念选择 3–7 个分镜，不把步数或流程图当成全站模板。

每条正文至少保留四份实际阅读过的来源，并在专属页的 `ArticleCitation` 映射中标出具体段落。动画里的示例值是可观察的教学数据，不把预设状态写成线上测量或协议保证。

## 交付记录

实现顺序按表格逐条进行，每条独立提交；十条完成后统一跑构建、词条审计和真实浏览器验收，再由唯一 reviewer `/root/ai_stack_review` 做内容与语言审阅，最后一起发布。

## 本地验收记录

- 十条体验均有 4 段教学、5 条以上来源（最低为 5 条），且 `sourceIndices` 均落在对应来源范围内。
- `npm run typecheck`：通过。
- `npm run build`：通过，生成 1091 个静态页面。
- `node scripts/audit-term-distinctiveness.mjs`：352 条体验、352 条来源覆盖；流程类 `pipeline/route/loop` 为 44 条，占 12.5%；重复、相邻同构和近重复均为 0。
- 干净的本地浏览器会话逐条打开十条路由，桌面和 390px 视口均出现标题、首图、正文与参考资料；服务器的 8001 空端口分支实际显示连接失败。浏览器控制台没有新增 error 或 warning。

## 生产发布记录（2026-10-08）

- 内容 PR [#450](https://github.com/Gyschuaner/VibePolaris/pull/450) 已合入 `main`，生产源提交为 `1de99bfe7d1ee5c9e370d4d64f56f032da6eef3d`。
- 本机构建的 `linux/amd64` 镜像为 `vibepolaris:1de99bfe7d1ee5c9e370d4d64f56f032da6eef3d`；构建中的 `news:validate`、Next 静态生成 1091 页和容器启动均通过。
- 生产 release 为 `/opt/vibepolaris/releases/20261007T204157Z-1de99bfe`，`/opt/vibepolaris/current` 已原子切换到该目录；`vibepolaris-web-1` 使用新镜像并保持 `healthy`。
- 切换前 release 为 `/opt/vibepolaris/releases/20261007T183915Z-4d913eab`，旧镜像为 `vibepolaris:4d913eab903f7bf773e4126caaaf06f2f28abdcb`；备份为 `/opt/vibepolaris/backups/20261007T204157Z-from-4d913eab`。备份包含旧 Compose、容器和镜像检查信息，以及通过 SQLite `VACUUM INTO` 完成的在线备份 `xiaobei.sqlite`；`vibepolaris_xiaobei_data` 数据卷未替换。
- 生产机经 HTTPS server-local smoke 检查 `/`、`/news`、`/about`、`/sitemap.xml` 与本批十条 `/terms/*` 路由均返回 HTTP 200，十条页面的中文标题标记均命中；容器最近日志只有正常启动信息。
- 回滚入口为 `/opt/vibepolaris/releases/20261007T204157Z-1de99bfe/rollback.sh`，可恢复旧 Compose、旧镜像和旧 release；回滚不删除或覆盖上线后新增的 Xiaobei 数据。
- 按 `developer-platform-cli` 尝试以批次 `deploy-vbp100-http-foundations-prod-20261008` 记录生产 deployment，并用同一批次 ID 重试一次；两次均因 `SSL: UNEXPECTED_EOF_WHILE_READING` 未连接 DP。未伪造 deployment ID 或状态，待 DP 网络恢复后用同一批次 ID 补录并查询确认。
- 当前机器不存在规则指定的 `D:/Obsidian/gysnote`，本批没有写入该库。
