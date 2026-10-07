# VBP-096 传输中加密：研究与演示设计

## 研究结论

传输中加密的对象不是“整张网络”，而是每一对通信端点之间的 TLS 通道。TLS 1.3 的握手协商版本、密码参数与密钥交换材料，记录层再使用导出的流量密钥保护应用记录；服务身份验证与加密内容保护是相连但不同的检查。代理、CDN 或负载均衡器终止 TLS 后，下一跳必须重新建立自己的协议、证书身份和记录层保护。

文章把三个容易混在一起的判断拆开：证书签名可信不代表目标主机名匹配；浏览器地址栏有锁不代表内部每一段都仍是密文；TLS 通道建立成功也不代表应用授权、静态副本保护或 0-RTT 重放边界已经解决。

## 资料与段落映射

| 来源 | 用途 | 文章段落 |
| --- | --- | --- |
| [RFC 8446](https://www.rfc-editor.org/rfc/rfc8446.html) | TLS 1.3 握手、记录层、0-RTT | `transit-channel`, `transit-handshake`, `transit-record`, `transit-0rtt` |
| [RFC 9525](https://www.rfc-editor.org/rfc/rfc9525.html) | reference identity、SAN、SNI 的边界 | `transit-identity`, `transit-san`, `transit-sni` |
| [NIST SP 800-52 Rev. 2](https://csrc.nist.gov/pubs/sp/800/52/r2/final) | TLS 版本、密码与证书配置指导 | `transit-config`, `transit-version` |
| [OWASP TLS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) | 终止后续链路、全站 TLS、Cookie 与密码策略 | `transit-hop`, `transit-all-pages`, `transit-cookie`, `transit-strong` |
| [MDN TLS](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security) | 浏览器握手、中间人与端点边界 | `transit-channel`, `transit-handshake`, `transit-endpoint`, `transit-mixed` |

五个 URL 已于实现前逐一检查返回 200；页面引用使用同一组 URL，顺序与项目研究和 experience 数据保持一致。

## 演示设计

首图不再画普通的浏览器→CDN→负载均衡→应用流程线，而是把同一份 `Authorization` 订单请求画成一份包裹，下面排三枚代表端点对的封条：浏览器→CDN、CDN→负载均衡、负载均衡→应用。五个有限帧依次呈现第一段封住、握手核对、代理打开导致字段可见、下一跳重新封住、SAN 不匹配停在 0 B。封条状态、包裹内容和结果数字每一帧保持一致。

正文实验提供三种本地链路：每一跳重加密、CDN 后回退 HTTP、内部证书身份错误。实验只改变本地状态，不请求网络；检查按钮给出 `PASS`、`LEAK` 或 `BLOCKED`，把“看见 HTTPS”落到可验收字段。

## 验收清单

- 首图保持紧凑，主变化是封条盖上、打开、重新盖回和阻断，不使用重复说明堆叠。
- autoplay 为有限序列；离开视口、切后台或 `prefers-reduced-motion` 时停止，可手动逐帧和重播。
- 三种实验分支能观察 `ciphertext`、`Authorization visible`、`SAN mismatch / 0 B` 三个不同结果。
- 文章每个事实段落都有 citation id，五个来源各自有用途，无孤立引用。
- 移动端封条纵向堆叠，按钮和状态具备可读文本与 `aria-live`，不依赖颜色单独传达结果。
