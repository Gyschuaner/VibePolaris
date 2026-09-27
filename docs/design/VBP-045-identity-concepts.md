# VBP-045 · 会话、JWT 与 OAuth 2.0

第 029 批围绕“登录后仍能访问、声明如何被验证、第三方怎样取得有限权限”三个相邻问题。每页先写常驻正文，再用一个可操作场景核对理解。

| 词条 | 读者需要辨认的机制 | 演示的对象与结果 | 边界 |
| --- | --- | --- | --- |
| 会话 | 服务如何把多次请求关联到一次认证 | 浏览器 ID、服务端记录；退出后用旧 ID 重试 | 服务端会话是本页选用的方案，不概括所有会话实现 |
| JWT | 一组声明怎样受签名保护，并按用途验证 | 结构条带；改写载荷、过期与原始令牌分别验收 | 图不执行密码学；JWT 也可加密，不必然是访问令牌 |
| OAuth 2.0 | 用户怎样把有限资源访问权交给第三方 | 同意、授权码、PKCE、令牌、读取；拒绝和材料不匹配分支 | 授权不直接证明用户身份；示例限定为授权码配合 PKCE |

## 已读资料与正文对应

下列资料均已打开正文，并按列出的锚点进入文章角标和书目。规范要求与本站教学例子在正文中分开说明。

| 词条 | 资料 | 支持的正文 |
| --- | --- | --- |
| 会话 | NIST, [SP 800-63B-4 Session Management](https://pages.nist.gov/800-63-4/sp800-63b/session/) | `session-purpose`, `session-secret`, `session-expiry`：会话绑定、秘密与终止 |
| 会话 | IETF, [RFC 6265](https://www.rfc-editor.org/rfc/rfc6265.html) | `session-cookie`：Set-Cookie 与后续 Cookie 请求 |
| 会话 | MDN, [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie) | `session-flags`：Secure、HttpOnly、SameSite 的各自作用 |
| 会话 | OWASP, [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) | `session-rotate`, `session-logout`：登录后换 ID、退出失效 |
| JWT | IETF, [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html) | `jwt-format`, `jwt-claims`：JWT 定义与常见声明 |
| JWT | IETF, [RFC 7515](https://www.rfc-editor.org/rfc/rfc7515.html) | `jwt-signature`, `jwt-tamper`：JWS 紧凑结构与签名输入 |
| JWT | IETF, [RFC 7516](https://www.rfc-editor.org/rfc/rfc7516.html) | `jwt-encryption`：JWE 五段紧凑结构 |
| JWT | IETF, [RFC 8725](https://www.rfc-editor.org/rfc/rfc8725.html) | `jwt-validation`, `jwt-context`：签发者、受众、用途及验证规则 |
| OAuth 2.0 | IETF, [RFC 6749](https://www.rfc-editor.org/rfc/rfc6749.html) | `oauth-purpose`, `oauth-code`, `oauth-token-format`：角色、授权码流程与令牌格式边界 |
| OAuth 2.0 | IETF, [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636.html) | `oauth-pkce`：挑战值与校验材料不匹配时拒绝 |
| OAuth 2.0 | IETF, [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html) | `oauth-scope`, `oauth-current`：最小权限及 PKCE 当前建议 |
| OAuth 2.0 | IETF, [RFC 6750](https://www.rfc-editor.org/rfc/rfc6750.html) | `oauth-bearer`：Bearer 令牌被持有者使用的风险 |
| OAuth 2.0 | OpenID Foundation, [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) | `oauth-identity`：OAuth 上的身份层 |

## 本批 review

- 常驻正文在不播放演示的情况下说明三页的定义、因果过程、边界与失败条件。标题写具体动作或判断，未复用“三图标加曲线”的首图结构。
- 会话页用两侧记录和旧 ID 重试；JWT 页用结构条带和验证结果；OAuth 页用同意卡片与逐步交付的凭据。改输入或重置后，不把上一结果当作当前结果。
- `jwt` 元数据移除“访问令牌”同义词及所有 JWT 都是三段式的概括；`oauth` 元数据移除“授权登录”同义词。来源角标逐段映射，未拿 RFC 6749 的旧授权类型当作新实现建议。
- `npm run build` 通过，生成 115 个静态页面，其中 104 个词条。Chrome 本地预览执行 DP 测试计划 `701f30ca-c1dc-40de-abe5-527aece9f02e`，三例通过；三页在 390px 下无横向溢出。验收时发现“从未登录”分支误露旧 Cookie，已修正并复查；JWT 窄屏结构改为纵向排列。
- dev 集成结果在合并后填写；生产尚未发布。
