# 109–118 词条文案更新记录 · VBP-041 / VBP-043 / VBP-044 / VBP-045

本批从当前 `origin/main`（`dff2326`）切出 `feat/VBP-041-045-content-audit`，一次处理十条已经存在的词条。目标是上线正文文字；Lessons、来源数组、注册表和互动逻辑留在本地实现。

## 范围与 DP

| 编号 | slug | 需求 | DP 研发任务 |
| --- | --- | --- | --- |
| 109 | streaming-output | VBP-041 | `f21d34de-085a-4234-99eb-11305f7b3e30` |
| 110 | structured-output | VBP-041 | `55100b30-92a6-474c-a1df-572752899247` |
| 111 | function-calling | VBP-041 | `850875a3-e138-4933-a739-c93241bf4bab` |
| 112 | server | VBP-043 | `451ffe7d-4b8f-433d-b0d1-15e0cda8ee4c` |
| 113 | api-gateway | VBP-043 | `422198c9-881c-45a6-b239-3236b37c2482` |
| 114 | reverse-proxy | VBP-043 | `94df1221-0fb2-4da4-af0b-035e956cc538` |
| 115 | load-balancer | VBP-044 | `f3511dcd-edfa-46ad-9b7c-01daa8e2384f` |
| 116 | auth | VBP-044 | `36b275ad-d8da-4995-b586-a8a18cd677d6` |
| 117 | authorization | VBP-044 | `1187ad2f-5991-409e-b034-76eb3eed1ced` |
| 118 | session | VBP-045 | `8a07606c-8550-4af4-88d7-54721d193f16` |

对应需求均在本批开始时为 `ready_for_release`，允许流转已核对；批量发布后再推进到 `released`。本批不改 JWT 与 OAuth 词条正文。

## 机制差异与正文合同

| slug | 读者应观察到的机制 | 本批正文边界 |
| --- | --- | --- |
| streaming-output | 增量事件先到、文字片段累加、完成事件单独到达；错误/取消/空文本分开 | 收到文字不等于整次响应完成；SSE 网络分块、协议事件与 token 不是同一单位；取消本地读取不证明远端动作撤回 |
| structured-output | JSON 可解析、字段形状、资料事实三层检查 | JSON 模式不等于 schema 合规；生成约束与生成后校验不同；格式合规仍可能事实错误或没有完整结果 |
| function-calling | 模型请求 → 应用检查 → 函数执行 → call_id 对应结果 | 参数可解析不等于授权；执行发生不等于业务成功；MCP 是一种工具交接协议，函数调用不要求必须通过 MCP |
| server | 主机端口和监听程序 → 路径匹配 → 200/404/连接不到 | 服务器按连接中的程序职责定义；404 是程序收到请求后的路径问题，未监听是连接找不到程序 |
| api-gateway | 统一入口先做凭据/限流检查，再按方法和路径交给后端 | AWS 授权器与限流行为按产品限定；401/429 与业务错误分层；网关不能替订单服务作业务决定 |
| reverse-proxy | 公开入口 → 上游请求 → 响应返回；可信代理配置改变客户端地址判断 | 上游、源站、路径改写、Location、TLS/502均按配置限定；X-Forwarded-For 不能天然信任 |
| load-balancer | 多实例按规则选目标，健康状态改变候选集合 | 轮询只是示例；会话亲和、健康检查与 fail-open 依产品；分流不保证业务正确 |
| auth | 身份声明 → 凭据核验 → 后续会话状态 | 主体、验证者、认证器分开；WebAuthn 挑战证明密钥控制；统一失败提示防止暴露账号状态；认证不等于授权 |
| authorization | 主体 × 资源 × 操作 → 允许/拒绝 | 默认拒绝；每次请求检查对象/功能；401 与 403 分开；教学矩阵不等于完整 AWS IAM |
| session | 浏览器不透明 ID ↔ 服务端记录；登录建立、Cookie 带回、退出失效 | 会话是本页选用的服务端方案；Cookie flags 不替代服务端失效；登录成功需轮换 ID，避免会话固定 |

互动组件中的事件、候选、订单、端口、服务计数、实例、凭据和会话记录都是本地教学数据。本批只上正文改动，互动功能保留本地实现。

## 资料研究与正文映射

每页保留四份已读原始资料，正文锚点沿用现有来源数组：

- streaming-output：OpenAI [Streaming API responses](https://developers.openai.com/api/docs/guides/streaming-responses)、WHATWG [SSE](https://html.spec.whatwg.org/multipage/server-sent-events.html)、Anthropic [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming)、MDN [AbortController.abort](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort)。
- structured-output：OpenAI [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)、JSON Schema [object](https://json-schema.org/understanding-json-schema/reference/object)、Anthropic [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)、Willard/Louf [Guided Generation](https://arxiv.org/pdf/2307.09702)。
- function-calling：OpenAI [Function calling](https://developers.openai.com/api/docs/guides/function-calling)、Anthropic [Tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)、MCP [Tools 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)、Toolformer [论文](https://arxiv.org/pdf/2302.04761)。
- server：IETF [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)、MDN [What is a web server?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server)、Node.js [HTTP](https://nodejs.org/api/http.html)、Python [http.server](https://docs.python.org/3/library/http.server.html)。
- api-gateway：Microsoft [API gateways](https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway)、AWS [Create routes](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)、AWS [Lambda authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html)、AWS [Throttle requests](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html)。
- reverse-proxy：IETF [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)、NGINX [Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy)、Apache [Reverse Proxy Guide](https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html)、Cloudflare [How Cloudflare DNS works](https://developers.cloudflare.com/fundamentals/concepts/how-cloudflare-works/)、Envoy [HTTP header manipulation](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers)。
- load-balancer：NGINX [HTTP load balancer](https://nginx.org/en/docs/http/load_balancing.html)、AWS [Target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html)、AWS [Health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html)、Cloudflare [Traffic steering](https://developers.cloudflare.com/load-balancing/understand-basics/traffic-steering/)。
- auth：NIST [SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html)、MDN [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication)、OWASP [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)、MDN [Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)。
- authorization：OWASP [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)、AWS [Policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_policy-eval-denyallow.html)、NIST [RBAC model](https://csrc.nist.gov/pubs/journal/1999/02/a-rolebased-access-control-model-and-reference-imp/final)、IETF [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)。
- session：NIST [Session Management](https://pages.nist.gov/800-63-4/sp800-63b/session/)、IETF [RFC 6265](https://www.rfc-editor.org/rfc/rfc6265.html)、MDN [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)、OWASP [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)。

## ZCode 协作证据

实际使用 `/Applications/ZCode.app/Contents/Resources/glm/zcode.cjs`，模型为 `Qwen3.8-Flash-Next-FP8`，`xhigh`。每页分别启动只读 `reader` 与 `language` 会话；language 会话按要求读取 `vibepolaris-zcode-partner/SKILL.md` 与 `humanizer-zh/SKILL.md`。ZCode 未修改代码，且未把源码阅读冒称浏览器视觉验收。

| slug | reader session | language session |
| --- | --- | --- |
| streaming-output | `sess_5d2d51c0-d0b3-41a7-8902-bc462a0b922c` | `sess_0cc7badc-eba6-4d0c-8c66-4cfc17de97ec` |
| structured-output | `sess_da29ffda-60e6-4408-83fe-f70d6b8f7868` | `sess_059af94f-836e-4e76-8d32-c63b6a75bb66` |
| function-calling | `sess_3fa7cbe2-fe6c-40e4-9d01-9b793cfe7477` | `sess_2c86d610-62f1-4f9e-8a69-65f2c77cceac` |
| server | `sess_440c8937-d5f7-4293-861b-6de2dc8ede80` | `sess_76bc1248-e456-4d79-8c24-cac26856d9b2` |
| api-gateway | `sess_ed7d42e1-f833-402a-b584-19d1afbf0c03` | `sess_97c6a3a8-c682-45d9-bf11-47a7b8c4e5d7` |
| reverse-proxy | `sess_aeb815de-22be-4941-8e8b-b0085cfac500` | `sess_4a949447-8722-46d4-b3f2-ba26327947ef` |
| load-balancer | `sess_a7e77c0b-500d-4512-a540-c45f2a5fe818` | `sess_9e0683f7-52bb-4b4e-b1b5-0bf3b63949fc` |
| auth | `sess_f7eb5294-030d-45a2-9a4d-e82a34a6ecca` | `sess_b2dd4471-894b-474a-9d5c-020b831d2b34` |
| authorization | `sess_a970720d-859c-421a-abee-fd914e39489f` | `sess_6994cfc6-24f4-4dc4-8d1a-b4b905c72035` |
| session | `sess_1a2c70a2-3a41-4fa3-bcd5-1527af3a804d` | `sess_5fde9038-7dfa-4e4f-987f-517f45e44032` |

已吸收的主要意见：补足普通读者的主语和陌生术语，明确 API 网关/反向代理/负载均衡边界，区分 401/403、404/未监听、参数合规/授权、会话 ID/服务端失效，保留产品范围和演示限制。未采纳会扩大机制、改变来源边界或未经演示核实的建议。

## 实现与本地验证

- 代码改动只在 `components/terms/ModelOutputPages.tsx`、`EdgeConceptPages.tsx`、`AccessConceptPages.tsx`、`IdentityConceptPages.tsx` 四个正文组件。
- `git diff --check` 通过。
- `npm ci` 完成；npm 报告 2 个已有依赖漏洞（1 high、1 critical），本批未升级依赖。
- `npm run build` 通过：117/117 静态页生成，TypeScript 检查通过。
- 本地真实浏览器地址为 `http://localhost:3237`，十条路由均返回 HTTP 200；逐条操作现有 Lesson 的主流程：流式建立/接收、结构化生成检查、函数请求/执行、服务器发送、网关转发、代理转交/返回、负载均衡送入、认证登录/访问、授权检查、会话登录/访问/退出。十条更新后的正文均在 AX 树中可见，未见应用错误。
- 浏览器验收只覆盖本批受影响路由与主交互，不等同生产验收；当前尚未合入 main、尚未部署生产。

Obsidian 路径 `D:/Obsidian/gysnote` 在当前 Mac 环境不存在，跳过项目训练记录。

## 批量上线结果

- PR [#266](https://github.com/Gyschuaner/VibePolaris/pull/266) 已合入 `main`，合并提交为 `b9ea01d`。生产叠加分支为 `release/VBP-041-prod-overlay-20261001`，提交 `bc115f2e2c089a4aee6766d16ec5e6b0452b0ea1`。
- 生产镜像为 `vibepolaris:bc115f2e2c089a4aee6766d16ec5e6b0452b0ea1`，release 目录为 `/opt/vibepolaris/releases/20261001T135438Z-bc115f2e`。部署记录为 `deploy-vbp041-045-content-109-118-prod-20261001`，DP deployment ID `2f15b9f5-9ad4-42af-9ee3-9dd161e583c7`，状态 `released`。
- 回滚基线为 `/opt/vibepolaris/releases/20261001T123129Z-10914cce0534`，对应旧镜像 `vibepolaris:10914cce053471e27c33a117ebcc496784507f13`；回滚使用旧 Compose、旧镜像和旧 release 目录，数据库卷未改动。
- 生产健康检查通过。十条路由 `/terms/streaming-output`、`/terms/structured-output`、`/terms/function-calling`、`/terms/server`、`/terms/api-gateway`、`/terms/reverse-proxy`、`/terms/load-balancer`、`/terms/auth`、`/terms/authorization`、`/terms/session` 与 `/news` 均返回 HTTP 200；十条正文关键词校验通过。
- 生产 CUA 完成 `streaming-output` 与 `session` 的关键交互验收。Obsidian 路径 `D:/Obsidian/gysnote` 在当前 Mac 环境不存在，跳过项目训练记录。
