# VBP-075 · 传输与 HTTP 应用边界机制表

这批词条不是把一张“请求 → 服务端 → 响应”的图换十次颜色。每页只回答一个容易混淆的边界，并让首图中的对象真的发生一次可观察的变化。

| 词条 | 读者卡住的瞬间 | 首图要观察的变化 | 失败/边界分支 | 资料锚点 |
| --- | --- | --- | --- | --- |
| TCP | 文件少了一段，为什么应用仍收到连续内容 | 字节段出现缺口，ACK 指向缺口，重传后才交付连续流 | 连接成功不等于业务成功；TCP 没有消息边界 | RFC 9293 §3、RFC 5681 §3、RFC 1122 §4.2 |
| UDP | 实时声音为什么可以跳过旧帧 | 独立数据报乱序、丢一封，接收端仍保留每封边界 | 不自动排序、重传或拥塞控制；责任回到应用 | RFC 768、RFC 8085 |
| TLS 握手 | 小锁出现前到底确认了什么 | ClientHello/ServerHello → 证书主机名 → Finished → 加密 GET | 证书主机名不匹配时终止，不带未知身份发送数据 | RFC 8446 §4、RFC 9525、RFC 6066 |
| 响应体 | 200 到了，为什么有时没有可读内容 | Content-Encoding 先解码，Content-Type 再选择解析路径 | HEAD/204/304 的无内容是协议结果，不是解析崩溃 | RFC 9110 §6、§8、§15 |
| 响应头 | 同一 body 加一个字段就改变下一步 | Location、Set-Cookie、Retry-After、Vary 逐个接管客户端动作 | 头字段给元数据和控制信号，不能代替业务 body | RFC 9110 §5、§10、§12、§15；RFC 9111 |
| Cookie | 登录后浏览器为何自动带上某一小段值 | Cookie 罐按 Domain、Path、Secure、SameSite 筛选请求；HttpOnly 只收起脚本窗口 | Cookie 会随请求发送；属性不匹配就不会进入请求头 | RFC 6265 §4；MDN Cookies / Set-Cookie |
| CORS | 命令行能拿到，页面脚本却读不到 | 浏览器发起跨源请求，必要时先 OPTIONS 预检，再决定是否暴露响应 | 响应可到达浏览器但被脚本读取闸门挡住；CORS 不做认证 | Fetch Standard CORS protocol；MDN CORS / Preflight |
| WebSocket | 聊天页面如何不用轮询持续收到消息 | HTTP Upgrade 后状态从 CONNECTING 到 OPEN，双向帧流动，断线进入 CLOSED | 不自带重连、确认和补消息；Close 后不能继续发数据帧 | RFC 6455 §4–§7；MDN WebSocket |
| API 密钥 | 一串字符串为什么既能计量又可能泄露 | 代理保存 key，受限请求头提交，轮换后旧 key 变 401 | key 是 bearer 凭据；识别项目不等于证明最终用户有权限 | OWASP REST；Google Cloud API key guidance；AWS usage plans |
| RBAC | 一条岗位变更如何影响几十个人 | 用户被分配角色，角色带来动作权限，再落到资源范围检查 | 角色允许“读发票”不等于允许读任意租户的任意发票 | NIST RBAC；NIST SP 800-162；OWASP Authorization |

每页的段落引用 ID 与 `lib/transport-http-sources.ts` 一一对应；演示中的状态只在本地变换，不把动画当成协议的额外保证。
