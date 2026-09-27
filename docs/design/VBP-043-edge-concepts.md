# VBP-043 · 服务器、API 网关、反向代理

第 027 批沿用 Harness 词条的阅读壳、引用、目录和星图。三个概念共享一次浏览器访问后端的背景，但解释的职责不同。本文记录本批研究与验收，不替代 DP 的需求、任务和测试状态。

| 词条 | 读者要辨认的机制 | 初始对象 → 操作 → 可见变化 | 与邻页的边界 |
| --- | --- | --- | --- |
| 服务器 | 程序监听、接收请求、匹配资源并回应 | 浏览器与同一主机的端口 → 切路径、端口或监听状态 → 200、404 或连接失败 | 关注实际处理方与主机，不把所有请求都画成转发 |
| API 网关 | 公共策略先检查，再选择业务服务 | 请求、凭据、配额、两个服务 → 连续发送 → 401、429 或服务计数增加 | 关注进入服务前的检查；订单业务判断仍留给订单服务 |
| 反向代理 | 公开入口转交请求并带回上游响应 | 公开路径、代理、两个上游 → 转交、返回、错误信任 XFF → 上游选中与地址识别改变 | 关注代理的两向通信与可信代理链，不把它等同完整 API 管理平台 |

## 资料与正文位置

下列资料均已打开正文核对。规范与厂商文档支持各自明确的机制；页面中的路径、计数、地址和服务名是教学样例，不冒充产品默认配置或实测结果。

| 词条 | 已读资料 | 对应正文 |
| --- | --- | --- |
| 服务器 | IETF, [RFC 9110 §3.3](https://www.rfc-editor.org/rfc/rfc9110.html) | `server-role`：客户端／服务器是连接中的程序角色 |
| 服务器 | MDN, [What is a web server?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server) | `server-hardware`、`server-handler`：硬件与软件、找不到目标时的 404 |
| 服务器 | Node.js, [HTTP](https://nodejs.org/api/http.html) | `server-listen`：注册处理函数并调用 listen |
| 服务器 | Python Software Foundation, [http.server](https://docs.python.org/3/library/http.server.html) | `server-port`、`server-handler`：绑定地址、端口与请求处理 |
| API 网关 | Microsoft, [API gateways](https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway) | `gateway-role`、`gateway-boundary`：统一入口、转发与按产品选能力 |
| API 网关 | AWS, [Create routes for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html) | `gateway-route`：方法和路径匹配路由 |
| API 网关 | AWS, [Lambda authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html) | `gateway-auth`：授权器绑定路由 |
| API 网关 | AWS, [Throttle requests](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html) | `gateway-limit`：超限可能 429，限制是尽力而为的目标 |
| 反向代理 | IETF, [RFC 9110 §3.7](https://www.rfc-editor.org/rfc/rfc9110.html) | `proxy-role`：gateway／reverse proxy 的 HTTP 中间方职责 |
| 反向代理 | NGINX, [Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy) | `proxy-forward`、`proxy-headers`：proxy_pass、响应回传和字段设置 |
| 反向代理 | Apache, [Reverse Proxy Guide](https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html) | `proxy-path`、`proxy-redirect`：路径映射与 Location 改写 |
| 反向代理 | Cloudflare, [How Cloudflare DNS works](https://developers.cloudflare.com/fundamentals/concepts/how-cloudflare-works/) | `proxy-public`：公开代理与源站的位置关系 |
| 反向代理 | Envoy, [HTTP header manipulation](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers) | `proxy-trust`：X-Forwarded-For 可由客户端伪造，只信任已知代理链 |

## Skill 与文风复核

- 三页常驻正文分别说明定义、处理顺序、边界和失败定位；核心结论无需运行演示或打开补充区也能读懂。
- 场景不共用“三图标加曲线”：端口与处理、策略栈与后端计数、公开入口与上游路径分别占用不同空间。输入改变会清除旧结果，结果区域用现有 Reveal 完成进入与退出过渡。
- 复用语义图标，首图和演示保持正文宽度；引用段落有稳定 ID、角标和书目摘录，书目通过三角点击展开。旧锚点保留。
- 按 `write-like-me` 复核标题、开头与结尾：主语明确，说明谁处理或转交了什么；删去套话、宣传句和问题式模板；保留故障层级与产品能力限制。
- 构建 `npm run build` 通过，静态页面数 109，其中词条 98。Chrome 本地预览验证服务器 200／404／未监听，网关 401／200／429 与两服务计数，代理转交／返回及伪造 XFF；390px 下三页无横向溢出。后续 DP 测试执行与 dev 集成结果以实际记录为准。

## 合并后复核

再次对照 AWS 原文时，明确了网关演示中“两次成功转交”只是固定教学额度，不是 AWS 的速率窗口或令牌桶；正文已写出这层区别。三个偏设问的章节标题改为直接说明机制，目录与正文同步。

Chrome 复现了结果收起时文字先被清空的问题，记录为 `BUG-88C6B3E7`。共用 `Reveal` 现保留最后一次可见内容直到渐出结束；网关、服务器和反向代理三页分别验证了输入切换时旧结果完整退出，网关再次发送会显示新结果。修订后 `npm run build` 通过。
